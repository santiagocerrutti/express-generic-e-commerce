// import jwt from "jsonwebtoken";
// import { env } from "../../config/env";

import passport from "passport";

// export function isAuthenticated(req, res, next) {
//   const authHeader = req.headers["Authorization"];

//   if (authHeader) {
//     const token = authHeader.split(" ")[1];

//     try {
//       const user = jwt.verify(token, env.JWT_SECRET);
//       req.user = user;
//       next();

//       return;
//     } catch (error) {
//       res.status(401).send({ status: "ERROR", error: "Not authenticated." });
//     }
//   }
// }

export const isAuthenticated = passport.authenticate("jwt", { session: false });

export const isAuthenticatedView = passport.authenticate("jwt", {
  session: false,
  failureRedirect: "/login-fail",
});
