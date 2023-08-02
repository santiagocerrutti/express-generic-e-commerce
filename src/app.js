import cookieParser from "cookie-parser";
import express from "express";
import handlebars from "express-handlebars";
import passport from "passport";

import { env } from "./config/env.js";
import { initializePassport } from "./config/passport.config.js";
import { errorHandler } from "./middlewares/error/error-handler.js";
import { addLogger } from "./middlewares/logger/index.js";
import router from "./routes/index.js";
import { SocketServer } from "./sockets/socket-server.js";
import { __dirname } from "./utils.js";
import { logger } from "./config/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { swaggerOptions } from "./docs/config.js";

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

  /** Logger middleware */
  app.use(addLogger);

  /** Routes */
  app.use(router);

  /** Error Middleware */
  app.use(errorHandler);

  const specs = swaggerJSDoc(swaggerOptions);
  app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

  const server = app.listen(env.PORT, () => {
    logger.info("Listening on port " + env.PORT);
  });

  SocketServer.createSocketServer(server);
}

main();
