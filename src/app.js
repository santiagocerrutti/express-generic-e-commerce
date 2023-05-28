import cookieParser from "cookie-parser";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";

import { env } from "./config/env.js";
import router from "./routes/index.js";
import { SocketServer } from "./sockets/socket-server.js";
import { __dirname } from "./utils.js";
import { initializePassport } from "./config/passport.config.js";

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
  app.use(cookieParser(env.SECRET));
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: env.MONGO_URL,
        mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        ttl: 1500,
      }),
      secret: env.SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );

  initializePassport();
  app.use(passport.initialize());
  app.use(passport.session());

  /** Routes */
  app.use(router);

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
