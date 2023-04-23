import { Router } from "express";
import {
  getChatHandler,
  getProductsHandler,
  getRealTimeProductsHandler,
} from "../handlers/views.js";

const router = Router();

router.get("/", getProductsHandler);
router.get("/realtimeproducts", getRealTimeProductsHandler);
router.get("/chat", getChatHandler);

export default router;
