import { ProductManager } from "../dao/db/product.manager.js";
import { SocketServer } from "../sockets/socket-server.js";

export async function getProductsHandler(req, res) {
  const { limit } = req.query;
  const manager = new ProductManager();
  const products = await manager.getProducts(limit);
  res.send({
    status: "SUCCESS",
    data: products,
  });
}

export async function getProductByIdHandler(req, res) {
  const { pid } = req.params;

  try {
    if (pid) {
      const manager = new ProductManager();
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
  try {
    const manager = new ProductManager();
    const result = await manager.addProduct(req.body);

    await emitProductsUpdate(manager);

    res.status(201).send({ status: "SUCCESS", data: result });
  } catch (error) {
    if (error.code === "DUPLICATED_KEY") {
      res.status(409).send({ status: "ERROR", error: error.message });

      return;
    }

    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function putProductHandler(req, res) {
  try {
    const manager = new ProductManager();
    const result = await manager.updateProduct(req.params.pid, req.body);

    await emitProductsUpdate(manager);

    res.status(200).send({ status: "SUCCESS", data: result });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.status(404).send({ status: "ERROR", error: error.message });

      return;
    } else if (error.code === "DUPLICATED_KEY") {
      res.status(409).send({ status: "ERROR", error: error.message });

      return;
    }

    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function deleteProductHandler(req, res) {
  try {
    const manager = new ProductManager();
    const result = await manager.deleteProduct(req.params.pid);

    await emitProductsUpdate(manager);

    res.status(200).send({ status: "SUCCESS", data: result });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.status(404).send({ status: "ERROR", error: error.message });

      return;
    }

    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

async function emitProductsUpdate(manager) {
  const products = await manager.getProducts();

  SocketServer.getInstance().emit("products-updated", products);
}
