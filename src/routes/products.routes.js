import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/products.controller.js";
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
    this.get("/", isAuthenticated, validateGetProductsQuery, getProducts);

    this.get("/:pid", isAuthenticated, validateProductId, getProductById);

    this.post(
      "/",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN),
      validatePostProduct,
      createProduct
    );

    this.put(
      "/:pid",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN),
      validateProductId,
      validatePutProduct,
      updateProduct
    );

    this.delete(
      "/:pid",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN),
      deleteProduct
    );
  }
}

export const productsRouter = new ProductsRouter().getRouter();
