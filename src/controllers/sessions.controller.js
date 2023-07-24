import { env } from "../config/env.js";
import { UserDto } from "../dto/user.dto.js";
import {
  sendResetPasswordEmail,
  updateUserPassword,
} from "../use-cases/user.use-cases.js";
import {
  CustomError,
  ERROR_CODE,
  cookieConfig,
  createTokenFromUser,
} from "../utils.js";

class SessionsController {
  constructor() {}

  register = async (req, res, next) => {
    const { user } = req;

    if (user) {
      res.sendCreated("User created successfully");

      return;
    }

    const error = new CustomError("Invalid User", ERROR_CODE.NOT_AUTHENITCATED);
    next(error);
  };

  login = async (req, res, next) => {
    const { user } = req;

    if (user) {
      const token = createTokenFromUser(user);

      res.cookie(env.JWT_COOKIE_NAME, token, cookieConfig);
      res.sendSuccess("Login successfull");

      return;
    }

    const error = new CustomError("Invalid User", ERROR_CODE.NOT_AUTHENITCATED);
    next(error);
  };

  logout = async (req, res, next) => {
    try {
      res.clearCookie(env.JWT_COOKIE_NAME);
      res.sendSuccess("Logout successfull.");

      return;
    } catch (error) {
      next(error);
    }
  };

  getCurrent = async (req, res) => {
    const user = new UserDto(req.user.user);
    res.sendSuccess({ user });
  };

  resetPasswordRequest = async (req, res, next) => {
    try {
      const { email } = req.body;

      const result = await sendResetPasswordEmail(email);

      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  };

  newUserPassword = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const result = await updateUserPassword(token, password);

      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  };
}

export const sessionsController = new SessionsController();
