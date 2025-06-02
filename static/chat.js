function addMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");

  const messageDiv = document.createElement("div");
  messageDiv.className = "message " + sender;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  messageDiv.appendChild(bubble);

  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value;

  if (message.trim() === "") return;

  addMessage(message, "user");

  input.value = "";

  const response = await fetch("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message })
  });

  const data = await response.json();
  addMessage(data.reply, "bot");
}

document.getElementById("user-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
