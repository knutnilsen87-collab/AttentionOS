chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "ATTENTIONOS_PAGE_CONTEXT") return;

  chrome.storage.local.set({
    lastAttentionOsCapture: message.payload,
  });
});
