import { CustomError, ERROR_CODE } from "../../utils.js";

// Los middlewares deben devolver funciones que respeten la firma (req, res, next)
export function isAuthorized(...roles) {
  return async function (req, res, next) {
    if (roles.includes(ROLES.PUBLIC)) {
      next();

      return;
    }

    const { user } = req.user;

    if (user && roles.includes(user.role)) {
      next();

      return;
    }

    throw new CustomError("No permissions", ERROR_CODE.NOT_AUTHORIZED);
  };
}

export const ROLES = {
  PUBLIC: "public",
  PREMIUM: "premium",
  ADMIN: "admin",
  USER: "user",
};
