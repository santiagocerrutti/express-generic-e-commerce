import {
  deleteProductHandler,
  getProductByIdHandler,
  getProductsHandler,
  postProductHandler,
  putProductHandler,
} from "../handlers/products.handler.js";
import {
  ROLES,
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth/index.js";
import {
  validateGetProductsQuery,
  validatePostProduct,
  validateProductId,
  validatePutProduct,
} from "../middlewares/validation/product.validator.js";
import { Router } from "./Router.js";

class ProductsRouter extends Router {
  init() {
    this.get(
      "/",
      isAuthenticated,
      validateGetProductsQuery,
      getProductsHandler
    );
    this.get(
      "/:pid",
      isAuthenticated,
      validateProductId,
      getProductByIdHandler
    );
    this.post(
      "/",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN),
      validatePostProduct,
      postProductHandler
    );
    this.put(
      "/:pid",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN),
      validateProductId,
      validatePutProduct,
      putProductHandler
    );
    this.delete(
      "/:pid",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN),
      deleteProductHandler
    );
  }
}

export const productsRouter = new ProductsRouter().getRouter();
