import { logger } from "../../config/logger.js";

/**
 * Middleware
 * Add the logger on the request object
 * Logs the incomming request
 */
export function addLogger(req, res, next) {
  req.logger = logger;

  req.logger.http(`Request: ${req.method}: ${req.path}`);

  next();
}
