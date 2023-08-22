import { productsService, usersService } from "../../services/index.js";
import { CustomError, ERROR_CODE } from "../../utils.js";
import { ROLES } from "../auth/index.js";

export async function validateProductOwnership(req, res, next) {
  const user = await usersService.getById(req.user.user._id);

  if (user.role === ROLES.ADMIN) {
    next();

    return;
  }

  const { pid } = req.params;
  const product = await productsService.getById(pid);

  if (String(user._id) === product.owner) {
    next();

    return;
  }

  const error = new CustomError(
    `User ${user._id} not authorized to modify product: ${pid}`,
    ERROR_CODE.NOT_AUTHENITCATED
  );

  next(error);
}
