import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  analyzeDigitalDna,
  createWeeklyReflection,
  defaultProfile,
  generateFeedSimulation,
  sampleConsumption,
} from "./domain.js";

const DEFAULT_USER_ID = "local-demo-user";
const STORE_PATH = process.env.ATTENTIONOS_STORE_PATH || join(process.cwd(), "data", "attentionos-store.json");

function clone(value) {
  return structuredClone(value);
}

function nowIso() {
  return new Date().toISOString();
}

function createPrivacyDefaults() {
  return {
    consentGranted: false,
    captureEnabled: false,
    allowedFields: ["title", "url", "host", "capturedAt"],
    retentionDays: 30,
    updatedAt: nowIso(),
  };
}

function createUserState(userId = DEFAULT_USER_ID) {
  const profile = { ...clone(defaultProfile), id: userId };
  const consumption = clone(sampleConsumption);
  const analysis = analyzeDigitalDna(profile, consumption);
  return {
    profile,
    consumption,
    analysis,
    feed: generateFeedSimulation(profile, analysis),
    reflection: createWeeklyReflection(profile, analysis),
    jobs: [
      {
        id: "job-demo-scan",
        type: "digital_dna_scan",
        status: "succeeded",
        request_id: "req-demo-001",
        entity_id: userId,
        result: { attentionScore: analysis.attentionScore },
      },
    ],
    privacy: createPrivacyDefaults(),
    auditLog: [
      {
        at: nowIso(),
        action: "user_state_initialized",
      },
    ],
  };
}

function createInitialStore() {
  return {
    version: 1,
    users: {
      [DEFAULT_USER_ID]: createUserState(DEFAULT_USER_ID),
    },
  };
}

async function ensureStoreLoaded() {
  if (globalThis.__attentionOsStore) return globalThis.__attentionOsStore;

  try {
    const raw = await readFile(STORE_PATH, "utf8");
    globalThis.__attentionOsStore = normalizeStore(JSON.parse(raw));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
    globalThis.__attentionOsStore = createInitialStore();
    await persistStore();
  }

  return globalThis.__attentionOsStore;
}

function normalizeStore(store) {
  const normalized = store && typeof store === "object" ? store : createInitialStore();
  normalized.version = normalized.version || 1;
  normalized.users = normalized.users && typeof normalized.users === "object" ? normalized.users : {};
  if (!normalized.users[DEFAULT_USER_ID]) normalized.users[DEFAULT_USER_ID] = createUserState(DEFAULT_USER_ID);
  for (const [userId, userState] of Object.entries(normalized.users)) {
    normalized.users[userId] = normalizeUserState(userId, userState);
  }
  return normalized;
}

function normalizeUserState(userId, userState) {
  const state = userState && typeof userState === "object" ? userState : createUserState(userId);
  state.profile = { ...clone(defaultProfile), ...(state.profile || {}), id: userId };
  state.consumption = Array.isArray(state.consumption) ? state.consumption : clone(sampleConsumption);
  state.jobs = Array.isArray(state.jobs) ? state.jobs : [];
  state.privacy = { ...createPrivacyDefaults(), ...(state.privacy || {}) };
  state.auditLog = Array.isArray(state.auditLog) ? state.auditLog : [];
  recomputeUserState(state);
  return state;
}

async function persistStore() {
  if (!globalThis.__attentionOsStore) return;
  await mkdir(dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(globalThis.__attentionOsStore, null, 2)}\n`, "utf8");
}

function userIdOrDefault(userId) {
  return typeof userId === "string" && /^[a-zA-Z0-9._-]{1,80}$/.test(userId) ? userId : DEFAULT_USER_ID;
}

export async function getStore() {
  return ensureStoreLoaded();
}

export async function getUserStore(userId = DEFAULT_USER_ID) {
  const store = await ensureStoreLoaded();
  const safeUserId = userIdOrDefault(userId);
  if (!store.users[safeUserId]) {
    store.users[safeUserId] = createUserState(safeUserId);
    await persistStore();
  }
  return store.users[safeUserId];
}

export async function updateProfile(userId, profilePatch) {
  const store = await getUserStore(userId);
  const allowed = {};
  if (typeof profilePatch.identity === "string") allowed.identity = profilePatch.identity.trim().slice(0, 120);
  if (typeof profilePatch.weeklyIntent === "string") allowed.weeklyIntent = profilePatch.weeklyIntent.trim().slice(0, 500);
  if (Number.isFinite(profilePatch.discoveryLevel)) {
    allowed.discoveryLevel = Math.max(0, Math.min(100, Number(profilePatch.discoveryLevel)));
  }
  if (Array.isArray(profilePatch.focusAreas)) allowed.focusAreas = normalizeFocusAreas(profilePatch.focusAreas);
  if (Array.isArray(profilePatch.passions)) allowed.passions = normalizeStringList(profilePatch.passions, 12);
  if (Array.isArray(profilePatch.blockedTags)) allowed.blockedTags = normalizeStringList(profilePatch.blockedTags, 24);

  store.profile = {
    ...store.profile,
    ...allowed,
    id: userIdOrDefault(userId),
  };
  addAudit(store, "profile_updated");
  recomputeUserState(store);
  await persistStore();
  return store.profile;
}

export async function replaceConsumption(userId, consumption) {
  const store = await getUserStore(userId);
  store.consumption = consumption.map(normalizeContentItem);
  addAudit(store, "consumption_replaced");
  recomputeUserState(store);
  await persistStore();
  return store.analysis;
}

export async function addConsumptionItem(userId, item) {
  const store = await getUserStore(userId);
  store.consumption = [
    {
      ...normalizeContentItem(item),
      id: `c-${Date.now()}`,
    },
    ...store.consumption,
  ];
  addAudit(store, item.source === "extension_capture" ? "extension_capture_added" : "consumption_item_added");
  recomputeUserState(store);
  await persistStore();
  return store.analysis;
}

export async function createJob(userId, type) {
  const store = await getUserStore(userId);
  const job = {
    id: `job-${Date.now()}`,
    type,
    status: "queued",
    request_id: `req-${Date.now()}`,
    entity_id: userIdOrDefault(userId),
  };
  store.jobs = [job, ...store.jobs];
  addAudit(store, "job_created");
  await persistStore();
  return job;
}

export async function updatePrivacy(userId, privacyPatch) {
  const store = await getUserStore(userId);
  const nextPrivacy = { ...store.privacy };
  if (typeof privacyPatch.consentGranted === "boolean") nextPrivacy.consentGranted = privacyPatch.consentGranted;
  if (typeof privacyPatch.captureEnabled === "boolean") nextPrivacy.captureEnabled = privacyPatch.captureEnabled;
  if (Array.isArray(privacyPatch.allowedFields)) {
    const allowed = ["title", "url", "host", "capturedAt", "platform", "tags"];
    nextPrivacy.allowedFields = normalizeStringList(privacyPatch.allowedFields, 12).filter((field) => allowed.includes(field));
  }
  if (Number.isFinite(privacyPatch.retentionDays)) {
    nextPrivacy.retentionDays = Math.max(1, Math.min(365, Number(privacyPatch.retentionDays)));
  }
  nextPrivacy.updatedAt = nowIso();
  store.privacy = nextPrivacy;
  addAudit(store, "privacy_updated");
  await persistStore();
  return store.privacy;
}

export async function exportUserData(userId) {
  const store = await getUserStore(userId);
  return {
    exportedAt: nowIso(),
    userId: userIdOrDefault(userId),
    profile: store.profile,
    consumption: store.consumption,
    analysis: store.analysis,
    feed: store.feed,
    reflection: store.reflection,
    privacy: store.privacy,
    jobs: store.jobs,
    auditLog: store.auditLog,
  };
}

export async function deleteUserData(userId) {
  const store = await ensureStoreLoaded();
  const safeUserId = userIdOrDefault(userId);
  store.users[safeUserId] = createUserState(safeUserId);
  store.users[safeUserId].privacy = {
    ...createPrivacyDefaults(),
    consentGranted: false,
    captureEnabled: false,
    updatedAt: nowIso(),
  };
  store.users[safeUserId].auditLog = [{ at: nowIso(), action: "user_data_deleted_and_reset" }];
  await persistStore();
  return store.users[safeUserId];
}

export function userCanCapture(userState) {
  return Boolean(userState?.privacy?.consentGranted && userState?.privacy?.captureEnabled);
}

function normalizeFocusAreas(focusAreas) {
  return focusAreas.slice(0, 12).map((area) => ({
    name: String(area.name || "Focus area").trim().slice(0, 80),
    weight: Math.max(0, Math.min(100, Number(area.weight || 0))),
    tags: normalizeStringList(area.tags || [], 12),
  }));
}

function normalizeStringList(values, maxItems) {
  return values
    .slice(0, maxItems)
    .map((value) => String(value || "").trim().slice(0, 80))
    .filter(Boolean);
}

function normalizeContentItem(item) {
  return {
    id: String(item.id || `c-${Date.now()}`).slice(0, 120),
    title: String(item.title || "Untitled source").trim().slice(0, 200),
    platform: String(item.platform || "Unknown").trim().slice(0, 80),
    minutes: Math.max(0, Math.min(1440, Number(item.minutes || 0))),
    tags: normalizeStringList(item.tags || [], 20),
    qualitySignal: Math.max(0, Math.min(1, Number(item.qualitySignal ?? 0.5))),
    source: item.source ? String(item.source).slice(0, 80) : "manual",
    url: item.url ? String(item.url).slice(0, 500) : undefined,
    host: item.host ? String(item.host).slice(0, 160) : undefined,
    capturedAt: item.capturedAt ? String(item.capturedAt).slice(0, 80) : undefined,
  };
}

function addAudit(store, action) {
  store.auditLog = [
    {
      at: nowIso(),
      action,
    },
    ...(store.auditLog || []),
  ].slice(0, 200);
}

function recomputeUserState(store) {
  store.analysis = analyzeDigitalDna(store.profile, store.consumption);
  store.feed = generateFeedSimulation(store.profile, store.analysis);
  store.reflection = createWeeklyReflection(store.profile, store.analysis);
}
