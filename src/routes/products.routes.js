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
import { isAuthenticated } from "../middlewares/authentication/isAutenticated.js";

const router = Router();

router.get("/", isAuthenticated, validateGetProductsQuery, getProductsHandler);
router.get("/:pid", isAuthenticated, validateProductId, getProductByIdHandler);
router.post("/", isAuthenticated, validatePostProduct, postProductHandler);
router.put(
  "/:pid",
  isAuthenticated,
  validateProductId,
  validatePutProduct,
  putProductHandler
);
router.delete("/:pid", isAuthenticated, deleteProductHandler);

export default router;
