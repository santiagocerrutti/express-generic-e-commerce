import { ProductManager } from "../service/ProductManager.js";

export async function getProductsHandler(req, res) {
  const manager = new ProductManager();
  const products = await manager.getProducts();

  res.render("index", {
    products,
  });
}

// TODO: agregar dinamismo con socket.io
export async function getRealTimeProductsHandler(req, res) {
  const manager = new ProductManager();
  const products = await manager.getProducts();

  res.render("index", {
    products,
  });
}
