import { passportAuthenticate } from "../config/passportAuthenticate.js";
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
  requestNewPassword,
  updatePassword,
} = sessionsController;
class SessionsRouter extends Router {
  init() {
    this.post(
      "/register",
      validateRegister,
      passportAuthenticate("register", { session: false }),
      register
    );

    this.post(
      "/login",
      validateLogin,
      passportAuthenticate("login", { session: false }),
      login
    );

    this.get("/current", isAuthenticated, getCurrent);

    this.post("/logout", isAuthenticated, logout);

    this.post("/reset-password-request", validateEmail, requestNewPassword);

    this.post("/new-password/:token", validatePassword, updatePassword);
  }
}

export const sessionsRouter = new SessionsRouter().getRouter();
