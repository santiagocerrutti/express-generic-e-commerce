import {
  addCart,
  addProductToCart,
  deleteProductOfCart,
  deleteProductsOfCart,
  getCartById,
  getCarts,
  purchaseCart,
  updateProductOfCart,
  updateProductsOfCart,
} from "../use-cases/index.js";

class CartsController {
  constructor() {}

  getCarts = async (req, res) => {
    const { limit } = req.query;

    const carts = await getCarts(limit);
    res.sendSuccess(carts);
  };

  getCartById = async (req, res) => {
    const { cid } = req.params;

    try {
      const foundCart = await getCartById(cid);

      res.sendSuccess(foundCart);
    } catch (error) {
      if (error.code === "NOT_FOUND") {
        res.sendNotFound(error.message);

        return;
      }

      res.sendInternalServerError();
    }
  };

  createCart = async (req, res) => {
    try {
      const cart = await addCart(req.user.user);

      res.sendSuccess(cart);
    } catch (error) {
      res.sendInternalServerError();
    }
  };

  addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const cart = await addProductToCart(cid, pid, 1);

      res.sendSuccess(cart);
    } catch (error) {
      if (error.code === "NOT_FOUND") {
        res.sendNotFound(error.message);

        return;
      }

      res.sendInternalServerError();
    }
  };

  updateProductsOfCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
      const cart = await updateProductsOfCart(cid, products);
      res.sendSuccess(cart);
    } catch (error) {
      if (error.code === "NOT_FOUND") {
        res.sendNotFound(error.message);

        return;
      }

      res.sendInternalServerError();
    }
  };

  updateProductOfCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const cart = await updateProductOfCart(cid, pid, quantity);
      res.sendSuccess(cart);
    } catch (error) {
      if (error.code === "NOT_FOUND") {
        res.sendNotFound(error.message);

        return;
      }

      res.sendInternalServerError();
    }
  };

  deleteAllProducts = async (req, res) => {
    const { cid } = req.params;
    try {
      const cart = await deleteProductsOfCart(cid);
      res.sendSuccess(cart);
    } catch (error) {
      if (error.code === "NOT_FOUND") {
        res.sendNotFound(error.message);

        return;
      }

      res.sendInternalServerError();
    }
  };

  deleteProductOfCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const cart = await deleteProductOfCart(cid, pid);
      res.sendSuccess(cart);
    } catch (error) {
      if (error.code === "NOT_FOUND") {
        res.sendNotFound(error.message);

        return;
      }

      res.sendInternalServerError();
    }
  };

  purchaseCart = async (req, res) => {
    const { cid } = req.params;
    const { user } = req.user;

    try {
      const ticket = await purchaseCart(cid, user);
      res.sendSuccess(ticket);
    } catch (error) {
      if (error.code === "NOT_FOUND") {
        res.sendNotFound(error.message);

        return;
      }

      res.sendInternalServerError();
    }
  };
}

export const cartController = new CartsController();
