import { cartsService } from "../services/index.js";

export async function getCarts(req, res) {
  const { limit } = req.query;

  const carts = await cartsService.getCarts(limit);
  res.sendSuccess(carts);
}

export async function getCartById(req, res) {
  const { cid } = req.params;

  try {
    const foundCart = await cartsService.getCartById(cid);

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
    const cart = await cartsService.addCart();

    res.sendSuccess(cart);
  } catch (error) {
    res.sendInternalServerError();
  }
}

export async function addProductToCart(req, res) {
  const { cid, pid } = req.params;
  try {
    const cart = await cartsService.addProductToCart(cid, pid, 1);

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
    const cart = await cartsService.setProductsToCart(cid, products);
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
    const cart = await cartsService.updateProductOfCart(cid, pid, quantity);
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
    const cart = await cartsService.deleteProductsOfCart(cid);
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
    const cart = await cartsService.deleteProductOfCart(cid, pid);
    res.sendSuccess(cart);
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      res.sendNotFound(error.message);

      return;
    }

    res.sendInternalServerError();
  }
}
