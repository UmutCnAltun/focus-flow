let focusActive = false;
let blockedSites = ["youtube.com", "twitter.com", "x.com", "instagram.com", "tiktok.com", "facebook.com", "reddit.com", "pinterest.com", "snapchat.com"];

chrome.storage.sync.get(['blockedSites'], (result) => {
  if (result.blockedSites) {
    blockedSites = result.blockedSites.map(site => site.toLowerCase());
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockedSites) {
    blockedSites = changes.blockedSites.newValue.map(site => site.toLowerCase());
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "FOCUS_START") focusActive = true;
  if (msg.type === "FOCUS_STOP") focusActive = false;
  if (msg.type === "FOCUS_DONE") {
    chrome.notifications.create({
      type: "basic",
      title: "FocusFlow",
      message: "Harika! Pomodoro tamamlandı Seninle gurur duyuyoruz "
    });
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(details => {
  if (!focusActive || details.frameId !== 0) return;

  try {
    const url = new URL(details.url);
    const hostname = url.hostname.toLowerCase();
    blockedSites.forEach(site => {
      if (hostname === site || hostname.endsWith('.' + site)) {
        // Engelleme sayısını artır
        chrome.storage.sync.get(['blockedAttempts'], (result) => {
          const newCount = (result.blockedAttempts || 0) + 1;
          chrome.storage.sync.set({ blockedAttempts: newCount });
        });
        chrome.tabs.update(details.tabId, {
          url: chrome.runtime.getURL("blocked.html")
        });
      }
    });
  } catch (e) {
    // Geçersiz URL, yoksay
  }
});
