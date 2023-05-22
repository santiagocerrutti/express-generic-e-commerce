import cookieParser from "cookie-parser";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

import { env } from "./config/env.js";
import {
  cartsRouter,
  productsRouter,
  authRouter,
  viewsRouter,
} from "./routes/index.js";
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

  /** Routes */
  app.use("/", viewsRouter);
  app.use("/static", express.static(`${__dirname}/public`));
  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/auth", authRouter);

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

/*
TODO
  - Crear el Schema y el Model de mongo para usuarios según lo solicita la filmina. <LISTO>
  - Crear los routes y que llamen a los respectivos Handlers. <LISTO>
  - Crear los validators para el /register <LISTO>
  - Desarrollar la funcionalidad en el handler, lógica de negocio y uso del manager
    - /register <LISTO>
      - el email debe ser único; se crea un usuario en la BD con los datos ingresados.
    - /login <LISTO>
      - el usuario y la contraseña deben coincidir con la base de datos, 
      - Se debe crear la sesión.
        req.session.user = {
          ...datos del usuario
        }
    - /logout <LISTO>
      - Destruir la session
      
    - Desarrollar el formulario de registro, el formulario de login.

    - Desarrollar un middleware para verificar que el usuario esté autenticado antes de acceder a los endpoints (ver si esto lo pide en las consignas; si no lo pide, no hacerlo todavía) <LISTO>
      - Debe verificar que el usuario exista en req.session, 

    - Si el login falla, no se debe poder ingresar al resto de la aplicación
    - Si no hay usuario logueado, debe redirigir a la vista de login
    - Al hacer logout, se debe redirigir a la vista de login
  - 
 */
