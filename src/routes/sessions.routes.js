import { passportCall } from "../config/passportCall.js";
import {
  getCurrentHandler,
  postLoginHandler,
  postLogoutHandler,
  postRegisterHandler,
} from "../handlers/sessions.handler.js";
import { isAuthenticated } from "../middlewares/auth/index.js";
import {
  validateLogin,
  validateRegister,
} from "../middlewares/validation/user.validator.js";
import { Router } from "./Router.js";

class SessionsRouter extends Router {
  init() {
    this.post(
      "/register",
      validateRegister,
      passportCall("register", { session: false }),
      postRegisterHandler
    );

    this.post(
      "/login",
      validateLogin,
      passportCall("login", { session: false }),
      postLoginHandler
    );

    this.get("/current", isAuthenticated, getCurrentHandler);
    this.post("/logout", postLogoutHandler);
  }
}

export const sessionsRouter = new SessionsRouter().getRouter();
