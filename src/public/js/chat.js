/* eslint-disable no-undef */
const socket = io();

let user = null;
let messageInput = document.getElementById("message_input");
let messageLog = document.getElementById("message_log");

Swal.fire({
  input: "email",
  text: "Ingrese su email para chatear:",
  allowOutsideClick: false,
  didClose: () => {
    socket.emit("new-user", {
      user,
    });
  },
}).then((result) => {
  user = result.value;
});

messageInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const { value } = messageInput;

    if (value.trim().length >= 0) {
      socket.emit("new-message", {
        user,
        message: value,
      });
      messageInput.value = "";
    }
  }
});

socket.on("message-received", (data) => {
  const { user, message } = data;
  messageLog.innerHTML += `
  <li>
    <strong>${user} dice</strong>: ${message}
  </li>
  `;
});

socket.on("chat-started", (messageLogs) => {
  for (const log of messageLogs) {
    const { user, message } = log;
    messageLog.innerHTML += `
      <li>
        <strong>${user} dice</strong>: ${message}
      </li>
      `;
  }
});

socket.on("user-logged-in", (data) => {
  Swal.fire({
    text: `${data.user} se ha unido al chat!`,
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: "bottom-left",
  });
});
