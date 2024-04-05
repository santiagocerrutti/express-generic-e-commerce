import jwt from "jsonwebtoken";
import { env } from "../../config/env";

/**
 * Middleware
 * Validate if JWT in request header is valid.
 * Sets req.user in case is valid.
 * @deprecated This is currently replaced by passport
 */
export function isAuthenticated(req, res, next) {
  const authHeader = req.headers["Authorization"];

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const user = jwt.verify(token, env.JWT_SECRET);
      req.user = user;
      next();

      return;
    } catch (error) {
      res.status(401).send({ status: "ERROR", error: "Not authenticated." });
    }
  }
}
