import { ProductManager } from "../service/ProductManager.js";

const filePath = "./data/products.json";

export async function getProductsHandler(req, res) {
  const { limit } = req.query;
  const manager = new ProductManager(filePath);
  const products = await manager.getProducts();
  if (limit) {
    res.send(products.slice(0, limit));
    return;
  }
  res.send(products);
}

export async function getProductByIdHandler(req, res) {
  const { pid } = req.params;
  if (pid) {
    const manager = new ProductManager(filePath);
    const foundProduct = await manager.getProductById(pid);
    if (foundProduct) {
      res.send(foundProduct);
      return;
    }
  }
  res.status(404).send({ error: `Product ${pid} not found` });
}
