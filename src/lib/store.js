import {
  analyzeDigitalDna,
  createWeeklyReflection,
  defaultProfile,
  generateFeedSimulation,
  sampleConsumption,
} from "./domain.js";

function createInitialStore() {
  const analysis = analyzeDigitalDna(defaultProfile, sampleConsumption);
  return {
    profile: defaultProfile,
    consumption: sampleConsumption,
    analysis,
    feed: generateFeedSimulation(defaultProfile, analysis),
    reflection: createWeeklyReflection(defaultProfile, analysis),
    jobs: [
      {
        id: "job-demo-scan",
        type: "digital_dna_scan",
        status: "succeeded",
        request_id: "req-demo-001",
        entity_id: defaultProfile.id,
        result: { attentionScore: analysis.attentionScore },
      },
    ],
  };
}

export function getStore() {
  if (!globalThis.__attentionOsStore) {
    globalThis.__attentionOsStore = createInitialStore();
  }
  return globalThis.__attentionOsStore;
}

export function updateProfile(profilePatch) {
  const store = getStore();
  store.profile = {
    ...store.profile,
    ...profilePatch,
    focusAreas: profilePatch.focusAreas || store.profile.focusAreas,
    passions: profilePatch.passions || store.profile.passions,
    blockedTags: profilePatch.blockedTags || store.profile.blockedTags,
  };
  recomputeStore();
  return store.profile;
}

export function replaceConsumption(consumption) {
  const store = getStore();
  store.consumption = consumption;
  recomputeStore();
  return store.analysis;
}

export function addConsumptionItem(item) {
  const store = getStore();
  store.consumption = [
    {
      id: `c-${Date.now()}`,
      title: item.title,
      platform: item.platform,
      minutes: Number(item.minutes || 0),
      tags: item.tags || [],
      qualitySignal: Number(item.qualitySignal ?? 0.5),
    },
    ...store.consumption,
  ];
  recomputeStore();
  return store.analysis;
}

export function createJob(type) {
  const store = getStore();
  const job = {
    id: `job-${Date.now()}`,
    type,
    status: "queued",
    request_id: `req-${Date.now()}`,
    entity_id: store.profile.id,
  };
  store.jobs = [job, ...store.jobs];
  return job;
}

function recomputeStore() {
  const store = getStore();
  store.analysis = analyzeDigitalDna(store.profile, store.consumption);
  store.feed = generateFeedSimulation(store.profile, store.analysis);
  store.reflection = createWeeklyReflection(store.profile, store.analysis);
}
