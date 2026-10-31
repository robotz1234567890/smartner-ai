const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const sendButton = document.getElementById("send-button");
const history = [];

function addMessage(role, content, extraClass = "") {
  welcome.hidden = true;
  const row = document.createElement("div");
  row.className = `message ${role} ${extraClass}`;
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = role === "user" ? "Y" : "S";
  const body = document.createElement("div");
  body.className = "message-content";
  body.textContent = content;
  row.append(avatar, body);
  messages.appendChild(row);
  row.scrollIntoView({ behavior: "smooth", block: "end" });
  return body;
}

async function sendMessage(text) {
  const message = text.trim();
  if (!message || sendButton.disabled) return;

  addMessage("user", message);
  const previousHistory = history.slice(-12);
  history.push({ role: "user", content: message });
  input.value = "";
  input.style.height = "auto";
  sendButton.disabled = true;
  const pending = addMessage("assistant", "Thinking…");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: previousHistory })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    pending.textContent = data.reply;
    history.push({ role: "assistant", content: data.reply });
  } catch (error) {
    pending.textContent = error.message;
    pending.parentElement.classList.add("error");
    history.pop();
  } finally {
    sendButton.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 180)}px`;
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

document.querySelectorAll(".suggestion").forEach((button) => {
  button.addEventListener("click", () => sendMessage(button.textContent));
});

document.getElementById("new-chat").addEventListener("click", () => {
  history.length = 0;
  messages.replaceChildren();
  welcome.hidden = false;
  input.focus();
});
