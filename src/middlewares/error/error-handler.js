/* eslint-disable no-unused-vars */
import { ERROR_CODE } from "../../utils.js";

//* Para que express lo interprete como un error handler, debe contar con 4 argumentos
//* Para llamarlo, todos los middleware anteriores deben llamar next() con un argumento.
/**
 * Finish request process sending the appropriated error response
 * Logs the occurring error
 */
export async function errorHandler(err, req, res, next) {
  req.logger.error(err.message || err);

  switch (err.code) {
    case ERROR_CODE.INVALID_BODY:
      res.sendBadRequest(err.message, err.errors);
      break;
    case ERROR_CODE.NOT_FOUND:
      res.sendNotFound(err.message);
      break;
    case ERROR_CODE.BUSINESS_LOGIC_ERROR:
    case ERROR_CODE.DUPLICATED_KEY:
      res.sendConflict(err.message);
      break;
    case ERROR_CODE.NOT_AUTHENTICATED:
      res.sendNotAuthenticated(err.message);
      break;
    case ERROR_CODE.NOT_AUTHORIZED:
      res.sendNotAuthorized(err.message);
      break;
    default:
      res.sendInternalServerError();
      break;
  }
}
