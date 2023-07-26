import { usersService } from "../../services/index.js";
import { CustomError, ERROR_CODE } from "../../utils.js";
import { ROLES } from "../auth/index.js";

export async function validateCartOwnership(req, res, next) {
  console.log(req.user);
  // ¿el USER del TOKEN no tiene los Roles?
  const user = await usersService.getById(req.user.user._id);
  const { cid } = req.params;

  if (String(user.cart) === cid || user.role === ROLES.ADMIN) {
    next();

    return;
  }

  const error = new CustomError(
    `User ${user._id} not authorized to modify cart: ${cid}`,
    ERROR_CODE.NOT_AUTHENITCATED
  );
  next(error);
}
