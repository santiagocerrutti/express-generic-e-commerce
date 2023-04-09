import { ProductManager } from "../service/ProductManager.js";

const filePath = "./data/products.json";

export async function getProductsHandler(req, res) {
  const { limit } = req.query;
  const manager = new ProductManager(filePath);
  const products = await manager.getProducts();
  if (limit) {
    res.send({
      status: "SUCCESS",
      data: products.slice(0, limit),
    });
    return;
  }
  res.send({
    status: "SUCCESS",
    data: products,
  });
}

export async function getProductByIdHandler(req, res) {
  const { pid } = req.params;
  try {
    if (pid) {
      const manager = new ProductManager(filePath);
      const foundProduct = await manager.getProductById(pid);

      res.send({ status: "SUCCESS", data: foundProduct });
    }
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.status(404).send({ status: "ERROR", error: error.message });
      return;
    }
    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function postProductHandler(req, res) {
  console.log(req.body);
  try {
    const manager = new ProductManager(filePath);
    const result = await manager.addProduct(req.body);
    res.status(201).send({ status: "SUCCESS", data: result });
  } catch (error) {
    console.log(error);
    if (error.code === "INVALID_BODY") {
      res
        .status(400)
        .send({ status: "ERROR", error: error.message, errors: error.errors });
      return;
    } else if (error.code === "DUPLICATED_KEY") {
      res.status(409).send({ status: "ERROR", error: error.message });
      return;
    }
    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}
