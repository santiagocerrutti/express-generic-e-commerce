import { CustomError, ERROR_CODE } from "../../utils.js";

/**
 * Middleware
 * Validates if logged user has roles
 * @param  {ROLES[]} roles array of roles to check.
 * @returns
 */
export function isAuthorized(...roles) {
  //* Los middlewares deben ser funciones que respeten la firma middleware(req, res, next)
  //* O devolver funciones que respeten dicha firma (en caso de que reciban parametros)
  return async function (req, res, next) {
    try {
      // TODO: Revisar por qué se implementó el Role Public ¿Es necesario? ¿Es una buena práctica?
      // // if (roles.includes(ROLES.PUBLIC)) {
      // //   next();

      // //   return;
      // // }

      const { user } = req.user;

      if (user && roles.includes(user.role)) {
        next();

        return;
      }

      throw new CustomError("No permissions", ERROR_CODE.NOT_AUTHORIZED);
    } catch (error) {
      next(error);
    }
  };
}

export const ROLES = {
  // // PUBLIC: "public",
  PREMIUM: "premium",
  ADMIN: "admin",
  USER: "user",
};
