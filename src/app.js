import express from "express";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.routes.js";
import productsRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";

async function main() {
  const app = express();

  // inicialización de handlebars
  app.engine("handlebars", handlebars.engine());
  app.set("views", __dirname + "/views");
  app.set("view engine", "handlebars");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/static", express.static(`${__dirname}/public`));
  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/views", viewsRouter);

  const appListenting = app.listen(8080, () => {
    console.log("Listening on port 8080");
  });

  const socketServer = new Server(appListenting);
  socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectardo");
    // El evento acá es definido por el programador
    socket.on("message", (data) => {
      console.log(data);
    });
    socket.emit("message", "Esto es enviado desde el server");
    socket.broadcast.emit(
      "broadcast-message",
      "Message for everyone but the sender"
    );
    socketServer.emit("server-message", "Message for everyone");
  });

  app.get("/chat", (req, res) => {
    res.render("chat", {});
  });
}

main();
