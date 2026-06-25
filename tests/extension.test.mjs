import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("extension manifest uses user-triggered capture and localhost API only", async () => {
  const manifest = JSON.parse(await readFile("extension/manifest.json", "utf8"));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(Boolean(manifest.content_scripts), false);
  assert.ok(manifest.permissions.includes("activeTab"));
  assert.ok(manifest.permissions.includes("scripting"));
  assert.deepEqual(manifest.host_permissions, ["http://127.0.0.1:3000/*", "http://localhost:3000/*"]);
});
