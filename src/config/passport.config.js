import passport from "passport";
import local from "passport-local";

import { UserManager } from "../dao/db/user.manager.js";
import { isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

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
          const validPassword = await isValidPassword(password, user.password);

          if (user && validPassword) {
            return done(null, user);
          }

          return done(null, false);
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
