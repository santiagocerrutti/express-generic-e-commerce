import cookieParser from "cookie-parser";
import express from "express";
import handlebars from "express-handlebars";
import passport from "passport";
import actuator from "express-actuator";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { initializePassport } from "./config/passport.config.js";
import { swaggerOptions } from "./docs/config.js";
import { errorHandler } from "./middlewares/error/error-handler.js";
import { addLogger } from "./middlewares/logger/index.js";
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

  /** Logger middleware */
  app.use(addLogger);

  /** Routes */
  app.use(router);

  /** Error Middleware */
  app.use(errorHandler);

  /** Health-check tool */
  const options = {
    basePath: "/health-check",
    infoGitMode: "simple",
  };
  app.use(actuator(options));

  const specs = swaggerJSDoc(swaggerOptions);
  app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

  const server = app.listen(env.PORT, () => {
    logger.info("Listening on port " + env.PORT);
  });

  SocketServer.createSocketServer(server);
}

main();
