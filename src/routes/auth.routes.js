import { Router } from "express";
import {
  validateLogin,
  validateRegister,
} from "../middlewares/validation/user.validator.js";
import {
  postLogin,
  postLogout,
  postRegister,
} from "../handlers/auth.handler.js";

const router = Router();

router.post("/register", validateRegister, postRegister);
router.post("/login", validateLogin, postLogin);
router.post("/logout", postLogout);

export default router;
