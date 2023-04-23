import { Router } from "express";

import {
  deleteProductHandler,
  getProductByIdHandler,
  getProductsHandler,
  postProductHandler,
  putProductHandler,
} from "../handlers/products.handler.js";

const router = Router();

router.get("/", getProductsHandler);
router.get("/:pid", getProductByIdHandler);
router.post("/", postProductHandler);
router.put("/:pid", putProductHandler);
router.delete("/:pid", deleteProductHandler);

export default router;
