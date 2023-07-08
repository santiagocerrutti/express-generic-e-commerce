import { usersService } from "../../services/index.js";
import { ROLES } from "../auth/index.js";

export async function validateCartOwnership(req, res, next) {
  const user = await usersService.getById(req.user.user._id);
  const { cid } = req.params;

  if (String(user.cart) === cid || user.role === ROLES.ADMIN) {
    next();

    return;
  }

  res.sendNotAuthorized(
    `User ${user._id} not authorized to modify cart: ${cid}`
  );
}
