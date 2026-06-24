import { createReadStream, existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { canTransitionJob, verifyProviderContract } from "./src/lib/domain.js";
import { addConsumptionItem, createJob, getStore, replaceConsumption, updateProfile } from "./src/lib/store.js";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(root, "public");
const port = Number(process.env.PORT || 3000);

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
};

function sendJson(response, status, data) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(data));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function validateContentItem(item) {
  return item && typeof item.title === "string" && typeof item.platform === "string" && Number.isFinite(Number(item.minutes));
}

async function handleApi(request, response, url) {
  const store = getStore();
  const path = url.pathname.replace("/api/v1", "") || "/";

  if (request.method === "GET" && path === "/health") {
    return sendJson(response, 200, {
      ok: true,
      service: "attentionos",
      version: "0.1.0",
      request_id: `req-${Date.now()}`,
    });
  }

  if (request.method === "GET" && path === "/profile") return sendJson(response, 200, { profile: store.profile });

  if (request.method === "PATCH" && path === "/profile") {
    const body = await readJson(request);
    return sendJson(response, 200, { profile: updateProfile(body) });
  }

  if (request.method === "GET" && path === "/content-scan") {
    return sendJson(response, 200, { consumption: store.consumption, analysis: store.analysis });
  }

  if (request.method === "POST" && path === "/content-scan") {
    const body = await readJson(request);
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length || !items.every(validateContentItem)) {
      return sendJson(response, 400, { error: { code: "validation_error", details: "items are required" } });
    }
    const analysis = body.mode === "replace" ? replaceConsumption(items) : addConsumptionItem(items[0]);
    return sendJson(response, 200, { analysis });
  }

  if (request.method === "GET" && path === "/alignment") return sendJson(response, 200, { analysis: store.analysis });
  if (request.method === "GET" && path === "/feed-simulator") {
    return sendJson(response, 200, { feed: store.feed, analysis: store.analysis });
  }
  if (request.method === "GET" && path === "/reflection") return sendJson(response, 200, { reflection: store.reflection });

  if (request.method === "POST" && path === "/provider/verify") {
    const result = verifyProviderContract(await readJson(request));
    return sendJson(response, result.ok ? 200 : 502, result);
  }

  if (request.method === "GET" && path === "/jobs") return sendJson(response, 200, { jobs: store.jobs });

  if (request.method === "POST" && path === "/jobs") {
    const body = await readJson(request);
    if (!["digital_dna_scan", "weekly_reflection", "feed_simulation"].includes(body.type)) {
      return sendJson(response, 400, { error: { code: "validation_error", details: "unsupported job type" } });
    }
    return sendJson(response, 201, { job: createJob(body.type) });
  }

  if (request.method === "POST" && path === "/jobs/transition") {
    const body = await readJson(request);
    return sendJson(response, canTransitionJob(body.from, body.to) ? 200 : 409, {
      ok: canTransitionJob(body.from, body.to),
    });
  }

  return sendJson(response, 404, { error: { code: "not_found" } });
}

async function handleStatic(_request, response, url) {
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const baseDir = requested.startsWith("/src/lib/") ? root : publicDir;
  const filePath = normalize(join(baseDir, requested));
  if (!filePath.startsWith(baseDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
    "cache-control": requested === "/index.html" ? "no-store" : "public, max-age=3600",
  });
  createReadStream(filePath).pipe(response);
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/v1")) return await handleApi(request, response, url);
    return await handleStatic(request, response, url);
  } catch (error) {
    sendJson(response, 500, { error: { code: "internal_error", message: error.message } });
  }
}).listen(port, () => {
  console.log(`AttentionOS running at http://localhost:${port}`);
});

export async function readPublicFile(pathname) {
  return readFile(join(publicDir, pathname), "utf8");
}
