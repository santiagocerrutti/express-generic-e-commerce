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

router.get("/login", isAuthenticatedView, getLoginHandler);
router.post(
  "/sessions/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/login-fail",
  }),
  postLoginHandler
);
router.get("/login-fail", postLoginFailHandler);

router.get(
  "/register",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/register-fail",
  }),
  getRegisterHandler
);

router.post(
  "/sessions/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/register-fail",
  }),
  postRegisterHandler
);
router.get("/register-fail", postRegisterFailHandler);

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

router.post("/sessions/logout", postLogoutHandler);

export default router;
