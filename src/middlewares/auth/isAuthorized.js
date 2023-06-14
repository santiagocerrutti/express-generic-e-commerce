// Los middlewares deben devolver funciones que respeten la firma (req, res, next)
export function isAuthorized(roles) {
  return async function (req, res, next) {
    if (roles.include(ROLES.PUBLIC)) {
      next();

      return;
    }

    const { user } = req.user;

    if (user && roles.include(user.role)) {
      next();

      return;
    }

    res.status(403).send({ status: "ERROR", error: "No permissions" });
  };
}

export const ROLES = {
  PUBLIC: "public",
  ADMIN: "admin",
  USER: "user",
};
