const statusEl = document.getElementById("status");
const messagesEl = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// ID aleatório por sessão
const myId = crypto.randomUUID();

// Conecta no Worker
const socket = new WebSocket(
  "wss://chattemporario0.kironaura.workers.dev"
);

socket.onopen = () => {
  statusEl.textContent = "🟢 Conectado! Digite algo.";
  input.disabled = false;
  sendBtn.disabled = false;
  addSystem("Você entrou no chat.");
};

socket.onmessage = (event) => {
  addMessage("other", event.data);
};

socket.onclose = () => {
  statusEl.textContent = "🔴 Desconectado";
  addSystem("Conexão encerrada.");
  input.disabled = true;
  sendBtn.disabled = true;
};

sendBtn.onclick = sendMessage;
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  socket.send(text);
  addMessage("me", text);
  input.value = "";
}

function addMessage(type, text) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addSystem(text) {
  const div = document.createElement("div");
  div.className = "msg system";
  div.textContent = text;
  messagesEl.appendChild(div);
}
