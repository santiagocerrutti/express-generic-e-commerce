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

  getCartById = async (req, res, next) => {
    const { cid } = req.params;

    try {
      const foundCart = await getCartById(cid);

      res.sendSuccess(foundCart);
    } catch (error) {
      next(error);
    }
  };

  createCart = async (req, res, next) => {
    try {
      const cart = await addCart(req.user.user);

      res.sendSuccess(cart);
    } catch (error) {
      next(error);
    }
  };

  addProductToCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    try {
      const cart = await addProductToCart(cid, pid, 1);

      res.sendSuccess(cart);
    } catch (error) {
      next(error);
    }
  };

  updateProductsOfCart = async (req, res, next) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
      const cart = await updateProductsOfCart(cid, products);
      res.sendSuccess(cart);
    } catch (error) {
      next(error);
    }
  };

  updateProductOfCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const cart = await updateProductOfCart(cid, pid, quantity);
      res.sendSuccess(cart);
    } catch (error) {
      next(error);
    }
  };

  deleteAllProducts = async (req, res, next) => {
    const { cid } = req.params;
    try {
      const cart = await deleteProductsOfCart(cid);
      res.sendSuccess(cart);
    } catch (error) {
      next(error);
    }
  };

  deleteProductOfCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    try {
      const cart = await deleteProductOfCart(cid, pid);
      res.sendSuccess(cart);
    } catch (error) {
      next(error);
    }
  };

  purchaseCart = async (req, res, next) => {
    const { cid } = req.params;
    const { user } = req.user;

    try {
      const ticket = await purchaseCart(cid, user);
      res.sendSuccess(ticket);
    } catch (error) {
      next(error);
    }
  };
}

export const cartController = new CartsController();
