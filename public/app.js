let profile = null;
let consumption = [];
let analysis = null;
let feed = [];
let reflection = null;
let privacy = null;

const panels = [...document.querySelectorAll(".panel")];
const tabs = [...document.querySelectorAll(".tab")];

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

function activateTab(tabId) {
  tabs.forEach((item) => item.classList.toggle("active", item.dataset.tab === tabId));
  panels.forEach((item) => item.classList.toggle("active", item.id === tabId));
}

async function api(path, options = {}) {
  const response = await fetch(`/api/v1${path}`, {
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || payload.error?.code || "Request failed");
  }
  return payload;
}

async function loadState() {
  const [profilePayload, scanPayload, feedPayload, reflectionPayload, privacyPayload] = await Promise.all([
    api("/profile"),
    api("/content-scan"),
    api("/feed-simulator"),
    api("/reflection"),
    api("/privacy"),
  ]);
  profile = profilePayload.profile;
  consumption = scanPayload.consumption;
  analysis = scanPayload.analysis;
  feed = feedPayload.feed;
  reflection = reflectionPayload.reflection;
  privacy = privacyPayload.privacy;
  render();
}

async function refreshDerived() {
  const [scanPayload, feedPayload, reflectionPayload, privacyPayload] = await Promise.all([
    api("/content-scan"),
    api("/feed-simulator"),
    api("/reflection"),
    api("/privacy"),
  ]);
  consumption = scanPayload.consumption;
  analysis = scanPayload.analysis;
  feed = feedPayload.feed;
  reflection = reflectionPayload.reflection;
  privacy = privacyPayload.privacy;
}

function render() {
  if (!profile || !analysis || !reflection || !privacy) return;
  renderHero();
  renderOverview();
  renderIdentity();
  renderDna();
  renderSimulator();
  renderReflection();
  renderPrivacy();
  renderDelivery();
}

function renderHero() {
  document.getElementById("heroMetrics").innerHTML = [
    ["Alignment", `${analysis.attentionScore}/100`],
    ["Tracked minutes", analysis.totalMinutes],
    ["Drift minutes", analysis.driftMinutes],
  ]
    .map(([label, value]) => `<div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
    .join("");
}

function progress(value) {
  return `<div class="bar" aria-hidden="true"><span style="width:${Math.max(0, Math.min(100, Number(value)))}%"></span></div>`;
}

function renderOverview() {
  document.getElementById("overview").innerHTML = `
    <div class="grid-2">
      <section class="glass-panel">
        <div class="score-head">
          <div><h2>Attention Alignment Score</h2><p class="muted">${escapeHtml(profile.weeklyIntent)}</p></div>
          <span class="score">${escapeHtml(analysis.attentionScore)}</span>
        </div>
        ${progress(analysis.attentionScore)}
        <div class="stat-row">
          <div class="stat"><span class="muted">Aligned</span><strong>${escapeHtml(analysis.alignedMinutes)} min</strong></div>
          <div class="stat"><span class="muted">Drift</span><strong>${escapeHtml(analysis.driftMinutes)} min</strong></div>
          <div class="stat"><span class="muted">Discovery</span><strong>${escapeHtml(profile.discoveryLevel)}%</strong></div>
        </div>
      </section>
      <section class="glass-panel">
        <h2>Pilot risks</h2>
        ${(analysis.risks.length ? analysis.risks : ["No blocking pilot risk in current scan."])
          .map((risk) => `<p class="reflection-note amber-note">${escapeHtml(risk)}</p>`)
          .join("")}
      </section>
    </div>
    <section class="glass-panel" style="margin-top:20px">
      <h2>Attention map</h2>
      <div class="grid-cards">
        ${Object.entries(analysis.categoryMinutes)
          .map(
            ([tag, minutes]) => `
            <div>
              <strong>${escapeHtml(tag)}</strong>
              ${progress(Math.round((Number(minutes) / Math.max(analysis.totalMinutes, 1)) * 100))}
              <p class="muted">${escapeHtml(minutes)} minutes</p>
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
      <section class="glass-panel">
        <h2>Identity Builder</h2>
        <label>Desired identity<input id="identityInput" value="${escapeHtml(profile.identity)}"></label>
        <label>Weekly intent<textarea id="intentInput">${escapeHtml(profile.weeklyIntent)}</textarea></label>
        <label>Discovery mode <span>${escapeHtml(profile.discoveryLevel)}%</span><input id="discoveryInput" type="range" min="0" max="100" value="${escapeHtml(profile.discoveryLevel)}"></label>
        <button class="primary" id="saveProfileButton" type="button">Save profile</button>
      </section>
      <section class="glass-panel">
        <h2>Focus profile</h2>
        <div class="grid-cards">
          ${focusOptions
            .map(([name, tags]) => {
              const current = profile.focusAreas.find((area) => area.name === name);
              return `
                <div class="focus-item">
                  <label>${escapeHtml(name)}<input type="checkbox" data-focus="${escapeHtml(name)}" ${current ? "checked" : ""}></label>
                  ${
                    current
                      ? `<input type="range" min="1" max="50" value="${escapeHtml(current.weight)}" data-weight="${escapeHtml(name)}"><p class="muted">${escapeHtml(tags.join(", "))}</p>`
                      : `<p class="muted">${escapeHtml(tags.join(", "))}</p>`
                  }
                </div>`;
            })
            .join("")}
        </div>
      </section>
    </div>`;

  document.getElementById("identityInput").addEventListener("input", (event) => {
    profile.identity = event.target.value;
  });
  document.getElementById("intentInput").addEventListener("input", (event) => {
    profile.weeklyIntent = event.target.value;
  });
  document.getElementById("discoveryInput").addEventListener("input", (event) => {
    profile.discoveryLevel = Number(event.target.value);
    renderIdentity();
  });
  document.getElementById("saveProfileButton").addEventListener("click", saveProfile);
  document.querySelectorAll("[data-focus]").forEach((input) => {
    input.addEventListener("change", () => {
      const name = input.dataset.focus;
      const exists = profile.focusAreas.some((area) => area.name === name);
      const option = focusOptions.find(([candidate]) => candidate === name);
      profile.focusAreas = exists
        ? profile.focusAreas.filter((area) => area.name !== name)
        : [...profile.focusAreas, { name, weight: 18, tags: option[1] }];
      renderIdentity();
    });
  });
  document.querySelectorAll("[data-weight]").forEach((input) => {
    input.addEventListener("input", () => {
      profile.focusAreas = profile.focusAreas.map((area) =>
        area.name === input.dataset.weight ? { ...area, weight: Number(input.value) } : area,
      );
      renderIdentity();
    });
  });
}

async function saveProfile() {
  profile = (await api("/profile", { method: "PATCH", body: JSON.stringify(profile) })).profile;
  await refreshDerived();
  render();
}

function renderDna() {
  document.getElementById("dna").innerHTML = `
    <div class="grid-2">
      <form class="glass-panel" id="sourceForm">
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
      <section class="glass-panel">
        <h2>Scanned inputs</h2>
        ${analysis.items
          .map(
            (item) => `
            <article class="source">
              <div class="source-head">
                <div><strong>${escapeHtml(item.title)}</strong><p class="muted">${escapeHtml(item.platform)} | ${escapeHtml(item.minutes)} min | ${escapeHtml(item.tags.join(", "))}</p></div>
                <span class="pill ${item.isDrift ? "warn" : "ok"}">${escapeHtml(item.alignment)}</span>
              </div>
            </article>`,
          )
          .join("")}
      </section>
    </div>`;

  document.getElementById("sourceForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    await api("/content-scan", {
      method: "POST",
      body: JSON.stringify({
        mode: "append",
        items: [
          {
            title: data.get("title"),
            platform: data.get("platform"),
            minutes: Number(data.get("minutes")),
            tags: String(data.get("tags")).split(",").map((tag) => tag.trim()).filter(Boolean),
            qualitySignal: Number(data.get("qualitySignal")),
          },
        ],
      }),
    });
    await refreshDerived();
    render();
  });
}

function renderSimulator() {
  document.getElementById("simulator").innerHTML = `
    <div class="grid-cards">
      ${feed
        .map(
          (item) => `
        <article class="glass-panel lane">
          <span class="lane-type">${escapeHtml(item.type)}</span>
          <h2>${escapeHtml(item.title)}</h2>
          <p class="muted">${escapeHtml(item.reason)}</p>
          ${progress(item.weight)}
        </article>`,
        )
        .join("")}
    </div>`;
}

function renderReflection() {
  document.getElementById("reflection").innerHTML = `
    <div class="grid-2">
      <section class="glass-panel">
        <h2>Weekly AI Reflection</h2>
        <p>${escapeHtml(reflection.summary)}</p>
        <p class="reflection-note blue-note">${escapeHtml(reflection.insight)}</p>
        <p class="reflection-note amber-note">${escapeHtml(reflection.correction)}</p>
      </section>
      <section class="glass-panel">
        <h2>Next actions</h2>
        ${reflection.nextActions.map((action) => `<p>OK ${escapeHtml(action)}</p>`).join("")}
      </section>
    </div>`;
}

function renderPrivacy() {
  const status = privacy.consentGranted && privacy.captureEnabled ? "Extension capture enabled" : "Extension capture paused";
  document.getElementById("privacy").innerHTML = `
    <div class="grid-2">
      <section class="glass-panel">
        <h2>Privacy and Consent</h2>
        <p class="muted">${escapeHtml(status)}</p>
        <label><input id="consentInput" type="checkbox" ${privacy.consentGranted ? "checked" : ""}> I consent to AttentionOS capturing approved page context.</label>
        <label><input id="captureInput" type="checkbox" ${privacy.captureEnabled ? "checked" : ""}> Enable browser extension capture.</label>
        <label>Retention days<input id="retentionInput" type="number" min="1" max="365" value="${escapeHtml(privacy.retentionDays)}"></label>
        <button class="primary" id="savePrivacyButton" type="button">Save privacy settings</button>
      </section>
      <section class="glass-panel">
        <h2>Data Rights</h2>
        <p class="muted">Export or reset local pilot data before using real capture.</p>
        <button class="primary" id="exportButton" type="button">Export data</button>
        <button class="primary" id="deleteButton" type="button">Delete/reset data</button>
        <pre id="exportOutput" class="audit-output"></pre>
      </section>
    </div>`;

  document.getElementById("savePrivacyButton").addEventListener("click", savePrivacy);
  document.getElementById("exportButton").addEventListener("click", exportData);
  document.getElementById("deleteButton").addEventListener("click", deleteData);
}

async function savePrivacy() {
  privacy = (
    await api("/privacy", {
      method: "PATCH",
      body: JSON.stringify({
        consentGranted: document.getElementById("consentInput").checked,
        captureEnabled: document.getElementById("captureInput").checked,
        retentionDays: Number(document.getElementById("retentionInput").value),
      }),
    })
  ).privacy;
  renderPrivacy();
}

async function exportData() {
  const payload = await api("/export");
  document.getElementById("exportOutput").textContent = JSON.stringify(payload.data, null, 2);
}

async function deleteData() {
  await api("/user-data", { method: "DELETE" });
  await loadState();
}

function renderDelivery() {
  const phases = [
    ["Audit fixes", "Static serving, XSS, body limits and validation"],
    ["Persistence", "JSON-backed per-user pilot store"],
    ["Auth boundary", "Local session cookie and user partitioning"],
    ["Privacy", "Consent, export and delete/reset controls"],
    ["Extension", "User-triggered capture to API"],
    ["Tests/CI", "Domain and API tests plus GitHub Actions"],
    ["Pilot", "Deployment checklist and staging guidance"],
  ];
  document.getElementById("delivery").innerHTML = `
    <div class="grid-2">
      <section class="glass-panel">
        <h2>Implementation phases</h2>
        ${phases.map(([phase, summary]) => `<div class="gate"><strong>${escapeHtml(phase)}</strong><span>${escapeHtml(summary)}</span><span>OK</span></div>`).join("")}
      </section>
      <section class="glass-panel">
        <h2>Release gate</h2>
        ${[
          ["API contract", "/api/v1"],
          ["Auth mode", "Local session"],
          ["Storage", "Persistent JSON pilot store"],
          ["Mobile", "Responsive PWA companion"],
          ["Extension", "User-triggered consent-gated capture"],
        ]
          .map(([label, value]) => `<div class="gate"><span class="muted">${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
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

loadState().catch((error) => {
  document.body.innerHTML = `<main class="workspace"><section class="glass-panel"><h1>AttentionOS failed to load</h1><p>${escapeHtml(error.message)}</p></section></main>`;
});
