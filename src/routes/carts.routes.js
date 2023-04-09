import { Router } from "express";
import {
  getCartByIdHandler,
  getCartsHandler,
  postCart,
  postProductToCart,
} from "../handlers/carts.js";

const router = Router();

router.get("/", getCartsHandler);
router.get("/:cid", getCartByIdHandler);
router.post("/", postCart);
router.post("/:cid/product/:pid", postProductToCart);

export default router;
