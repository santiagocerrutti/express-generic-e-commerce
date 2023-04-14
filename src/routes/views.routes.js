import { Router } from "express";
import {
  getProductsHandler,
  getRealTimeProductsHandler,
} from "../handlers/views.js";

const router = Router();

router.get("/", getProductsHandler);
router.get("/realtimeproducts", getRealTimeProductsHandler);

export default router;
