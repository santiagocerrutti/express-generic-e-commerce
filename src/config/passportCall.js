import passport from "passport";

// Documentación? (TODO: buscar ejemplos)
export function passportCall(strategy, options) {
  return async function (req, res, next) {
    const middleware = passport.authenticate(
      strategy,
      options,
      (err, user, info) => {
        if (err) {
          next(err);

          return;
        }

        if (user) {
          req.user = user;
          next();
        } else {
          res.status(401).send({
            status: "ERROR",
            error: info?.message || info?.toString(),
          });
        }
      }
    );

    middleware(req, res, next);
  };
}
