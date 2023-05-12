import { CartManager } from "../dao/db/cart.manager.js";

export async function getCartsHandler(req, res) {
  const { limit } = req.query;
  const manager = new CartManager();
  const carts = await manager.getCarts(limit);
  res.send({
    status: "SUCCESS",
    payload: carts,
  });
}

export async function getCartByIdHandler(req, res) {
  const { cid } = req.params;

  try {
    const manager = new CartManager();
    const foundProduct = await manager.getCartById(cid);

    res.send({ status: "SUCCESS", payload: foundProduct });
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

    res.send({ status: "SUCCESS", payload: cart });
  } catch (error) {
    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function postProductToCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const manager = new CartManager();
    const cart = await manager.addProductToCart(cid, pid, 1);

    res.send({ status: "SUCCESS", payload: cart });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.status(404).send({ status: "ERROR", error: error.message });

      return;
    }

    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function putCartProducts(req, res) {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const manager = new CartManager();
    const cart = await manager.setProductsToCart(cid, products);
    res.send({ status: "SUCCESS", payload: cart });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.status(404).send({ status: "ERROR", error: error.message });

      return;
    }

    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function putCartProduct(req, res) {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const manager = new CartManager();
    const cart = await manager.updateProductOfCart(cid, pid, quantity);
    res.send({ status: "SUCCESS", payload: cart });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.status(404).send({ status: "ERROR", error: error.message });

      return;
    }

    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function deleteAllProducts(req, res) {
  const { cid } = req.params;
  try {
    const manager = new CartManager();
    const cart = await manager.deleteProductsOfCart(cid);
    res.send({ status: "SUCCESS", payload: cart });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.status(404).send({ status: "ERROR", error: error.message });

      return;
    }

    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function deleteProductOfCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const manager = new CartManager();
    const cart = await manager.deleteProductOfCart(cid, pid);
    res.send({ status: "SUCCESS", payload: cart });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.status(404).send({ status: "ERROR", error: error.message });

      return;
    }

    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}
