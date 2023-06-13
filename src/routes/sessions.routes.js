import { Router } from "express";

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

const router = Router();

router.post(
  "/register",
  validateRegister,
  passportCall("register", { session: false }),
  postRegisterHandler
);

router.post(
  "/login",
  validateLogin,
  passportCall("login", { session: false }),
  postLoginHandler
);

router.get("/current", isAuthenticated, getCurrentHandler);
router.post("/logout", postLogoutHandler);

export default router;
