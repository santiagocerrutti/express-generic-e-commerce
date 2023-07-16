import { logger } from "../../config/logger.js";

export function addLogger(req, res, next) {
  req.logger = logger;

  req.logger.http(`Request: ${req.method}: ${req.path}`);

  next();
}
