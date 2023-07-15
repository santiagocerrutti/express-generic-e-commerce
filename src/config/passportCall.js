import passport from "passport";
import { CustomError, ERROR_CODE } from "../utils.js";

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
          const error = new CustomError(
            info?.message || "Invalid User",
            ERROR_CODE.NOT_AUTHENITCATED
          );
          next(error);

          return;
        }
      }
    );

    middleware(req, res, next);
  };
}
