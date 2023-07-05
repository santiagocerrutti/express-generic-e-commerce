import { env } from "../config/env.js";
import { UserDto } from "../dto/user.dto.js";
import { cookieConfig, createTokenFromUser } from "../utils.js";

class SessionsController {
  constructor() {}

  register = async (req, res) => {
    const { user } = req;

    if (user) {
      res.sendCreated("User created successfully");

      return;
    }

    res.sendNotAutenticated("Invalid User");
  };

  login = async (req, res) => {
    const { user } = req;

    if (user) {
      const token = createTokenFromUser(user);

      res.cookie(env.JWT_COOKIE_NAME, token, cookieConfig);
      res.sendSuccess("Login successfull");

      return;
    }

    res.sendNotAutenticated("Invalid User");
  };

  logout = async (req, res) => {
    try {
      res.clearCookie(env.JWT_COOKIE_NAME);
      res.sendSuccess("Logout successfull.");

      return;
    } catch (error) {
      console.log(error);
      res.sendInternalServerError();
    }
  };

  getCurrent = async (req, res) => {
    const user = new UserDto(req.user.user);
    res.sendSuccess({ user });
  };
}

export const sessionsController = new SessionsController();
