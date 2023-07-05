import { passportCall } from "../config/passportCall.js";
import { sessionsController } from "../controllers/sessions.controller.js";
import { isAuthenticated } from "../middlewares/auth/index.js";
import {
  validateLogin,
  validateRegister,
} from "../middlewares/validation/user.validator.js";
import { Router } from "./Router.js";

const { getCurrent, login, logout, register } = sessionsController;
class SessionsRouter extends Router {
  init() {
    this.post(
      "/register",
      validateRegister,
      passportCall("register", { session: false }),
      register
    );

    this.post(
      "/login",
      validateLogin,
      passportCall("login", { session: false }),
      login
    );

    this.get("/current", isAuthenticated, getCurrent);

    this.post("/logout", logout);
  }
}

export const sessionsRouter = new SessionsRouter().getRouter();
