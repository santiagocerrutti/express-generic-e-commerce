import { MessageDaoMongo } from "../dao/db/message.dao.mongo.js";

const messageLogs = [];
const manager = new MessageDaoMongo();

export function registerChatHandlers(io, socket) {
  function newUser(data) {
    /** This event will be received only by the socket emitting new-user */
    socket.emit("chat-started", messageLogs);
    /** This event will be received by every socket except the one emitting new-user */
    socket.broadcast.emit("user-logged-in", data);
  }

  async function newMessage(data) {
    messageLogs.push(data);

    await manager.addMessage(data);

    /** This event will be received by every socket */
    io.emit("message-received", data);
  }

  socket.on("new-user", newUser);
  socket.on("new-message", newMessage);
}
