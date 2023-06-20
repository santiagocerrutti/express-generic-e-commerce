import {
  addProductToCart,
  createCart,
  deleteAllProducts,
  deleteProductOfCart,
  getCartById,
  getCarts,
  updateProductOfCart,
  updateProductsOfCart,
} from "../controllers/carts.controller.js";
import { isAuthenticated } from "../middlewares/auth/index.js";
import {
  validateCartId,
  validateProductQuantity,
  validateProductsOfCart,
} from "../middlewares/validation/cart.validator.js";
import { validateProductId } from "../middlewares/validation/product.validator.js";
import { Router } from "./Router.js";

class CartsRouter extends Router {
  init() {
    this.get("/", isAuthenticated, getCarts);

    this.get("/:cid", isAuthenticated, validateCartId, getCartById);

    this.post("/", isAuthenticated, createCart);

    this.post(
      "/:cid/products/:pid",
      isAuthenticated,
      validateCartId,
      validateProductId,
      addProductToCart
    );

    this.put(
      "/:cid",
      isAuthenticated,
      validateCartId,
      validateProductsOfCart,
      updateProductsOfCart
    );

    this.put(
      "/:cid/products/:pid",
      isAuthenticated,
      validateCartId,
      validateProductId,
      validateProductQuantity,
      updateProductOfCart
    );

    this.delete("/:cid", isAuthenticated, validateCartId, deleteAllProducts);

    this.delete(
      "/:cid/products/:pid",
      isAuthenticated,
      validateCartId,
      validateProductId,
      deleteProductOfCart
    );
  }
}

export const cartsRouter = new CartsRouter().getRouter();
