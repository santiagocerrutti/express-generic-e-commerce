import { usersController } from "../controllers/users.controller.js";
import {
  ROLES,
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth/index.js";
import { Router } from "./Router.js";

const { switchUserToPremium } = usersController;

class UsersRouter extends Router {
  init() {
    this.post(
      "/premium/:uid",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN),
      switchUserToPremium
    );
  }
}

export const usersRouter = new UsersRouter().getRouter();
