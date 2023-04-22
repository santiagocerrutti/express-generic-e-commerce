import { Server } from "socket.io";

export class SocketServer {
  static instance = null;

  static getInstance() {
    if (!SocketServer.instance) {
      throw new Error("Socket server instance is null");
    }

    return SocketServer.instance;
  }

  static createSocketServer(expressApplication) {
    SocketServer.instance = new Server(expressApplication);

    SocketServer.instance.on("connection", async (socket) => {
      console.log(`Socket Connected: ${socket.id}`);
      socket.on("disconnect", (reason) => {
        console.log(`Socket Disonnected: ${socket.id}; ${reason}`);
      });
    });

    return SocketServer.instance;
  }
}
