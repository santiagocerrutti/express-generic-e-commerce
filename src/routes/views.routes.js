import { Router } from "express";
import {
  getCartByIdHandler,
  getChatHandler,
  getProductsHandler,
  getProductsPaginateHandler,
  getRealTimeProductsHandler,
} from "../handlers/views.handler.js";
import { validateCartId } from "../middlewares/validation/cart.validator.js";

const router = Router();

router.get("/", getProductsHandler);
router.get("/products", getProductsPaginateHandler);
router.get("/carts/:cid", getProductsHandler);
router.get("/realtimeproducts", getRealTimeProductsHandler);
router.get("/chat", getChatHandler);
router.get("/cart/:cid", validateCartId, getCartByIdHandler);

export default router;
