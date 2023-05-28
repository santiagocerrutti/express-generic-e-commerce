import { Router } from "express";
import {
  getCartByIdHandler,
  getChatHandler,
  getLoginHandler,
  getProductsHandler,
  getProductsPaginateHandler,
  getRealTimeProductsHandler,
  getRegisterHandler,
  postLogin,
  postLogout,
  postRegister,
} from "../handlers/views.handler.js";
import { isAuthenticatedView } from "../middlewares/authentication/isAutenticated.js";
import { validateCartId } from "../middlewares/validation/cart.validator.js";

const router = Router();

router.get("/", getLoginHandler);
router.get("/products", isAuthenticatedView, getProductsPaginateHandler);
router.get("/carts/:cid", isAuthenticatedView, getProductsHandler);
router.get(
  "/realtimeproducts",
  isAuthenticatedView,
  getRealTimeProductsHandler
);
router.get("/chat", isAuthenticatedView, getChatHandler);
router.get(
  "/cart/:cid",
  isAuthenticatedView,
  validateCartId,
  getCartByIdHandler
);
router.get("/login", getLoginHandler);
router.get("/register", getRegisterHandler);
router.post("/sessions/login", postLogin);
router.post("/sessions/register", postRegister);
router.post("/sessions/logout", postLogout);

export default router;
