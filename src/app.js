import express from "express";
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.routes.js";
import productsRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";
import { SocketServer } from "./sockets/socket-server.js";
import __dirname from "./utils.js";

async function main() {
  const app = express();

  /** Handlebars configuration */
  app.engine("handlebars", handlebars.engine());
  app.set("views", __dirname + "/views");
  app.set("view engine", "handlebars");
  /** Middleware configuration */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  /** Routes */
  app.use("/", viewsRouter);
  app.use("/static", express.static(`${__dirname}/public`));
  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);

  const server = app.listen(8080, () => {
    console.log("Listening on port 8080");
  });

  SocketServer.createSocketServer(server);
}

main();
