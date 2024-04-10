import { env } from "../config/env.js";
import { UserDto } from "../dto/user.dto.js";
import {
  sendResetPasswordEmail,
  updateLastConnection,
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

    const error = new CustomError("Invalid User", ERROR_CODE.NOT_AUTHENTICATED);
    next(error);
  };

  login = async (req, res, next) => {
    const { user } = req;

    if (user) {
      const token = createTokenFromUser(user);

      await updateLastConnection(user._id);

      res.cookie(env.JWT_COOKIE_NAME, token, cookieConfig);
      res.sendSuccess(token);

      return;
    }

    const error = new CustomError("Invalid User", ERROR_CODE.NOT_AUTHENTICATED);
    next(error);
  };

  logout = async (req, res, next) => {
    try {
      await updateLastConnection(req.user.user._id);

      /**
       * Esto limpia la Cookie en el Cliente (es lo único que se puede hacer cuando se usa JWT).
       * @see https://stackoverflow.com/questions/37959945/how-to-destroy-jwt-tokens-on-logout
       */
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

  requestNewPassword = async (req, res, next) => {
    try {
      const { email } = req.body;

      const result = await sendResetPasswordEmail(email);

      res.sendSuccess(result);
    } catch (error) {
      next(error);
    }
  };

  updatePassword = async (req, res, next) => {
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
