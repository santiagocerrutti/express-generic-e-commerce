import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { __dirname } from "./config/dirname.js";
import { MONGO_URL } from "./config/env.js";
import cartsRouter from "./routes/carts.routes.js";
import productsRouter from "./routes/products.routes.js";
import viewsRouter from "./routes/views.routes.js";
import { SocketServer } from "./sockets/socket-server.js";

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

  console.log("mongoURL", MONGO_URL);
  try {
    await mongoose.connect(MONGO_URL);
  } catch (error) {
    console.error(error);
  }
}

main();
/**

Agregar el modelo de persistencia de Mongo y mongoose a tu proyecto. (LISTO)

Crear una base de datos llamada “ecommerce” dentro de tu Atlas, crear sus colecciones “carts”, “messages”, “products” y sus respectivos schemas.

Separar los Managers de fileSystem de los managers de MongoDb en una sola carpeta “dao”. Dentro de dao, agregar también una carpeta “models” donde vivirán los esquemas de MongoDB. La estructura deberá ser igual a la vista en esta clase

Contener todos los Managers (FileSystem y DB) en una carpeta llamada “Dao”

Reajustar los servicios con el fin de que puedan funcionar con Mongoose en lugar de FileSystem

Implementar una vista nueva en handlebars llamada chat.handlebars, la cual permita implementar un chat como el visto en clase. Los mensajes deberán guardarse en una colección “messages” en mongo (no es necesario implementarlo en FileSystem). El formato es:  {user:correoDelUsuario, message: mensaje del usuario}

Corroborar la integridad del proyecto para que todo funcione como lo ha hecho hasta ahora.

 */
