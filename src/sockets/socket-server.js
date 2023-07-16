import { Server } from "socket.io";
import { registerChatHandlers } from "./chat-handlers.js";
import { logger } from "../config/logger.js";

export class SocketServer {
  static _instance = null;

  static getInstance() {
    if (!SocketServer._instance) {
      throw new Error("Socket server instance is null");
    }

    return SocketServer._instance;
  }

  static createSocketServer(expressApplication) {
    SocketServer._instance = new Server(expressApplication);

    SocketServer._instance.on("connection", async (socket) => {
      logger.info(`Socket Connected: ${socket.id}`);

      socket.on("disconnect", (reason) => {
        logger.info(`Socket Disonnected: ${socket.id}; ${reason}`);
      });

      registerChatHandlers(SocketServer._instance, socket);
    });

    return SocketServer._instance;
  }
}
