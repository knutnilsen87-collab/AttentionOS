(() => {
  const payload = {
    title: document.title,
    url: location.href,
    host: location.host,
    platform: location.hostname.replace(/^www\./, "") || "Browser",
    capturedAt: new Date().toISOString(),
  };

  chrome.runtime?.sendMessage?.({ type: "ATTENTIONOS_PAGE_CONTEXT", payload });
})();
