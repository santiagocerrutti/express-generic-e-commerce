import { passportCall } from "../config/passportCall.js";
import {
  getCartByIdView,
  getChatView,
  getGithubCallbackView,
  getLoginFailView,
  getLoginView,
  getLogoutView,
  getProductsPaginateView,
  getProductsView,
  getRealTimeProductsView,
  getRegisterFailView,
  getRegisterView,
} from "../controllers/views.controller.js";
import { isAuthenticatedView } from "../middlewares/auth/index.js";
import { validateCartId } from "../middlewares/validation/cart.validator.js";
import { Router } from "./Router.js";

class ViewsRouter extends Router {
  init() {
    this.get("/", getLoginView);

    this.get("/products", isAuthenticatedView, getProductsPaginateView);

    this.get("/carts/:cid", isAuthenticatedView, getProductsView);

    this.get("/realtimeproducts", isAuthenticatedView, getRealTimeProductsView);

    this.get("/chat", isAuthenticatedView, getChatView);

    this.get(
      "/cart/:cid",
      isAuthenticatedView,
      validateCartId,
      getCartByIdView
    );

    this.get("/login", getLoginView);

    this.get("/login-fail", getLoginFailView);

    this.get("/register", getRegisterView);

    this.get("/register-fail", getRegisterFailView);

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
      getGithubCallbackView
    );

    this.get("/logout", getLogoutView);
  }
}

export const viewsRouter = new ViewsRouter().getRouter();
