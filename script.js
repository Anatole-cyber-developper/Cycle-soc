// ===============================
// 📦 SELECTORS
// ===============================
const API_URL = "https://8030fb56-566e-4059-8ca6-1ed7b7abdbe9-00-pcpb6hunw9ja.riker.replit.dev";
const logsContainer = document.getElementById("logs");
const attacksEl = document.getElementById("attacks");
const usersEl = document.getElementById("users");
const threatEl = document.getElementById("threat");
const alertBox = document.getElementById("alertBox");
const map = document.getElementById("map");

// ===============================
// 📊 STATE
// ===============================
let attackCount = 0;
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
        labels: {
          color: "#00ff9c"
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#00ff9c" }
      },
      y: {
        ticks: { color: "#00ff9c" }
      }
    }
  }
});

// ===============================
// 🚨 ALERT
// ===============================
function showAlert(message) {
  alertBox.textContent = message;
  alertBox.style.display = "block";

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 2000);
}

// ===============================
// 🌍 MAP ATTACK
// ===============================
function showAttackOnMap() {
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
  logsContainer.innerHTML = "";

  allLogs
    .filter(log => currentFilter === "all" || log.risk === currentFilter)
    .forEach(log => {
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
// 💾 EXPORT LOGS
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
// 🧠 ANOMALY DETECTION
// ===============================
function detectAnomaly() {
  const recent = allLogs.slice(-5);
  const bruteCount = recent.filter(l => l.text.includes("Brute")).length;

  if (bruteCount >= 3) {
    showAlert("⚠️ Pattern attaque détecté !");
  }
}

// ===============================
// 🎲 GENERATE LOG
// ===============================
function generateLog() {
  const events = [
    { text: "Login success", risk: "low" },
    { text: "Login failed", risk: "medium" },
    { text: "Brute force attack", risk: "high" },
    { text: "New device connected", risk: "low" },
    { text: "Suspicious IP detected", risk: "high" }
  ];

  const event = events[Math.floor(Math.random() * events.length)];
  const time = new Date().toLocaleTimeString();

  // 📦 Store log
  const logData = {
    time,
    text: event.text,
    risk: event.risk
  };

  allLogs.push(logData);

  // 📜 Display
  displayLogs();

  // 🔐 Threat logic
  if (event.risk === "high") {
    attackCount++;
    attacksEl.textContent = attackCount;
    threatEl.textContent = "HIGH";
    threatEl.style.color = "red";

    showAlert("🚨 " + event.text);
    showAttackOnMap();
  }

  if (event.risk === "medium") {
    threatEl.textContent = "MEDIUM";
    threatEl.style.color = "orange";
  }

  if (event.risk === "low") {
    threatEl.textContent = "LOW";
    threatEl.style.color = "#00ff9c";
  }

  // 👥 Users simulation
  usersEl.textContent = Math.floor(Math.random() * 100);

  // 📊 Chart update
  attackChart.data.labels.push(time);
  attackChart.data.datasets[0].data.push(attackCount);

  if (attackChart.data.labels.length > 10) {
    attackChart.data.labels.shift();
    attackChart.data.datasets[0].data.shift();
  }

  attackChart.update();
}

// ===============================
// 🔁 LOOPS
// ===============================
setInterval(generateLog, 1000);
setInterval(detectAnomaly, 3000);
