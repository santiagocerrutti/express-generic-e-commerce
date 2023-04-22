import express from "express";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.routes.js";
import productsRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";
import __dirname from "./utils.js";
import { SocketServer } from "./sockets/socket-server.js";

async function main() {
  const app = express();
  app.engine("handlebars", handlebars.engine());
  app.set("views", __dirname + "/views");
  app.set("view engine", "handlebars");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/static", express.static(`${__dirname}/public`));
  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/", viewsRouter);

  const server = app.listen(8080, () => {
    console.log("Listening on port 8080");
  });

  SocketServer.createSocketServer(server);
}

main();
