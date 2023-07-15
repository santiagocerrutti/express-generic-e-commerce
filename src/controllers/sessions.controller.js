import { env } from "../config/env.js";
import { UserDto } from "../dto/user.dto.js";
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
}

export const sessionsController = new SessionsController();
