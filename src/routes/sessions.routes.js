import { Router } from "express";
import passport from "passport";

import {
  getCurrentHandler,
  postLoginHandler,
  postLogoutHandler,
  postRegisterHandler,
} from "../handlers/sessions.handler.js";
import { isAuthenticated } from "../middlewares/authentication/isAutenticated.js";
import {
  validateLogin,
  validateRegister,
} from "../middlewares/validation/user.validator.js";

const router = Router();

router.post(
  "/register",
  validateRegister,
  passport.authenticate("register", {}),
  postRegisterHandler
);

router.post(
  "/login",
  validateLogin,
  passport.authenticate("login", {}),
  postLoginHandler
);

router.get("/current", isAuthenticated, getCurrentHandler);
router.post("/logout", postLogoutHandler);

export default router;
