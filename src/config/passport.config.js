import passport from "passport";
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

function extractJwtFromCookie(req) {
  if (req?.cookies) {
    return req.cookies[env.JWT_COOKIE_NAME];
  }

  return null;
}

export function initializePassport() {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const cart = await addCart();
          const role = username === env.ADMIN_EMAIL ? "admin" : "user";

          const result = await createUser({
            ...req.body,
            email: username,
            password,
            cart: cart._id,
            role,
          });

          return done(null, result);
        } catch (error) {
          if (error.code === "DUPLICATED_KEY") {
            return done(null, false);
          }

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

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
        secretOrKey: env.JWT_SECRET,
      },
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

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: env.GITHUB_CALLBACK_URL,
      },
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
