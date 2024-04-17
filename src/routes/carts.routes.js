import { cartController } from "../controllers/carts.controller.js";
import {
  ROLES,
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth/index.js";
import { validateCartOwnership } from "../middlewares/validation/cart-ownership.validator.js";
import {
  validateCartId,
  validateProductQuantity,
  validateProductsOfCart,
} from "../middlewares/validation/cart.validator.js";
import { validateProductId } from "../middlewares/validation/product.validator.js";
import { Router } from "./Router.js";

const {
  addProductToCart,
  createCart,
  deleteAllProductsOfCart,
  deleteProductOfCart,
  getCartById,
  getCarts,
  purchaseCart,
  updateProductOfCart,
  updateProductsOfCart,
} = cartController;

class CartsRouter extends Router {
  init() {
    this.get("/", isAuthenticated, isAuthorized(ROLES.ADMIN), getCarts);

    this.get(
      "/:cid",
      isAuthenticated,
      isAuthorized(ROLES.ALL),
      validateCartId,
      validateCartOwnership,
      getCartById
    );

    this.post("/", isAuthenticated, isAuthorized(ROLES.ALL), createCart);

    this.post(
      "/:cid/products/:pid",
      isAuthenticated,
      isAuthorized(ROLES.ALL),
      validateCartId,
      validateProductId,
      validateCartOwnership,
      addProductToCart
    );

    this.put(
      "/:cid",
      isAuthenticated,
      isAuthorized(ROLES.ALL),
      validateCartId,
      validateProductsOfCart,
      validateCartOwnership,
      updateProductsOfCart
    );

    this.put(
      "/:cid/products/:pid",
      isAuthenticated,
      isAuthorized(ROLES.ALL),
      validateCartId,
      validateProductId,
      validateProductQuantity,
      validateCartOwnership,
      updateProductOfCart
    );

    this.delete(
      "/:cid",
      isAuthenticated,
      isAuthorized(ROLES.ALL),
      validateCartId,
      validateCartOwnership,
      deleteAllProductsOfCart
    );

    this.delete(
      "/:cid/products/:pid",
      isAuthenticated,
      isAuthorized(ROLES.ALL),
      validateCartId,
      validateProductId,
      validateCartOwnership,
      deleteProductOfCart
    );

    this.post(
      "/:cid/purchase",
      isAuthenticated,
      isAuthorized(ROLES.ALL),
      validateCartId,
      validateCartOwnership,
      purchaseCart
    );
  }
}

export const cartsRouter = new CartsRouter().getRouter();
