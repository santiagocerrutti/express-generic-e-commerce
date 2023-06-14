import {
  deleteAllProducts,
  deleteProductOfCart,
  getCartByIdHandler,
  getCartsHandler,
  postCart,
  postProductToCart,
  putCartProduct,
  putCartProducts,
} from "../handlers/carts.handler.js";
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
    this.get("/", isAuthenticated, getCartsHandler);
    this.get("/:cid", isAuthenticated, validateCartId, getCartByIdHandler);
    this.post("/", isAuthenticated, postCart);
    this.post(
      "/:cid/products/:pid",
      isAuthenticated,
      validateCartId,
      validateProductId,
      postProductToCart
    );
    this.put(
      "/:cid",
      isAuthenticated,
      validateCartId,
      validateProductsOfCart,
      putCartProducts
    );
    this.put(
      "/:cid/products/:pid",
      isAuthenticated,
      validateCartId,
      validateProductId,
      validateProductQuantity,
      putCartProduct
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
