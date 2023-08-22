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

const { switchUserToPremium, uploadUserDocument } = usersController;

class UsersRouter extends Router {
  init() {
    this.post(
      "/premium/:uid",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN),
      switchUserToPremium
    );

    this.post(
      "/:uid/documents",
      isAuthenticated,
      isAuthorized(ROLES.ADMIN, ROLES.PREMIUM, ROLES.USER),
      validateUserId,
      validateLoggedUserPermissions,
      userDocumentUploader.single("document"),
      validateUserDocumentFile,
      uploadUserDocument
    );
  }
}

export const usersRouter = new UsersRouter().getRouter();
