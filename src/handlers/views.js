import { ProductManager } from "../dao/db/product.manager.js";

export async function getProductsHandler(req, res) {
  const manager = new ProductManager();
  const products = await manager.getProductsJson();
  console.log(products);
  res.render("index", {
    products,
  });
}

export async function getRealTimeProductsHandler(req, res) {
  const manager = new ProductManager();
  const products = await manager.getProductsJson();

  res.render("realtimeproducts", {
    products,
  });
}

export async function getChatHandler(req, res) {
  res.render("chat", {});
}
