const logs = document.getElementById("logs");
const attacks = document.getElementById("attacks");
const users = document.getElementById("users");
const threat = document.getElementById("threat");

let attackCount = 0;

function generateLog() {
  const types = [
    "Login success",
    "Login failed",
    "Brute force attempt",
    "New device connected"
  ];

  const log = types[Math.floor(Math.random() * types.length)];
  const time = new Date().toLocaleTimeString();

  const line = `[${time}] ${log}`;

  logs.innerHTML += line + "<br>";
  logs.scrollTop = logs.scrollHeight;

  if (log.includes("Brute")) {
    attackCount++;
    attacks.textContent = attackCount;
    threat.textContent = "HIGH";
  }

  users.textContent = Math.floor(Math.random() * 50);
}

setInterval(generateLog, 1000);
