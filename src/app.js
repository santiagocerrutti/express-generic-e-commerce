import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

async function main() {
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.use("/api/products", productsRouter);
  server.use("/api/carts", cartsRouter);

  server.listen(8080, () => {
    console.log("Listening on port 8080");
  });
}

main();
