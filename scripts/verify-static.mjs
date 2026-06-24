import { existsSync } from "node:fs";
import { analyzeDigitalDna, defaultProfile, sampleConsumption } from "../src/lib/domain.js";

const required = [
  "public/index.html",
  "public/app.js",
  "public/styles.css",
  "public/attentionos-hero.jpg",
  "server.mjs",
  "extension/manifest.json",
  "docs/IMPLEMENTATION_PHASES.md",
  "docs/API_CONTRACT.md",
  "docs/DATA_MODEL.md",
  "docs/QA_RELEASE_GATE.md",
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

const analysis = analyzeDigitalDna(defaultProfile, sampleConsumption);
if (!Number.isFinite(analysis.attentionScore) || analysis.totalMinutes <= 0) {
  console.error("Domain analysis did not produce a valid score.");
  process.exit(1);
}

console.log("Static build verification passed.");
