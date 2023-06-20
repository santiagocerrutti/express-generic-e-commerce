import { CartDaoMongo } from "../dao/db/cart.dao.mongo.js";

export async function getCarts(req, res) {
  const { limit } = req.query;
  const manager = new CartDaoMongo();
  const carts = await manager.getCarts(limit);
  res.sendSuccess(carts);
}

export async function getCartById(req, res) {
  const { cid } = req.params;

  try {
    const manager = new CartDaoMongo();
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

export async function createCart(req, res) {
  try {
    const manager = new CartDaoMongo();
    const cart = await manager.addCart();

    res.sendSuccess(cart);
  } catch (error) {
    res.sendInternalServerError();
  }
}

export async function addProductToCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const manager = new CartDaoMongo();
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

export async function updateProductsOfCart(req, res) {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const manager = new CartDaoMongo();
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

export async function updateProductOfCart(req, res) {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const manager = new CartDaoMongo();
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
    const manager = new CartDaoMongo();
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
    const manager = new CartDaoMongo();
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
