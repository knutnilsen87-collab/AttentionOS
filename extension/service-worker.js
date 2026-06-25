const defaultApiBase = "http://127.0.0.1:3000";

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content-script.js"],
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "ATTENTIONOS_PAGE_CONTEXT") return false;

  capturePage(message.payload)
    .then((result) => sendResponse({ ok: true, result }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});

async function capturePage(payload) {
  await chrome.storage.local.set({
    lastAttentionOsCapture: payload,
  });

  const settings = await chrome.storage.local.get({
    attentionOsApiBase: defaultApiBase,
    attentionOsUserId: "local-demo-user",
  });

  const response = await fetch(`${settings.attentionOsApiBase}/api/v1/content-scan`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-attentionos-user": settings.attentionOsUserId,
    },
    body: JSON.stringify({
      mode: "append",
      items: [
        {
          title: payload.title || "Captured page",
          platform: payload.platform || "Browser",
          minutes: 1,
          tags: ["captured", payload.host || "browser"].filter(Boolean),
          qualitySignal: 0.5,
          source: "extension_capture",
          url: payload.url,
          host: payload.host,
          capturedAt: payload.capturedAt,
        },
      ],
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error?.message || "AttentionOS capture failed");
  }
  return result;
}
