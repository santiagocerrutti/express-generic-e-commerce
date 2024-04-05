import { passportAuthenticate } from "../../config/passportAuthenticate.js";

/**
 * Validates if JWT in request header is valid.
 */
export const isAuthenticated = passportAuthenticate("jwt", { session: false });

/**
 * Validates if JWT in request header is valid.
 * Otherwise redirects to view
 */
export const isAuthenticatedView = passportAuthenticate("jwt", {
  session: false,
  failureRedirect: "/login-fail",
});
