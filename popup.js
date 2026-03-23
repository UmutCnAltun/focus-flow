let time = 25 * 60;
let interval;
let mode = "focus";
let pomodoroCount = 0;
let focusMode = false;

let focusTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 15 * 60;

const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");

chrome.storage.sync.get(['focusTime', 'shortBreakTime', 'longBreakTime', 'blockedSites', 'totalPomodoros', 'totalFocusTime', 'blockedAttempts'], (result) => {
  focusTime = (result.focusTime || 25) * 60;
  shortBreakTime = (result.shortBreakTime || 5) * 60;
  longBreakTime = (result.longBreakTime || 15) * 60;
  time = focusTime;
  updateTimer();
  document.getElementById("focusInput").value = result.focusTime || 25;
  document.getElementById("shortBreakInput").value = result.shortBreakTime || 5;
  document.getElementById("longBreakInput").value = result.longBreakTime || 15;

  const blockedSites = result.blockedSites || ["youtube.com", "twitter.com", "x.com", "instagram.com", "tiktok.com", "facebook.com", "reddit.com", "pinterest.com", "snapchat.com"];
  updateBlockedSitesList(blockedSites);

  document.getElementById("totalPomodoros").textContent = result.totalPomodoros || 0;
  document.getElementById("totalFocusTime").textContent = result.totalFocusTime || 0;
  document.getElementById("blockedAttempts").textContent = result.blockedAttempts || 0;
});

function updateTimer() {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  timerEl.textContent = `${min}:${sec.toString().padStart(2, "0")}`;
}

function nextSession() {
  if (mode === "focus") {
    pomodoroCount++;
    chrome.runtime.sendMessage({ type: "FOCUS_DONE" });

    chrome.storage.sync.get(['totalPomodoros', 'totalFocusTime'], (result) => {
      const newTotalPomodoros = (result.totalPomodoros || 0) + 1;
      const newTotalFocusTime = (result.totalFocusTime || 0) + (focusTime / 60);
      chrome.storage.sync.set({
        totalPomodoros: newTotalPomodoros,
        totalFocusTime: newTotalFocusTime
      });
      document.getElementById("totalPomodoros").textContent = newTotalPomodoros;
      document.getElementById("totalFocusTime").textContent = newTotalFocusTime;
    });

    if (pomodoroCount % 4 === 0) {
      mode = "longBreak";
      time = longBreakTime;
      statusEl.textContent = "Uzun mola 🧘";
      chrome.runtime.sendMessage({ type: "FOCUS_STOP" });
    } else {
      mode = "shortBreak";
      time = shortBreakTime;
      statusEl.textContent = "Kısa mola ";
      chrome.runtime.sendMessage({ type: "FOCUS_STOP" });
    }
  } else {
    mode = "focus";
    time = focusTime;
    statusEl.textContent = "Odak zamanı ";
    chrome.runtime.sendMessage({ type: "FOCUS_START" });
  }
  updateTimer();
}

function startTimer() {
  clearInterval(interval);
  if (mode === "focus") {
    chrome.runtime.sendMessage({ type: "FOCUS_START" });
  }
  interval = setInterval(() => {
    time--;
    updateTimer();
    if (time <= 0) {
      clearInterval(interval);
      nextSession();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  statusEl.textContent = "Durduruldu";
  chrome.runtime.sendMessage({ type: "FOCUS_STOP" });
}

function saveSettings() {
  const focusVal = parseInt(document.getElementById("focusInput").value) || 25;
  const shortVal = parseInt(document.getElementById("shortBreakInput").value) || 5;
  const longVal = parseInt(document.getElementById("longBreakInput").value) || 15;
  chrome.storage.sync.set({
    focusTime: focusVal,
    shortBreakTime: shortVal,
    longBreakTime: longVal
  });
  focusTime = focusVal * 60;
  shortBreakTime = shortVal * 60;
  longBreakTime = longVal * 60;
  if (mode === "focus") time = focusTime;
  updateTimer();
  document.getElementById("settingsMessage").textContent = "Ayarlar kaydedildi!";
  setTimeout(() => document.getElementById("settingsMessage").textContent = "", 3000);
}

function resetSettings() {
  document.getElementById("focusInput").value = 25;
  document.getElementById("shortBreakInput").value = 5;
  document.getElementById("longBreakInput").value = 15;
  saveSettings();
  document.getElementById("settingsMessage").textContent = "Ayarlar varsayılanlara sıfırlandı!";
  setTimeout(() => document.getElementById("settingsMessage").textContent = "", 3000);
}

document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.tab + '-tab').classList.add('active');
  });
});

document.querySelectorAll('.preset').forEach(button => {
  button.addEventListener("click", () => {
    time = parseInt(button.dataset.time) * 60;
    updateTimer();
  });
});

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("stop").addEventListener("click", stopTimer);
document.getElementById("saveSettings").addEventListener("click", saveSettings);
document.getElementById("resetSettings").addEventListener("click", resetSettings);

document.getElementById("addSite").addEventListener("click", addSite);
document.getElementById("resetStats").addEventListener("click", resetStats);

function updateBlockedSitesList(sites) {
  const list = document.getElementById("blockedSitesList");
  list.innerHTML = "";
  sites.forEach(site => {
    const li = document.createElement("li");
    li.textContent = site;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Sil";
    removeBtn.onclick = () => removeSite(site);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function addSite() {
  const newSite = document.getElementById("newSiteInput").value.trim().toLowerCase();
  if (!newSite) return;
  chrome.storage.sync.get(['blockedSites'], (result) => {
    const sites = result.blockedSites || ["youtube.com", "twitter.com", "x.com", "instagram.com", "tiktok.com", "facebook.com", "linkedin.com", "reddit.com", "pinterest.com", "snapchat.com"];
    if (!sites.includes(newSite)) {
      sites.push(newSite);
      chrome.storage.sync.set({ blockedSites: sites });
      updateBlockedSitesList(sites);
      document.getElementById("newSiteInput").value = "";
      document.getElementById("sitesMessage").textContent = "Site eklendi!";
      setTimeout(() => document.getElementById("sitesMessage").textContent = "", 3000);
    } else {
      document.getElementById("sitesMessage").textContent = "Site zaten var!";
      setTimeout(() => document.getElementById("sitesMessage").textContent = "", 3000);
    }
  });
}

function removeSite(site) {
  chrome.storage.sync.get(['blockedSites'], (result) => {
    const sites = result.blockedSites || ["youtube.com", "twitter.com", "x.com", "instagram.com", "tiktok.com", "facebook.com", "linkedin.com", "reddit.com", "pinterest.com", "snapchat.com"];
    const newSites = sites.filter(s => s !== site);
    chrome.storage.sync.set({ blockedSites: newSites });
    updateBlockedSitesList(newSites);
    document.getElementById("sitesMessage").textContent = "Site silindi!";
    setTimeout(() => document.getElementById("sitesMessage").textContent = "", 3000);
  });
}

function resetStats() {
  chrome.storage.sync.set({
    totalPomodoros: 0,
    totalFocusTime: 0,
    blockedAttempts: 0
  });
  document.getElementById("totalPomodoros").textContent = "0";
  document.getElementById("totalFocusTime").textContent = "0";
  document.getElementById("blockedAttempts").textContent = "0";
}