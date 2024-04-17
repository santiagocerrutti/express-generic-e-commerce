import { productsController } from "../controllers/products.controller.js";
import {
  ROLES,
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth/index.js";
import { validateProductOwnership } from "../middlewares/validation/product-ownership.validator.js";
import {
  validateGetProductsQuery,
  validatePostProduct,
  validateProductId,
  validatePutProduct,
} from "../middlewares/validation/product.validator.js";
import { Router } from "./Router.js";

const {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} = productsController;

class ProductsRouter extends Router {
  init() {
    this.get(
      "/",
      isAuthenticated,
      isAuthorized(ROLES.ALL),
      validateGetProductsQuery,
      getProducts
    );

    this.get(
      "/:pid",
      isAuthenticated,
      isAuthorized(ROLES.ALL),
      validateProductId,
      getProductById
    );

    this.post(
      "/",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN, ROLES.PREMIUM),
      validatePostProduct,
      createProduct
    );

    this.put(
      "/:pid",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN, ROLES.PREMIUM),
      validateProductId,
      validatePutProduct,
      validateProductOwnership,
      updateProduct
    );

    this.delete(
      "/:pid",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN, ROLES.PREMIUM),
      validateProductOwnership,
      deleteProduct
    );
  }
}

export const productsRouter = new ProductsRouter().getRouter();
