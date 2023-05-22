export function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();

    return;
  }

  res.status(401).send({ status: "ERROR", error: "Not authenticated." });
}

export function isAuthenticatedView(req, res, next) {
  if (req.session.user) {
    next();

    return;
  }

  res.render("login", {});
}
