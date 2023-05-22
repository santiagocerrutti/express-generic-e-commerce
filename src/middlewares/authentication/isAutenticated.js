export function isAuthenticated(req, res, next) {
  console.log("middlewares.isAuthenticated", req.session);

  if (req.session.user) {
    next();

    return;
  }

  res.status(401).send({ status: "ERROR", error: "Not authenticated." });
}
