import { Router } from "express";
import {
  getCartByIdHandler,
  getCartsHandler,
  postCart,
  postProductToCart,
} from "../handlers/carts.handler.js";
import { validateCartId } from "../middlewares/validation/cart.validator.js";
import { validateProductId } from "../middlewares/validation/product.validator.js";

const router = Router();

router.get("/", getCartsHandler);
router.get("/:cid", validateCartId, getCartByIdHandler);
router.post("/", postCart);
router.post(
  "/:cid/product/:pid",
  validateCartId,
  validateProductId,
  postProductToCart
);

export default router;
