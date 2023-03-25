import express from "express";
import {
  getProductByIdHandler,
  getProductsHandler,
} from "./handlers/product.js";

async function main() {
  const server = express();

  server.get("/products", getProductsHandler);
  server.get("/products/:pid", getProductByIdHandler);

  server.listen(8080, () => {
    console.log("Listening on port 8080");
  });
}

main();
