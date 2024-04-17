import { usersController } from "../controllers/users.controller.js";
import {
  ROLES,
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth/index.js";
import { validateLoggedUserPermissions } from "../middlewares/validation/update-user.validator.js";
import {
  validateUserDocumentFile,
  validateUserId,
} from "../middlewares/validation/user.validator.js";
import { userDocumentUploader } from "../utils/file-uploader.js";

import { Router } from "./Router.js";

const {
  deleteInactiveUsers,
  getUsers,
  switchUserToPremium,
  uploadUserDocument,
} = usersController;

class UsersRouter extends Router {
  init() {
    this.get("/", isAuthenticated, isAuthorized(ROLES.ADMIN), getUsers);

    this.post(
      "/premium/:uid",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN),
      switchUserToPremium
    );

    this.post(
      "/:uid/documents",
      isAuthenticated,
      isAuthorized(ROLES.ALL),
      validateUserId,
      validateLoggedUserPermissions,
      userDocumentUploader,
      validateUserDocumentFile,
      uploadUserDocument
    );

    this.delete(
      "/",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN),
      deleteInactiveUsers
    );
  }
}

export const usersRouter = new UsersRouter().getRouter();
