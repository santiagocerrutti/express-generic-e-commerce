import { CartManager } from "../dao/db/cart.manager.js";

export async function getCartsHandler(req, res) {
  const { limit } = req.query;
  const manager = new CartManager();
  const carts = await manager.getCarts(limit);
  res.sendSuccess(carts);
}

export async function getCartByIdHandler(req, res) {
  const { cid } = req.params;

  try {
    const manager = new CartManager();
    const foundCart = await manager.getCartById(cid);

    res.sendSuccess(foundCart);
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.sendNotFound(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}

export async function postCart(req, res) {
  try {
    const manager = new CartManager();
    const cart = await manager.addCart();

    res.sendSuccess(cart);
  } catch (error) {
    res.sendInternalServerError();
  }
}

export async function postProductToCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const manager = new CartManager();
    const cart = await manager.addProductToCart(cid, pid, 1);

    res.sendSuccess(cart);
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.sendNotFound(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}

export async function putCartProducts(req, res) {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const manager = new CartManager();
    const cart = await manager.setProductsToCart(cid, products);
    res.sendSuccess(cart);
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.sendNotFound(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}

export async function putCartProduct(req, res) {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const manager = new CartManager();
    const cart = await manager.updateProductOfCart(cid, pid, quantity);
    res.sendSuccess(cart);
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.sendNotFound(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}

export async function deleteAllProducts(req, res) {
  const { cid } = req.params;
  try {
    const manager = new CartManager();
    const cart = await manager.deleteProductsOfCart(cid);
    res.sendSuccess(cart);
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.sendNotFound(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}

export async function deleteProductOfCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const manager = new CartManager();
    const cart = await manager.deleteProductOfCart(cid, pid);
    res.sendSuccess(cart);
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.sendNotFound(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}
