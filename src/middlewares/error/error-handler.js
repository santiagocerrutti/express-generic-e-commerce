/* eslint-disable no-unused-vars */
import { ERROR_CODE } from "../../utils.js";

// Para que express lo interprete como un error handler, debe contar con 4 argumentos
// Para llamarlo, todos los middleware anteriores deben llamar next() con un argumento.
export async function errorHandler(err, req, res, next) {
  req.logger.error(err.message || err);

  if (err.code === ERROR_CODE.INVALID_BODY) {
    res.sendBadRequest(err.message, err.errors);

    return;
  } else if (err.code === ERROR_CODE.NOT_FOUND) {
    res.sendNotFound(err.message);

    return;
  } else if (err.code === ERROR_CODE.DUPLICATED_KEY) {
    res.sendConflict(err.message);

    return;
  } else if (err.code === ERROR_CODE.NOT_AUTHENITCATED) {
    res.sendNotAuthenticated(err.message);

    return;
  } else if (err.code === ERROR_CODE.NOT_AUTHORIZED) {
    res.sendNotAuthorized(err.message);

    return;
  }

  res.sendInternalServerError();
}
