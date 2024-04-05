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
      // TODO: REVISAR si tiene sentido hacer esto; Quizas sea necesario para evitar usuarios que no tengan ROLE.
      // TODO: REVISAR si implementar un ALL puede servir para mejor mantenibilidad (agregado de nuevos roles)
      //* TAMBIEN SERVIRIA COMO UNA FORMA DECLARATIVA DE DOCUMENTAR ROLES EN EL CODIGO
      isAuthorized(ROLES.ADMIN, ROLES.PREMIUM, ROLES.USER),
      validateUserId,
      validateLoggedUserPermissions,
      // TODO: probar si se puede mover el .single("document") al Multer
      userDocumentUploader.single("document"),
      validateUserDocumentFile,
      uploadUserDocument
    );
  }
}

export const usersRouter = new UsersRouter().getRouter();
