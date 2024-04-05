import passport from "passport";
/**
 * Passport:
 * Strategies are distributed in separate packages which must be installed, configured, and registered.
 * The configuration varies with each authentication mechanism, so strategy-specific documentation should be consulted.
 * */
import { Strategy as GitHubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import {
  addCart,
  createUser,
  findUserById,
  getUserByEmail,
} from "../use-cases/index.js";
import { isValidPassword } from "../utils.js";
import { env } from "./env.js";

/**
 * Extractor is a function that returns a JWT or null
 * Extracts JWT from cookie using defined cookie name
 * @see https://www.passportjs.org/packages/passport-jwt/#extracting-the-jwt-from-the-request
 */
function extractJwtFromCookie(req) {
  if (req?.cookies) {
    return req.cookies[env.JWT_COOKIE_NAME];
  }

  return null;
}

export function initializePassport() {
  //* The mechanism used to authenticate the request is implemented by a strategy.
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      //* verify()
      //* The verify() function encapsulates business logic associated to the authentication process
      async (req, username, password, done) => {
        try {
          const role = username === env.ADMIN_EMAIL ? "admin" : "user";

          const result = await createUser({
            ...req.body,
            email: username,
            password,
            role,
          });

          await addCart(result);

          //* cb() should be called as cb(null, user) when credentials are valid
          return done(null, result);
        } catch (error) {
          if (error.code === "DUPLICATED_KEY") {
            //* cb() should be called as cb(null, false) when credentials are not valid
            return done(null, false);
          }

          //* cb() should be called as cb(err) when an errors occurs
          return done(error.message);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await getUserByEmail(username);

          if (user) {
            const validPassword = await isValidPassword(
              password,
              user.password
            );

            if (validPassword) {
              return done(null, user);
            }
          }

          return done(null, false);
        } catch (error) {
          return done(error.message);
        }
      }
    )
  );

  /**
   * @see https://www.passportjs.org/packages/passport-jwt/
   */
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
        secretOrKey: env.JWT_SECRET,
      },
      //* verifier validates if JWT is valid
      async (payload, done) => {
        try {
          if (payload) {
            return done(null, payload);
          }

          return done(null, false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /**
   * @see https://www.passportjs.org/packages/passport-github2/
   */
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: env.GITHUB_CALLBACK_URL,
      },
      //* verify() is executed when User grants access from Github
      //* accessToken should be used on OAuth2.0 resource server access
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await getUserByEmail(profile._json.email);

          if (!user) {
            const cart = await addCart();
            const role =
              profile._json.email === env.ADMIN_EMAIL ? "admin" : "user";

            const result = await createUser({
              first_name: profile._json.name,
              last_name: null,
              email: profile._json.email,
              date_of_birth: null,
              password: null,
              role,
              cart: cart._id,
            });

            return done(null, result);
          }

          return done(null, user);
        } catch (error) {
          return done(error.message);
        }
      }
    )
  );

  /**
   * To maintain a login session, Passport serializes and deserializes user information to and from the session.
   * The information that is stored is determined by the application, which supplies a serializeUser and a deserializeUser function.
   * @see https://www.passportjs.org/concepts/authentication/sessions/
   */
  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUserById(id);

      return done(null, user);
    } catch (error) {
      return done(error.message);
    }
  });
}
