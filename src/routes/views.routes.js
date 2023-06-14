import { passportCall } from "../config/passportCall.js";
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
import { isAuthenticatedView } from "../middlewares/auth/index.js";
import { validateCartId } from "../middlewares/validation/cart.validator.js";
import { Router } from "./Router.js";

class ViewsRouter extends Router {
  init() {
    this.get("/", getLoginHandler);
    this.get("/products", isAuthenticatedView, getProductsPaginateHandler);
    this.get("/carts/:cid", isAuthenticatedView, getProductsHandler);
    this.get(
      "/realtimeproducts",
      isAuthenticatedView,
      getRealTimeProductsHandler
    );
    this.get("/chat", isAuthenticatedView, getChatHandler);
    this.get(
      "/cart/:cid",
      isAuthenticatedView,
      validateCartId,
      getCartByIdHandler
    );

    this.get("/login", getLoginHandler);

    this.get("/login-fail", getLoginFailHandler);

    this.get("/register", getRegisterHandler);

    this.get("/register-fail", getRegisterFailHandler);

    this.get(
      "/sessions/login-github",
      passportCall("github", { session: false, scope: ["user:email"] })
    );

    this.get(
      "/sessions/github-callback",
      passportCall("github", {
        session: false,
        failureRedirect: "/login-fail",
      }),
      getGithubCallbackHandler
    );

    this.get("/logout", getLogoutHandler);
  }
}

export const viewsRouter = new ViewsRouter().getRouter();
