// ===============================
// 📦 CONFIG
// ===============================
const API_URL = "https://8030fb56-566e-4059-8ca6-1ed7b7abdbe9-00-pcpb6hunw9ja.riker.replit.dev";

// ===============================
// 📦 SELECTORS
// ===============================
const logsContainer = document.getElementById("logs");
const attacksEl = document.getElementById("attacks");
const usersEl = document.getElementById("users");
const threatEl = document.getElementById("threat");
const alertBox = document.getElementById("alertBox");
const map = document.getElementById("map");

// ===============================
// 📊 STATE
// ===============================
let allLogs = [];
let currentFilter = "all";

// ===============================
// 📈 CHART INIT
// ===============================
const ctx = document.getElementById("attackChart").getContext("2d");

const attackChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Attaques",
      data: [],
      borderColor: "#00ff9c",
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#00ff9c" }
      }
    },
    scales: {
      x: { ticks: { color: "#00ff9c" } },
      y: { ticks: { color: "#00ff9c" } }
    }
  }
});

// ===============================
// 🚨 ALERT
// ===============================
function showAlert(message) {
  if (!alertBox) return;

  alertBox.textContent = message;
  alertBox.style.display = "block";

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 2000);
}

// ===============================
// 🌍 MAP
// ===============================
function showAttackOnMap() {
  if (!map) return;

  const dot = document.createElement("div");

  dot.style.position = "absolute";
  dot.style.width = "6px";
  dot.style.height = "6px";
  dot.style.background = "red";
  dot.style.borderRadius = "50%";

  dot.style.top = Math.random() * 180 + "px";
  dot.style.left = Math.random() * 95 + "%";

  map.appendChild(dot);

  setTimeout(() => dot.remove(), 2000);
}

// ===============================
// 📜 DISPLAY LOGS
// ===============================
function displayLogs() {
  if (!logsContainer) return;

  logsContainer.innerHTML = "";

  const filtered = allLogs.filter(
    log => currentFilter === "all" || log.risk === currentFilter
  );

  filtered.forEach(log => {
    logsContainer.innerHTML += `[${log.time}] ${log.text} <br>`;
  });

  logsContainer.scrollTop = logsContainer.scrollHeight;
}

// ===============================
// 🎯 FILTER
// ===============================
function filterLogs(level) {
  currentFilter = level;
  displayLogs();
}

// ===============================
// 💾 EXPORT
// ===============================
function downloadLogs() {
  const blob = new Blob([JSON.stringify(allLogs, null, 2)], {
    type: "application/json"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "logs.json";
  a.click();
}

// ===============================
// 🧠 ANOMALY
// ===============================
function detectAnomaly() {
  const recent = allLogs.slice(-5);
  const brute = recent.filter(l => l.text.includes("Brute")).length;

  if (brute >= 3) {
    showAlert("⚠️ Attaque détectée !");
  }
}

// ===============================
// 📊 STATS
// ===============================
function updateStats() {
  const high = allLogs.filter(l => l.risk === "high").length;
  const medium = allLogs.filter(l => l.risk === "medium").length;

  if (attacksEl) attacksEl.textContent = high;
  if (usersEl) usersEl.textContent = Math.floor(Math.random() * 100);

  if (!threatEl) return;

  if (high > 5) {
    threatEl.textContent = "HIGH";
    threatEl.style.color = "red";
  } else if (medium > 5) {
    threatEl.textContent = "MEDIUM";
    threatEl.style.color = "orange";
  } else {
    threatEl.textContent = "LOW";
    threatEl.style.color = "#00ff9c";
  }
}

// ===============================
// 📈 CHART
// ===============================
function updateChart() {
  const time = new Date().toLocaleTimeString();
  const high = allLogs.filter(l => l.risk === "high").length;

  attackChart.data.labels.push(time);
  attackChart.data.datasets[0].data.push(high);

  if (attackChart.data.labels.length > 10) {
    attackChart.data.labels.shift();
    attackChart.data.datasets[0].data.shift();
  }

  attackChart.update();
}

// ===============================
// 📡 FETCH LOGS
// ===============================
async function fetchLogs() {
  try {
    const res = await fetch(`${API_URL}/logs`, { mode: "cors" });

    if (!res.ok) throw new Error("API error");

    const data = await res.json();

    if (!Array.isArray(data)) return;

    allLogs = data;

    displayLogs();
    updateStats();
    updateChart();

    const last = data[data.length - 1];
    if (last && last.risk === "high") {
      showAlert("🚨 " + last.text);
      showAttackOnMap();
    }

  } catch (err) {
    console.error("Erreur API:", err);
    if (logsContainer) {
      logsContainer.innerHTML = "⚠️ Impossible de charger les logs";
    }
  }
}

// ===============================
// 🚀 INIT
// ===============================
fetchLogs();

// ===============================
// 🔁 LOOPS
// ===============================
setInterval(fetchLogs, 1500);
setInterval(detectAnomaly, 3000);
