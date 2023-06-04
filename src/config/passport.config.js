import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";

import { UserManager } from "../dao/db/user.manager.js";
import { isValidPassword } from "../utils.js";
import { env } from "./env.js";

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
          const manager = new UserManager();
          const result = await manager.createUser({
            ...req.body,
            email: username,
            password,
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
          const manager = new UserManager();
          const user = await manager.getUserByEmail(username);

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
    "github",
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const manager = new UserManager();
          const user = await manager.getUserByEmail(profile._json.email);

          if (!user) {
            const result = await manager.createUser({
              first_name: profile._json.name,
              last_name: null,
              email: profile._json.email,
              date_of_birth: null,
              password: null,
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
      const manager = new UserManager();
      const user = await manager.findById(id);

      return done(null, user);
    } catch (error) {
      return done(error.message);
    }
  });
}
