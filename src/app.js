import express from "express";
import {
  getProductByIdHandler,
  getProductsHandler,
  postProductHandler,
} from "./handlers/product.js";

async function main() {
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.get("/products", getProductsHandler);
  server.get("/products/:pid", getProductByIdHandler);
  server.post("/products", postProductHandler);

  server.listen(8080, () => {
    console.log("Listening on port 8080");
  });
}

main();
