let focusActive = false;

const messages = [
  "Bu site FocusFlow tarafından engellendi. Odaklan!",
  "Şimdi çalışma zamanı! Bu siteyi sonra ziyaret et.",
  "Dikkatini dağıtma, hedeflerine odaklan.",
  "Güçlü bir adım at, bu siteyi kapat.",
  "Senin potansiyelin çok büyük, odaklanmaya devam et!"
];

document.addEventListener('DOMContentLoaded', () => {
  const messageEl = document.getElementById('message');
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  messageEl.textContent = randomMessage;

  document.getElementById('closeFocus').addEventListener('click', () => {
    chrome.runtime.sendMessage({type: 'FOCUS_STOP'});
  });
});

chrome.storage.sync.get(['blockedSites'], (result) => {
  if (result.blockedSites) {
    blockedSites = result.blockedSites.map(site => site.toLowerCase());
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "FOCUS_START") focusActive = true;
  if (msg.type === "FOCUS_STOP") focusActive = false;
});

