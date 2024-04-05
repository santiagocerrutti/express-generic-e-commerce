import passport from "passport";
import { CustomError, ERROR_CODE } from "../utils.js";

/**
 * Middleware
 * This is to handle the same error on each request?
 * @param {string} strategy "register" | "login" | "jwt" | "github"
 * @param {object} options
 * @see https://www.passportjs.org/concepts/authentication/middleware/
 */
export function passportAuthenticate(strategy, options) {
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
          //? ¿Esto es necesario?
          //* https://www.passportjs.org/concepts/authentication/middleware/#:~:text=By%20default%2C%20when%20authentication%20succeeds%2C%20the%20req.user%20property%20is%20set%20to%20the%20authenticated%20user%2C%20a%20login%20session%20is%20established%2C%20and%20the%20next%20function%20in%20the%20stack%20is%20called
          req.user = user;
          next();
        } else {
          const error = new CustomError(
            info?.message || "Invalid User",
            ERROR_CODE.NOT_AUTHENTICATED
          );
          next(error);

          return;
        }
      }
    );

    //* En este caso, se crea una función middleware interna y se llama dentro del middleware
    middleware(req, res, next);
  };
}
