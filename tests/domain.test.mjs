import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeDigitalDna,
  canTransitionJob,
  defaultProfile,
  scoreContentItem,
  verifyProviderContract,
} from "../src/lib/domain.js";

test("high quality focus content scores above drift content", () => {
  const focus = scoreContentItem(
    {
      id: "focus",
      title: "Deep work systems",
      platform: "YouTube",
      minutes: 20,
      tags: ["productivity", "systems"],
      qualitySignal: 0.9,
    },
    defaultProfile,
  );
  const drift = scoreContentItem(
    {
      id: "drift",
      title: "Rage clips",
      platform: "TikTok",
      minutes: 20,
      tags: ["ragebait"],
      qualitySignal: 0.2,
    },
    defaultProfile,
  );

  assert.ok(focus.alignment > drift.alignment);
  assert.equal(drift.isDrift, true);
});

test("digital dna analysis produces weighted minutes and score", () => {
  const analysis = analyzeDigitalDna(defaultProfile, [
    {
      id: "a",
      title: "AI systems",
      platform: "Newsletter",
      minutes: 30,
      tags: ["ai", "systems"],
      qualitySignal: 0.9,
    },
    {
      id: "b",
      title: "Casino stream",
      platform: "Stream",
      minutes: 30,
      tags: ["casino"],
      qualitySignal: 0.1,
    },
  ]);

  assert.equal(analysis.totalMinutes, 60);
  assert.equal(analysis.driftMinutes, 30);
  assert.ok(analysis.attentionScore > 0);
  assert.ok(analysis.risks.length >= 1);
});

test("provider contract maps expected error categories", () => {
  assert.deepEqual(verifyProviderContract({ output: "ok" }), {
    ok: true,
    errorCategory: null,
    message: "Provider contract verified.",
  });
  assert.equal(verifyProviderContract({}).errorCategory, "provider_contract_error");
  assert.equal(verifyProviderContract({ output: "" }).errorCategory, "provider_processing_error");
  assert.equal(verifyProviderContract({ status: "timeout" }).errorCategory, "provider_connection_error");
});

test("worker state machine allows only documented transitions", () => {
  assert.equal(canTransitionJob("queued", "running"), true);
  assert.equal(canTransitionJob("running", "succeeded"), true);
  assert.equal(canTransitionJob("succeeded", "running"), false);
});
