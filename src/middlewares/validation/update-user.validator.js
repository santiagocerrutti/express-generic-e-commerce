import { getUserById } from "../../use-cases/user.use-cases.js";
import { CustomError, ERROR_CODE } from "../../utils.js";
import { ROLES } from "../auth/index.js";

export async function validateLoggedUserPermissions(req, res, next) {
  const { uid } = req.params;

  const loggedUser = await getUserById(req.user.user._id);
  const requestUser = await getUserById(uid);

  if (loggedUser.role === ROLES.ADMIN) {
    next();

    return;
  }

  if (requestUser._id === loggedUser._id) {
    next();

    return;
  }

  const error = new CustomError(
    `User ${loggedUser._id} not authorized to modify user: ${uid}`,
    ERROR_CODE.NOT_AUTHORIZED
  );

  next(error);
}
