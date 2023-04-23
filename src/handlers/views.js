import { ProductManager } from "../dao/file/product.manager.js";

export async function getProductsHandler(req, res) {
  const manager = new ProductManager();
  const products = await manager.getProducts();

  res.render("index", {
    products,
  });
}

export async function getRealTimeProductsHandler(req, res) {
  const manager = new ProductManager();
  const products = await manager.getProducts();

  res.render("realtimeproducts", {
    products,
  });
}

export async function getChatHandler(req, res) {
  res.render("chat", {});
}
