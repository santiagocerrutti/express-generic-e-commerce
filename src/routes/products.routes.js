import { Router } from "express";

import {
  deleteProductHandler,
  getProductByIdHandler,
  getProductsHandler,
  postProductHandler,
  putProductHandler,
} from "../handlers/products.handler.js";
import {
  validatePostProduct,
  validateProductId,
  validatePutProduct,
} from "../middlewares/validation/product.validator.js";

const router = Router();

router.get("/", getProductsHandler);
router.get("/:pid", validateProductId, getProductByIdHandler);
router.post("/", validatePostProduct, postProductHandler);
router.put("/:pid", validateProductId, validatePutProduct, putProductHandler);
router.delete("/:pid", deleteProductHandler);

export default router;
