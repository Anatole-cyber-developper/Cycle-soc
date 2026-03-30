const logs = document.getElementById("logs");
const attacks = document.getElementById("attacks");
const users = document.getElementById("users");
const threat = document.getElementById("threat");
const alertBox = document.getElementById("alertBox");

let attackCount = 0;

// 📊 Graph setup
const ctx = document.getElementById('attackChart').getContext('2d');

const attackChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Attaques',
      data: [],
      borderColor: '#00ff9c',
      tension: 0.3
    }]
  }
});

// 🚨 Alert function
function showAlert(message) {
  alertBox.textContent = message;
  alertBox.style.display = "block";

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 2000);
}

// 🎲 Générateur de logs réaliste
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

  const line = `[${time}] ${event.text}`;

  logs.innerHTML += line + "<br>";
  logs.scrollTop = logs.scrollHeight;

  // 👇 Gestion sécurité
  if (event.risk === "high") {
    attackCount++;
    attacks.textContent = attackCount;
    threat.textContent = "HIGH";
    threat.style.color = "red";

    showAlert("🚨 " + event.text);
  }

  if (event.risk === "medium") {
    threat.textContent = "MEDIUM";
    threat.style.color = "orange";
  }

  if (event.risk === "low") {
    threat.textContent = "LOW";
    threat.style.color = "#00ff9c";
  }

  users.textContent = Math.floor(Math.random() * 100);

  // 📊 Update graph
  attackChart.data.labels.push(time);
  attackChart.data.datasets[0].data.push(attackCount);

  if (attackChart.data.labels.length > 10) {
    attackChart.data.labels.shift();
    attackChart.data.datasets[0].data.shift();
  }

  attackChart.update();
}

// 🔁 Loop
setInterval(generateLog, 1000);
