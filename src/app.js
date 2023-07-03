import cookieParser from "cookie-parser";
import express from "express";
import handlebars from "express-handlebars";
import passport from "passport";

import { env } from "./config/env.js";
import { initializePassport } from "./config/passport.config.js";
import router from "./routes/index.js";
import { SocketServer } from "./sockets/socket-server.js";
import { __dirname } from "./utils.js";

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
  app.use(cookieParser(env.COOKIE_SECRET));

  initializePassport();
  app.use(passport.initialize());

  /** Routes */
  app.use(router);

  const server = app.listen(env.PORT, () => {
    console.log("Listening on port " + env.PORT);
  });

  SocketServer.createSocketServer(server);
}

main();
