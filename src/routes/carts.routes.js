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

    // TODO: validar ownership del carrito
    this.post(
      "/:cid/products/:pid",
      isAuthenticated,
      validateCartId,
      validateProductId,
      addProductToCart
    );

    // TODO: validar ownership del carrito
    this.put(
      "/:cid",
      isAuthenticated,
      validateCartId,
      validateProductsOfCart,
      updateProductsOfCart
    );

    // TODO: validar ownership del carrito
    this.put(
      "/:cid/products/:pid",
      isAuthenticated,
      validateCartId,
      validateProductId,
      validateProductQuantity,
      updateProductOfCart
    );

    // TODO: validar ownership del carrito
    this.delete("/:cid", isAuthenticated, validateCartId, deleteAllProducts);

    // TODO: validar ownership del carrito
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
