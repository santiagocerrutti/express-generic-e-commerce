/* eslint-disable no-undef */
const socket = io();

// // let user = null;
let messageInput = document.getElementById("message_input");
let messageLog = document.getElementById("message_log");

const userEmail = document.getElementById("user.email")?.getAttribute("value");
// // const userId = document.getElementById("user._id")?.getAttribute("value");

// // Swal.fire({
// //   input: "email",
// //   text: "Ingrese su email para chatear:",
// //   allowOutsideClick: false,
// //   didClose: () => {
socket.emit("new-user", {
  user: userEmail,
});
// //   },
// // }).then((result) => {
// //   user = result.value;
// // });

/**
 * Handles the keyup event on the message input field.
 * If the Enter key is pressed, it emits a new-message event to the server with the user's email and the message value.
 * It then clears the message input field.
 *
 * @param {Event} event - The keyup event object.
 * @returns {void}
 */
messageInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const { value } = messageInput;

    if (value.trim().length >= 0) {
      socket.emit("new-message", {
        user: userEmail,
        message: value,
      });
      messageInput.value = "";
    }
  }
});

/**
 * Handles the event of receiving a new message from the server.
 *
 * @param {Object} data - The data object containing the user and message information.
 * @param {string} data.user - The user who sent the message.
 * @param {string} data.message - The content of the message.
 * @returns {void}
 */
socket.on("message-received", (data) => {
  const { user, message } = data;
  messageLog.innerHTML += `
  <li>
    <strong>${user} dice</strong>: ${message}
  </li>
  `;
});

/**
 * Event listener for the "chat-started" event.
 * It receives an array of message logs and appends them to the message log element in the HTML.
 * Each log is displayed as a list item with the user's name and their message.
 *
 * @param {Array} messageLogs - An array of message logs containing user and message information.
 * @returns {void}
 */
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

/**
 * Handles the event of a user logging in. Fires alert to all logged in users.
 *
 * @param {Object} data - The data object containing the user information.
 * @param {string} data.user - The user who logged in.
 * @returns {void}
 */
socket.on("user-logged-in", (data) => {
  Swal.fire({
    text: `${data.user} se ha unido al chat!`,
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: "bottom-left",
  });
});
