import { passportCall } from "../config/passportCall.js";
import { sessionsController } from "../controllers/sessions.controller.js";
import { isAuthenticated } from "../middlewares/auth/index.js";
import {
  validateEmail,
  validateLogin,
  validatePassword,
  validateRegister,
} from "../middlewares/validation/user.validator.js";
import { Router } from "./Router.js";

const {
  getCurrent,
  login,
  logout,
  register,
  resetPasswordRequest,
  newUserPassword,
} = sessionsController;
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

    this.post("/logout", isAuthenticated, logout);

    this.post("/reset-password-request", validateEmail, resetPasswordRequest);

    this.post("/new-password/:token", validatePassword, newUserPassword);
  }
}

export const sessionsRouter = new SessionsRouter().getRouter();
