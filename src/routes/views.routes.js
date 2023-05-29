import { Router } from "express";
import passport from "passport";

import {
  getCartByIdHandler,
  getChatHandler,
  getGithubCallbackHandler,
  getLoginHandler,
  getProductsHandler,
  getProductsPaginateHandler,
  getRealTimeProductsHandler,
  getRegisterHandler,
  postLoginFailHandler,
  postLoginHandler,
  postLogoutHandler,
  postRegisterFailHandler,
  postRegisterHandler,
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
router.post(
  "/sessions/login",
  passport.authenticate("login", { failureRedirect: "/login-fail" }),
  postLoginHandler
);
router.get("/login-fail", postLoginFailHandler);

router.get("/register", getRegisterHandler);
router.post(
  "/sessions/register",
  passport.authenticate("register", {
    failureRedirect: "/register-fail",
  }),
  postRegisterHandler
);
router.get("/register-fail", postRegisterFailHandler);

router.get(
  "/sessions/login-github",
  passport.authenticate("github", { scope: ["user:email"] }),
  () => {}
);

router.get(
  "/sessions/github-callback",
  passport.authenticate("github", { failureRedirect: "/login-fail" }),
  getGithubCallbackHandler
);

router.post("/sessions/logout", postLogoutHandler);

export default router;
