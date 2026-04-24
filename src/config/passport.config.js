import passport from "passport";
import BaseError from "../helpers/baseError.helper.js";
import UserModel from "../models/User.model.js";
import * as envConfigs from "./env.config.js";
import LocalStrategy from "./strategies/local.strategy.js";
import createGoogleOAuthStrategy from "./strategies/google.strategy.js";

export default function () {
  passport.use(LocalStrategy);

  console.log(envConfigs.GOOGLE_CLIENT_ID && envConfigs.GOOGLE_CLIENT_SECRET);
  if (envConfigs.GOOGLE_CLIENT_ID && envConfigs.GOOGLE_CLIENT_SECRET) {
    passport.use(createGoogleOAuthStrategy());
  }

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (err) {
      const error = new BaseError(
        "Authentication",
        err?.message || "Failed to Login",
        err?.status || 400,
        true,
        { ...err },
      );
      done(error, user);
    }
  });
}
