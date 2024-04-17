import { passportAuthenticate } from "../config/passportAuthenticate.js";
import { sessionsController } from "../controllers/sessions.controller.js";
import {
  ROLES,
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth/index.js";
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
      isAuthorized(ROLES.PUBLIC),
      register
    );

    this.post(
      "/login",
      validateLogin,
      passportAuthenticate("login", { session: false }),
      isAuthorized(ROLES.PUBLIC),
      login
    );

    this.get("/current", isAuthenticated, isAuthorized(ROLES.ALL), getCurrent);

    this.post("/logout", isAuthenticated, isAuthorized(ROLES.ALL), logout);

    this.post(
      "/reset-password-request",
      validateEmail,
      isAuthorized(ROLES.PUBLIC),
      requestNewPassword
    );

    this.post(
      "/new-password/:token",
      validatePassword,
      isAuthorized(ROLES.PUBLIC),
      updatePassword
    );
  }
}

export const sessionsRouter = new SessionsRouter().getRouter();
