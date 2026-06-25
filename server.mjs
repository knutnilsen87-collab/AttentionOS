import { createReadStream, existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, isAbsolute, join, normalize, relative, resolve } from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { canTransitionJob, verifyProviderContract } from "./src/lib/domain.js";
import {
  addConsumptionItem,
  createJob,
  deleteUserData,
  exportUserData,
  getUserStore,
  replaceConsumption,
  updatePrivacy,
  updateProfile,
  userCanCapture,
} from "./src/lib/store.js";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(root, "public");
const port = Number(process.env.PORT || 3000);
const maxBodyBytes = Number(process.env.ATTENTIONOS_MAX_BODY_BYTES || 128 * 1024);
const defaultUserId = "local-demo-user";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
};

const staticAliases = new Map([
  ["/src/lib/domain.js", join(root, "src", "lib", "domain.js")],
]);

class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function requestId() {
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sendJson(response, status, data, headers = {}) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...headers,
  });
  response.end(JSON.stringify(data));
}

function sendError(response, request_id, status, code, message) {
  return sendJson(response, status, {
    error: {
      code,
      message,
      request_id,
    },
  });
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) {
      throw new ApiError(413, "body_too_large", `Request body exceeds ${maxBodyBytes} bytes.`);
    }
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new ApiError(400, "invalid_json", "Request body must be valid JSON.");
  }
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, decodeURIComponent(value)]),
  );
}

function normalizeUserId(value) {
  const candidate = String(value || "").trim();
  return /^[a-zA-Z0-9._-]{1,80}$/.test(candidate) ? candidate : defaultUserId;
}

function getSession(request) {
  const cookies = parseCookies(request.headers.cookie || "");
  return normalizeUserId(request.headers["x-attentionos-user"] || cookies.aos_user || defaultUserId);
}

function sessionCookie(userId) {
  return `aos_user=${encodeURIComponent(userId)}; Path=/; SameSite=Lax; HttpOnly`;
}

function validateContentItem(item) {
  return (
    item &&
    typeof item.title === "string" &&
    item.title.trim().length > 0 &&
    typeof item.platform === "string" &&
    item.platform.trim().length > 0 &&
    Number.isFinite(Number(item.minutes)) &&
    Number(item.minutes) >= 0 &&
    (!item.tags || Array.isArray(item.tags)) &&
    (item.qualitySignal === undefined || (Number(item.qualitySignal) >= 0 && Number(item.qualitySignal) <= 1))
  );
}

async function handleApi(request, response, url, request_id) {
  const path = url.pathname.replace("/api/v1", "") || "/";
  const userId = getSession(request);
  const cookieHeader = { "set-cookie": sessionCookie(userId) };

  if (request.method === "GET" && path === "/health") {
    return sendJson(response, 200, {
      ok: true,
      service: "attentionos",
      version: "0.2.0",
      request_id,
    });
  }

  if (request.method === "GET" && path === "/session") {
    const store = await getUserStore(userId);
    return sendJson(response, 200, { userId, privacy: store.privacy, request_id }, cookieHeader);
  }

  if (request.method === "POST" && path === "/session") {
    const body = await readJson(request);
    const nextUserId = normalizeUserId(body.userId);
    const store = await getUserStore(nextUserId);
    return sendJson(response, 200, { userId: nextUserId, privacy: store.privacy, request_id }, {
      "set-cookie": sessionCookie(nextUserId),
    });
  }

  if (request.method === "GET" && path === "/profile") {
    return sendJson(response, 200, { profile: (await getUserStore(userId)).profile, request_id }, cookieHeader);
  }

  if (request.method === "PATCH" && path === "/profile") {
    const body = await readJson(request);
    return sendJson(response, 200, { profile: await updateProfile(userId, body), request_id }, cookieHeader);
  }

  if (request.method === "GET" && path === "/content-scan") {
    const store = await getUserStore(userId);
    return sendJson(response, 200, { consumption: store.consumption, analysis: store.analysis, request_id }, cookieHeader);
  }

  if (request.method === "POST" && path === "/content-scan") {
    const store = await getUserStore(userId);
    const body = await readJson(request);
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length || !items.every(validateContentItem)) {
      return sendError(response, request_id, 400, "validation_error", "items are required and must be valid.");
    }
    if (items.some((item) => item.source === "extension_capture") && !userCanCapture(store)) {
      return sendError(response, request_id, 403, "capture_consent_required", "Enable consent before extension capture.");
    }
    const analysis =
      body.mode === "replace" ? await replaceConsumption(userId, items) : await addConsumptionItem(userId, items[0]);
    return sendJson(response, 200, { analysis, request_id }, cookieHeader);
  }

  if (request.method === "GET" && path === "/alignment") {
    return sendJson(response, 200, { analysis: (await getUserStore(userId)).analysis, request_id }, cookieHeader);
  }

  if (request.method === "GET" && path === "/feed-simulator") {
    const store = await getUserStore(userId);
    return sendJson(response, 200, { feed: store.feed, analysis: store.analysis, request_id }, cookieHeader);
  }

  if (request.method === "GET" && path === "/reflection") {
    return sendJson(response, 200, { reflection: (await getUserStore(userId)).reflection, request_id }, cookieHeader);
  }

  if (request.method === "GET" && path === "/privacy") {
    return sendJson(response, 200, { privacy: (await getUserStore(userId)).privacy, request_id }, cookieHeader);
  }

  if (request.method === "PATCH" && path === "/privacy") {
    return sendJson(response, 200, { privacy: await updatePrivacy(userId, await readJson(request)), request_id }, cookieHeader);
  }

  if (request.method === "GET" && path === "/export") {
    return sendJson(response, 200, { data: await exportUserData(userId), request_id }, cookieHeader);
  }

  if (request.method === "DELETE" && path === "/user-data") {
    const reset = await deleteUserData(userId);
    return sendJson(response, 200, { ok: true, profile: reset.profile, privacy: reset.privacy, request_id }, cookieHeader);
  }

  if (request.method === "POST" && path === "/provider/verify") {
    const result = verifyProviderContract(await readJson(request));
    return sendJson(response, result.ok ? 200 : 502, { ...result, request_id }, cookieHeader);
  }

  if (request.method === "GET" && path === "/jobs") {
    return sendJson(response, 200, { jobs: (await getUserStore(userId)).jobs, request_id }, cookieHeader);
  }

  if (request.method === "POST" && path === "/jobs") {
    const body = await readJson(request);
    if (!["digital_dna_scan", "weekly_reflection", "feed_simulation"].includes(body.type)) {
      return sendError(response, request_id, 400, "validation_error", "unsupported job type");
    }
    return sendJson(response, 201, { job: await createJob(userId, body.type), request_id }, cookieHeader);
  }

  if (request.method === "POST" && path === "/jobs/transition") {
    const body = await readJson(request);
    const ok = canTransitionJob(body.from, body.to);
    return sendJson(response, ok ? 200 : 409, { ok, request_id }, cookieHeader);
  }

  return sendError(response, request_id, 404, "not_found", "Route not found.");
}

async function handleStatic(_request, response, url) {
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const alias = staticAliases.get(requested);
  const filePath = alias || normalize(join(publicDir, requested));
  const allowedBase = alias ? resolve(join(root, "src", "lib")) : resolve(publicDir);
  const resolvedFile = resolve(filePath);

  const rel = relative(allowedBase, resolvedFile);
  const outsideBase = rel.startsWith("..") || isAbsolute(rel);
  if (outsideBase) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  if (!existsSync(resolvedFile) || !statSync(resolvedFile).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": mimeTypes[extname(resolvedFile)] || "application/octet-stream",
    "cache-control": requested === "/index.html" ? "no-store" : "public, max-age=3600",
  });
  createReadStream(resolvedFile).pipe(response);
}

createServer(async (request, response) => {
  const id = requestId();
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/v1")) return await handleApi(request, response, url, id);
    return await handleStatic(request, response, url);
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(response, id, error.status, error.code, error.message);
    }
    return sendError(response, id, 500, "internal_error", error.message);
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`AttentionOS running at http://127.0.0.1:${port}`);
});

export async function readPublicFile(pathname) {
  return readFile(join(publicDir, pathname), "utf8");
}
