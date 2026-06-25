import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

async function startServer(extraEnv = {}, options = {}) {
  const port = 42000 + Math.floor(Math.random() * 1000);
  const dir = options.dir || (await mkdtemp(join(tmpdir(), "attentionos-test-")));
  const storePath = options.storePath || join(dir, "store.json");
  const child = spawn(process.execPath, ["server.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(port),
      ATTENTIONOS_STORE_PATH: storePath,
      ...extraEnv,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stderr.on("data", (chunk) => process.stderr.write(chunk));
  await Promise.race([
    once(child.stdout, "data"),
    once(child, "exit").then(([code]) => {
      throw new Error(`server exited early with ${code}`);
    }),
  ]);

  return {
    base: `http://127.0.0.1:${port}`,
    async stop() {
      child.kill();
      if (!options.keepDir) {
        await rm(dir, { recursive: true, force: true });
      }
    },
  };
}

test("health endpoint responds", async () => {
  const server = await startServer();
  try {
    const response = await fetch(`${server.base}/api/v1/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.service, "attentionos");
  } finally {
    await server.stop();
  }
});

test("static server blocks traversal outside allowlist", async () => {
  const server = await startServer();
  try {
    const response = await fetch(`${server.base}/src/lib/../../server.mjs`);
    assert.equal(response.status, 404);
  } finally {
    await server.stop();
  }
});

test("malformed json returns 400", async () => {
  const server = await startServer();
  try {
    const response = await fetch(`${server.base}/api/v1/provider/verify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{bad json",
    });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.error.code, "invalid_json");
  } finally {
    await server.stop();
  }
});

test("oversized body returns 413", async () => {
  const server = await startServer({ ATTENTIONOS_MAX_BODY_BYTES: "32" });
  try {
    const response = await fetch(`${server.base}/api/v1/provider/verify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ output: "x".repeat(200) }),
    });
    const body = await response.json();
    assert.equal(response.status, 413);
    assert.equal(body.error.code, "body_too_large");
  } finally {
    await server.stop();
  }
});

test("extension capture requires consent before accepting data", async () => {
  const server = await startServer();
  try {
    const item = {
      title: "Captured",
      platform: "Browser",
      minutes: 1,
      tags: ["captured"],
      qualitySignal: 0.5,
      source: "extension_capture",
    };
    const blocked = await fetch(`${server.base}/api/v1/content-scan`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-attentionos-user": "audit-user" },
      body: JSON.stringify({ items: [item] }),
    });
    assert.equal(blocked.status, 403);

    await fetch(`${server.base}/api/v1/privacy`, {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-attentionos-user": "audit-user" },
      body: JSON.stringify({ consentGranted: true, captureEnabled: true }),
    });

    const accepted = await fetch(`${server.base}/api/v1/content-scan`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-attentionos-user": "audit-user" },
      body: JSON.stringify({ items: [item] }),
    });
    assert.equal(accepted.status, 200);
  } finally {
    await server.stop();
  }
});

test("profile data persists across server restart", async () => {
  const dir = await mkdtemp(join(tmpdir(), "attentionos-persist-test-"));
  const storePath = join(dir, "store.json");
  let server = await startServer({}, { dir, storePath, keepDir: true });
  try {
    await fetch(`${server.base}/api/v1/profile`, {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-attentionos-user": "persist-user" },
      body: JSON.stringify({ identity: "Persistent pilot user" }),
    });
    await server.stop();

    server = await startServer({}, { dir, storePath, keepDir: true });
    const response = await fetch(`${server.base}/api/v1/profile`, {
      headers: { "x-attentionos-user": "persist-user" },
    });
    const body = await response.json();
    assert.equal(body.profile.identity, "Persistent pilot user");
  } finally {
    await server.stop();
    await rm(dir, { recursive: true, force: true });
  }
});

test("export and delete reset user data", async () => {
  const server = await startServer();
  try {
    const headers = { "content-type": "application/json", "x-attentionos-user": "privacy-user" };
    await fetch(`${server.base}/api/v1/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ identity: "Privacy test user" }),
    });
    const exported = await fetch(`${server.base}/api/v1/export`, { headers });
    const exportBody = await exported.json();
    assert.equal(exported.status, 200);
    assert.equal(exportBody.data.profile.identity, "Privacy test user");

    const deleted = await fetch(`${server.base}/api/v1/user-data`, {
      method: "DELETE",
      headers,
    });
    const deleteBody = await deleted.json();
    assert.equal(deleted.status, 200);
    assert.equal(deleteBody.ok, true);
    assert.equal(deleteBody.privacy.consentGranted, false);
  } finally {
    await server.stop();
  }
});
