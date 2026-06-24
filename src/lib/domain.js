export const defaultProfile = {
  id: "demo-user",
  identity: "Focused builder",
  weeklyIntent: "Build durable knowledge, ship useful work, and protect recovery.",
  discoveryLevel: 42,
  focusAreas: [
    { name: "Deep Work", weight: 32, tags: ["productivity", "systems", "focus"] },
    { name: "Entrepreneurship", weight: 28, tags: ["startup", "strategy", "business"] },
    { name: "Learning", weight: 24, tags: ["learning", "science", "ai"] },
    { name: "Wellbeing", weight: 16, tags: ["health", "sleep", "training"] },
  ],
  passions: ["music creation", "AI tools", "personal knowledge systems"],
  blockedTags: ["doomscrolling", "ragebait", "celebrity gossip", "casino"],
};

export const sampleConsumption = [
  {
    id: "c-001",
    title: "Building a second brain for founders",
    platform: "YouTube",
    minutes: 34,
    tags: ["productivity", "systems", "startup"],
    qualitySignal: 0.9,
  },
  {
    id: "c-002",
    title: "Short-form clips: celebrity arguments",
    platform: "TikTok",
    minutes: 41,
    tags: ["celebrity gossip", "ragebait"],
    qualitySignal: 0.18,
  },
  {
    id: "c-003",
    title: "Practical AI workflow for research",
    platform: "Newsletter",
    minutes: 18,
    tags: ["ai", "learning", "systems"],
    qualitySignal: 0.86,
  },
  {
    id: "c-004",
    title: "Zone 2 training and cognitive recovery",
    platform: "Podcast",
    minutes: 52,
    tags: ["health", "training", "sleep"],
    qualitySignal: 0.78,
  },
  {
    id: "c-005",
    title: "Late-night random recommendation chain",
    platform: "YouTube",
    minutes: 63,
    tags: ["doomscrolling"],
    qualitySignal: 0.22,
  },
  {
    id: "c-006",
    title: "How musicians build an audience",
    platform: "YouTube",
    minutes: 27,
    tags: ["music creation", "business", "strategy"],
    qualitySignal: 0.82,
  },
];

export const jobTransitions = {
  queued: ["running"],
  running: ["succeeded", "failed", "retry_scheduled", "blocked_contract_mismatch"],
  retry_scheduled: ["queued", "running"],
  succeeded: [],
  failed: [],
  blocked_contract_mismatch: [],
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const normalize = (value) => String(value || "").trim().toLowerCase();

export function profileTagWeights(profile = defaultProfile) {
  const weights = new Map();
  for (const area of profile.focusAreas || []) {
    const areaWeight = Number(area.weight || 0);
    for (const tag of area.tags || []) {
      weights.set(normalize(tag), Math.max(weights.get(normalize(tag)) || 0, areaWeight));
    }
    weights.set(normalize(area.name), Math.max(weights.get(normalize(area.name)) || 0, areaWeight));
  }
  for (const passion of profile.passions || []) {
    weights.set(normalize(passion), Math.max(weights.get(normalize(passion)) || 0, 18));
  }
  return weights;
}

export function scoreContentItem(item, profile = defaultProfile) {
  const weights = profileTagWeights(profile);
  const blocked = new Set((profile.blockedTags || []).map(normalize));
  const tags = (item.tags || []).map(normalize);
  const matchedWeight = tags.reduce((total, tag) => total + (weights.get(tag) || 0), 0);
  const blockedHits = tags.filter((tag) => blocked.has(tag)).length;
  const quality = clamp(Number(item.qualitySignal ?? 0.5), 0, 1);
  const discovery = clamp(Number(profile.discoveryLevel ?? 35), 0, 100) / 100;
  const explorationBonus = matchedWeight === 0 && blockedHits === 0 ? discovery * 15 : 0;
  const base = matchedWeight / 1.6 + quality * 34 + explorationBonus - blockedHits * 36;
  const alignment = clamp(Math.round(base), 0, 100);

  return {
    ...item,
    alignment,
    isDrift: blockedHits > 0 || alignment < 35,
    isStretch: matchedWeight === 0 && blockedHits === 0 && alignment >= 35,
    matchedTags: tags.filter((tag) => weights.has(tag)),
    driftTags: tags.filter((tag) => blocked.has(tag)),
  };
}

export function analyzeDigitalDna(profile = defaultProfile, consumption = sampleConsumption) {
  const scored = consumption.map((item) => scoreContentItem(item, profile));
  const totalMinutes = scored.reduce((total, item) => total + Number(item.minutes || 0), 0);
  const alignedMinutes = scored.reduce(
    (total, item) => total + (item.alignment >= 65 ? Number(item.minutes || 0) : 0),
    0,
  );
  const driftMinutes = scored.reduce(
    (total, item) => total + (item.isDrift ? Number(item.minutes || 0) : 0),
    0,
  );
  const weightedScore =
    totalMinutes === 0
      ? 0
      : Math.round(
          scored.reduce((total, item) => total + item.alignment * Number(item.minutes || 0), 0) /
            totalMinutes,
        );
  const categoryMinutes = {};
  for (const item of scored) {
    const primaryTag = item.matchedTags[0] || item.driftTags[0] || "unmapped";
    categoryMinutes[primaryTag] = (categoryMinutes[primaryTag] || 0) + Number(item.minutes || 0);
  }
  const risks = [];
  if (totalMinutes > 0 && driftMinutes / totalMinutes > 0.25) {
    risks.push("Drift is above the pilot threshold of 25%.");
  }
  if (scored.filter((item) => item.alignment >= 80).length < 2) {
    risks.push("Not enough high-alignment sources to shape the feed reliably.");
  }

  return {
    attentionScore: weightedScore,
    totalMinutes,
    alignedMinutes,
    driftMinutes,
    categoryMinutes,
    risks,
    items: scored.sort((a, b) => b.minutes - a.minutes),
  };
}

export function generateFeedSimulation(profile = defaultProfile, analysis = analyzeDigitalDna(profile)) {
  const topFocus = [...(profile.focusAreas || [])].sort((a, b) => b.weight - a.weight).slice(0, 3);
  const driftTags = [...new Set(analysis.items.flatMap((item) => item.driftTags))];
  const stretch = profile.discoveryLevel > 55 ? "experimental" : "adjacent";

  return [
    ...topFocus.map((area, index) => ({
      id: `feed-core-${index}`,
      type: "core",
      title: `${area.name}: long-form source queue`,
      reason: `Reinforces ${profile.identity} with high-confidence tags.`,
      tags: area.tags.slice(0, 3),
      weight: area.weight,
    })),
    {
      id: "feed-stretch-1",
      type: "stretch",
      title: stretch === "experimental" ? "New field sampler" : "Adjacent learning lane",
      reason:
        stretch === "experimental"
          ? "Discovery mode is high enough to test unfamiliar but constructive inputs."
          : "Discovery stays near existing goals to avoid attention whiplash.",
      tags: ["learning", "strategy"],
      weight: Math.round(profile.discoveryLevel / 2),
    },
    {
      id: "feed-reduce-1",
      type: "reduce",
      title: "Downrank attention drift",
      reason: driftTags.length
        ? `Reduce sources tagged ${driftTags.join(", ")}.`
        : "No repeated drift tags detected in the current scan.",
      tags: driftTags,
      weight: 100 - analysis.attentionScore,
    },
  ];
}

export function createWeeklyReflection(profile = defaultProfile, analysis = analyzeDigitalDna(profile)) {
  const strongest = analysis.items.find((item) => item.alignment >= 75);
  const weakest = [...analysis.items].reverse().find((item) => item.isDrift);
  const scoreBand = analysis.attentionScore >= 70 ? "strong" : analysis.attentionScore >= 50 ? "mixed" : "fragile";

  return {
    scoreBand,
    summary: `Your attention week is ${scoreBand}: ${analysis.attentionScore}/100 alignment across ${analysis.totalMinutes} tracked minutes.`,
    insight: strongest
      ? `${strongest.title} is a high-signal source for ${profile.identity}.`
      : "The week needs at least one high-signal anchor source.",
    correction: weakest
      ? `Set a limit or downrank rule for "${weakest.title}" before the next scan.`
      : "Keep drift rules active and review the profile again next week.",
    nextActions: [
      "Protect two deep-work blocks before opening feeds.",
      "Subscribe to one high-alignment source and remove one drift source.",
      "Run the Digital DNA scan again after seven days.",
    ],
  };
}

export function canTransitionJob(from, to) {
  return Boolean(jobTransitions[from]?.includes(to));
}

export function verifyProviderContract(response) {
  if (!response || typeof response !== "object") {
    return { ok: false, errorCategory: "provider_contract_error", message: "Response must be an object." };
  }
  if (response.status === "timeout") {
    return { ok: false, errorCategory: "provider_connection_error", message: "Provider timed out." };
  }
  if (!("output" in response)) {
    return { ok: false, errorCategory: "provider_contract_error", message: "Missing output field." };
  }
  if (response.output === null || response.output === "") {
    return { ok: false, errorCategory: "provider_processing_error", message: "Output was empty." };
  }
  return { ok: true, errorCategory: null, message: "Provider contract verified." };
}
