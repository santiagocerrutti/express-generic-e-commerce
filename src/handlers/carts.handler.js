import { CartManager } from "../dao/file/cart.manager.js";

export async function getCartsHandler(req, res) {
  const { limit } = req.query;
  const manager = new CartManager();
  const products = await manager.getCarts(limit);
  res.send({
    status: "SUCCESS",
    data: products,
  });
}

export async function getCartByIdHandler(req, res) {
  const { cid } = req.params;

  try {
    if (cid) {
      const manager = new CartManager();
      const foundProduct = await manager.getCartById(cid);

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

export async function postCart(req, res) {
  try {
    const manager = new CartManager();
    const cart = await manager.addCart();

    res.send({ status: "SUCCESS", data: cart });
  } catch (error) {
    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function postProductToCart(req, res) {
  const { cid, pid } = req.params;
  try {
    if (cid && pid) {
      const manager = new CartManager();
      const cart = await manager.addProductToCart(cid, pid, 1);

      res.send({ status: "SUCCESS", data: cart });
    } else {
      res
        .status(400)
        .send({ status: "ERROR", error: "query params are required." });
    }
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.status(404).send({ status: "ERROR", error: error.message });

      return;
    }

    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}
