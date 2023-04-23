const messageLogs = [];

export function registerChatHandlers(io, socket) {
  function newUser(data) {
    /** This event will be received only by the socket emitting new-user */
    socket.emit("chat-started", messageLogs);
    /** This event will be received by every socket except the one emitting new-user */
    socket.broadcast.emit("user-logged-in", data);
  }

  function newMessage(data) {
    messageLogs.push(data);
    /** This event will be received by every socket */
    io.emit("message-received", data);
  }

  socket.on("new-user", newUser);
  socket.on("new-message", newMessage);
}
