import { Router } from "express";
import passport from "passport";

import {
  postLoginHandler,
  postLogoutHandler,
  postRegisterHandler,
} from "../handlers/sessions.handler.js";
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

router.post("/logout", postLogoutHandler);

export default router;
