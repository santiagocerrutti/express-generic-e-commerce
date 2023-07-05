import { ROLES } from "../auth/index.js";

export function validateCartOwnership(req, res, next) {
  const { user: userJwt } = req;
  const { user } = userJwt;
  const { cid } = req.params;

  if (user.cart === cid || user.role === ROLES.ADMIN) {
    next();

    return;
  }

  res.sendNotAuthorized(
    `User ${user._id} not authorized to modify cart: ${cid}`
  );
}
