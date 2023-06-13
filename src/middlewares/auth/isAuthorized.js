export function isAuthorized(role) {
  return async function (req, res, next) {
    const { user } = req.user;

    if (user && user.role === role) {
      next();

      return;
    }

    res.status(403).send({ status: "ERROR", error: "No permissions" });
  };
}

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};
