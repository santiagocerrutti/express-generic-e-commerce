import { Router } from "express";

import {
  deleteProductHandler,
  getProductByIdHandler,
  getProductsHandler,
  postProductHandler,
  putProductHandler,
} from "../handlers/products.handler.js";
import {
  validateGetProductsQuery,
  validatePostProduct,
  validateProductId,
  validatePutProduct,
} from "../middlewares/validation/product.validator.js";
import {
  isAuthenticated,
  ROLES,
  isAuthorized,
} from "../middlewares/auth/index.js";

const router = Router();

router.get("/", isAuthenticated, validateGetProductsQuery, getProductsHandler);
router.get("/:pid", isAuthenticated, validateProductId, getProductByIdHandler);
router.post(
  "/",
  isAuthenticated,
  isAuthorized(ROLES.ADMIN),
  validatePostProduct,
  postProductHandler
);
router.put(
  "/:pid",
  isAuthenticated,
  isAuthorized(ROLES.ADMIN),
  validateProductId,
  validatePutProduct,
  putProductHandler
);
router.delete(
  "/:pid",
  isAuthenticated,
  isAuthorized(ROLES.ADMIN),
  deleteProductHandler
);

export default router;
