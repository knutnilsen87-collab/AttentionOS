import {
  analyzeDigitalDna,
  createWeeklyReflection,
  defaultProfile,
  generateFeedSimulation,
  sampleConsumption,
} from "../src/lib/domain.js";

let profile = structuredClone(defaultProfile);
let consumption = structuredClone(sampleConsumption);

const panels = [...document.querySelectorAll(".panel")];
const tabs = [...document.querySelectorAll(".tab")];

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    panels.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

function render() {
  const analysis = analyzeDigitalDna(profile, consumption);
  const feed = generateFeedSimulation(profile, analysis);
  const reflection = createWeeklyReflection(profile, analysis);
  renderHero(analysis);
  renderOverview(analysis);
  renderIdentity();
  renderDna(analysis);
  renderSimulator(feed);
  renderReflection(reflection);
  renderDelivery();
}

function renderHero(analysis) {
  document.getElementById("heroMetrics").innerHTML = [
    ["Alignment", `${analysis.attentionScore}/100`],
    ["Tracked minutes", analysis.totalMinutes],
    ["Drift minutes", analysis.driftMinutes],
  ]
    .map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function progress(value) {
  return `<div class="bar" aria-hidden="true"><span style="width:${Math.max(0, Math.min(100, value))}%"></span></div>`;
}

function renderOverview(analysis) {
  document.getElementById("overview").innerHTML = `
    <div class="grid-2">
      <section class="card">
        <div class="score-head">
          <div><h2>Attention Alignment Score</h2><p class="muted">${profile.weeklyIntent}</p></div>
          <span class="score">${analysis.attentionScore}</span>
        </div>
        ${progress(analysis.attentionScore)}
        <div class="stat-row">
          <div class="stat"><span class="muted">Aligned</span><strong>${analysis.alignedMinutes} min</strong></div>
          <div class="stat"><span class="muted">Drift</span><strong>${analysis.driftMinutes} min</strong></div>
          <div class="stat"><span class="muted">Discovery</span><strong>${profile.discoveryLevel}%</strong></div>
        </div>
      </section>
      <section class="card">
        <h2>Pilot risks</h2>
        ${(analysis.risks.length ? analysis.risks : ["No blocking pilot risk in current scan."])
          .map((risk) => `<p class="reflection-note amber-note">${risk}</p>`)
          .join("")}
      </section>
    </div>
    <section class="card" style="margin-top:20px">
      <h2>Attention map</h2>
      <div class="grid-cards">
        ${Object.entries(analysis.categoryMinutes)
          .map(
            ([tag, minutes]) => `
            <div>
              <strong>${tag}</strong>
              ${progress(Math.round((Number(minutes) / Math.max(analysis.totalMinutes, 1)) * 100))}
              <p class="muted">${minutes} minutes</p>
            </div>`,
          )
          .join("")}
      </div>
    </section>`;
}

function renderIdentity() {
  const focusOptions = [
    ["Deep Work", ["productivity", "systems", "focus"]],
    ["Entrepreneurship", ["startup", "strategy", "business"]],
    ["Learning", ["learning", "science", "ai"]],
    ["Wellbeing", ["health", "sleep", "training"]],
    ["Creation", ["music creation", "writing", "craft"]],
    ["Relationships", ["family", "communication", "community"]],
  ];

  document.getElementById("identity").innerHTML = `
    <div class="grid-2">
      <section class="card">
        <h2>Identity Builder</h2>
        <label>Desired identity<input id="identityInput" value="${escapeHtml(profile.identity)}"></label>
        <label>Weekly intent<textarea id="intentInput">${escapeHtml(profile.weeklyIntent)}</textarea></label>
        <label>Discovery mode <span>${profile.discoveryLevel}%</span><input id="discoveryInput" type="range" min="0" max="100" value="${profile.discoveryLevel}"></label>
      </section>
      <section class="card">
        <h2>Focus profile</h2>
        <div class="grid-cards">
          ${focusOptions
            .map(([name, tags]) => {
              const current = profile.focusAreas.find((area) => area.name === name);
              return `
                <div class="focus-item">
                  <label>${name}<input type="checkbox" data-focus="${name}" ${current ? "checked" : ""}></label>
                  ${
                    current
                      ? `<input type="range" min="1" max="50" value="${current.weight}" data-weight="${name}"><p class="muted">${tags.join(", ")}</p>`
                      : `<p class="muted">${tags.join(", ")}</p>`
                  }
                </div>`;
            })
            .join("")}
        </div>
      </section>
    </div>`;

  document.getElementById("identityInput").addEventListener("input", (event) => {
    profile.identity = event.target.value;
    render();
  });
  document.getElementById("intentInput").addEventListener("input", (event) => {
    profile.weeklyIntent = event.target.value;
    render();
  });
  document.getElementById("discoveryInput").addEventListener("input", (event) => {
    profile.discoveryLevel = Number(event.target.value);
    render();
  });
  document.querySelectorAll("[data-focus]").forEach((input) => {
    input.addEventListener("change", () => {
      const name = input.dataset.focus;
      const exists = profile.focusAreas.some((area) => area.name === name);
      const option = focusOptions.find(([candidate]) => candidate === name);
      profile.focusAreas = exists
        ? profile.focusAreas.filter((area) => area.name !== name)
        : [...profile.focusAreas, { name, weight: 18, tags: option[1] }];
      render();
    });
  });
  document.querySelectorAll("[data-weight]").forEach((input) => {
    input.addEventListener("input", () => {
      profile.focusAreas = profile.focusAreas.map((area) =>
        area.name === input.dataset.weight ? { ...area, weight: Number(input.value) } : area,
      );
      render();
    });
  });
}

function renderDna(analysis) {
  document.getElementById("dna").innerHTML = `
    <div class="grid-2">
      <form class="card" id="sourceForm">
        <h2>Add consumed source</h2>
        <label>Title<input name="title" required></label>
        <label>Platform<input name="platform" value="YouTube" required></label>
        <label>Tags<input name="tags" value="learning, ai"></label>
        <div class="grid-cards">
          <label>Minutes<input name="minutes" type="number" min="0" value="20"></label>
          <label>Quality<input name="qualitySignal" type="number" min="0" max="1" step="0.1" value="0.7"></label>
        </div>
        <button class="primary">Add source</button>
      </form>
      <section class="card">
        <h2>Scanned inputs</h2>
        ${analysis.items
          .map(
            (item) => `
            <article class="source">
              <div class="source-head">
                <div><strong>${escapeHtml(item.title)}</strong><p class="muted">${item.platform} | ${item.minutes} min | ${item.tags.join(", ")}</p></div>
                <span class="pill ${item.isDrift ? "warn" : "ok"}">${item.alignment}</span>
              </div>
            </article>`,
          )
          .join("")}
      </section>
    </div>`;

  document.getElementById("sourceForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    consumption = [
      {
        id: `local-${Date.now()}`,
        title: data.get("title"),
        platform: data.get("platform"),
        minutes: Number(data.get("minutes")),
        tags: String(data.get("tags")).split(",").map((tag) => tag.trim()).filter(Boolean),
        qualitySignal: Number(data.get("qualitySignal")),
      },
      ...consumption,
    ];
    render();
  });
}

function renderSimulator(feed) {
  document.getElementById("simulator").innerHTML = `
    <div class="grid-cards">
      ${feed
        .map(
          (item) => `
        <article class="card lane">
          <span class="lane-type">${item.type}</span>
          <h2>${item.title}</h2>
          <p class="muted">${item.reason}</p>
          ${progress(item.weight)}
        </article>`,
        )
        .join("")}
    </div>`;
}

function renderReflection(reflection) {
  document.getElementById("reflection").innerHTML = `
    <div class="grid-2">
      <section class="card">
        <h2>Weekly AI Reflection</h2>
        <p>${reflection.summary}</p>
        <p class="reflection-note blue-note">${reflection.insight}</p>
        <p class="reflection-note amber-note">${reflection.correction}</p>
      </section>
      <section class="card">
        <h2>Next actions</h2>
        ${reflection.nextActions.map((action) => `<p>OK ${action}</p>`).join("")}
      </section>
    </div>`;
}

function renderDelivery() {
  const phases = [
    ["Spec", "Locked MVP scope and contracts"],
    ["Foundation", "Node app, API, PWA and test harness"],
    ["Identity", "Profile, focus areas and discovery level"],
    ["DNA", "Consumption scan and scoring engine"],
    ["Dashboard", "Alignment score and attention analytics"],
    ["AI layer", "Feed simulator and weekly reflection"],
    ["Pilot", "Release gates, security minimum and docs"],
  ];
  document.getElementById("delivery").innerHTML = `
    <div class="grid-2">
      <section class="card">
        <h2>Implementation phases</h2>
        ${phases.map(([phase, summary]) => `<div class="gate"><strong>${phase}</strong><span>${summary}</span><span>OK</span></div>`).join("")}
      </section>
      <section class="card">
        <h2>Release gate</h2>
        ${[
          ["API contract", "/api/v1"],
          ["Auth mode", "Pilot local"],
          ["Storage", "In-memory demo, schema documented"],
          ["Mobile", "Responsive PWA companion"],
          ["Extension", "Manifest skeleton included"],
        ]
          .map(([label, value]) => `<div class="gate"><span class="muted">${label}</span><strong>${value}</strong></div>`)
          .join("")}
      </section>
    </div>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[char];
  });
}

render();
