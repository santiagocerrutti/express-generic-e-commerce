import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { __dirname } from "./utils.js";
import { env } from "./config/env.js";
import cartsRouter from "./routes/carts.routes.js";
import productsRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";
import { SocketServer } from "./sockets/socket-server.js";

async function main() {
  const app = express();

  /** Handlebars configuration */
  app.engine(
    "handlebars",
    handlebars.engine({
      allowedProtoMethods: true,
    })
  );
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

  const server = app.listen(env.PORT, () => {
    console.log("Listening on port " + env.PORT);
  });

  SocketServer.createSocketServer(server);

  console.log("mongoURL", env.MONGO_URL);
  try {
    await mongoose.connect(env.MONGO_URL);
  } catch (error) {
    console.error(error);
  }
}

main();
