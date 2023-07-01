import { CartsService } from "../services/index.js";

export async function getCarts(req, res) {
  const { limit } = req.query;
  const service = new CartsService();
  const carts = await service.getCarts(limit);
  res.sendSuccess(carts);
}

export async function getCartById(req, res) {
  const { cid } = req.params;

  try {
    const service = new CartsService();
    const foundCart = await service.getCartById(cid);

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
    const service = new CartsService();
    const cart = await service.addCart();

    res.sendSuccess(cart);
  } catch (error) {
    res.sendInternalServerError();
  }
}

export async function addProductToCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const service = new CartsService();
    const cart = await service.addProductToCart(cid, pid, 1);

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
    const service = new CartsService();
    const cart = await service.setProductsToCart(cid, products);
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
    const service = new CartsService();
    const cart = await service.updateProductOfCart(cid, pid, quantity);
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
    const service = new CartsService();
    const cart = await service.deleteProductsOfCart(cid);
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
    const service = new CartsService();
    const cart = await service.deleteProductOfCart(cid, pid);
    res.sendSuccess(cart);
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.sendNotFound(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}
