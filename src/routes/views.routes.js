import { Router } from "express";
import passport from "passport";

import {
  getCartByIdHandler,
  getChatHandler,
  getGithubCallbackHandler,
  getLoginFailHandler,
  getLoginHandler,
  getLogoutHandler,
  getProductsHandler,
  getProductsPaginateHandler,
  getRealTimeProductsHandler,
  getRegisterFailHandler,
  getRegisterHandler,
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

router.get("/login-fail", getLoginFailHandler);

router.get("/register", getRegisterHandler);

router.get("/register-fail", getRegisterFailHandler);

router.get(
  "/sessions/login-github",
  passport.authenticate("github", { session: false, scope: ["user:email"] }),
  () => {}
);

router.get(
  "/sessions/github-callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login-fail",
  }),
  getGithubCallbackHandler
);

router.get("/logout", getLogoutHandler);

export default router;
