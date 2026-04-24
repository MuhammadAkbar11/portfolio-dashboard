import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import BaseError, { TransfromError } from "../../helpers/baseError.helper.js";
import * as envConfigs from "../env.config.js";
import UserModel from "../../models/User.model.js";

export default function createGoogleOAuthStrategy() {
  return new GoogleStrategy(
    {
      clientID: envConfigs.GOOGLE_CLIENT_ID,
      clientSecret: envConfigs.GOOGLE_CLIENT_SECRET,
      callbackURL: envConfigs.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const googleId = profile?.id;
        const email = profile?.emails?.[0]?.value || null;
        const displayName = profile?.displayName || null;
        const photo = profile?.photos?.[0]?.value || null;

        if (!googleId) {
          throw new BaseError(
            "Authentication",
            400,
            "Google profile id missing",
            true,
          );
        }

        const existingByGoogleId = await UserModel.findOne({ googleId });
        if (existingByGoogleId) return done(null, existingByGoogleId);

        if (!email) {
          throw new BaseError(
            "Authentication",
            400,
            "Google account email missing",
            true,
          );
        }

        // Link by email if possible; otherwise create a new user.
        let user = await UserModel.findOne({ email: email.toLowerCase() });

        if (!user) {
          user = await UserModel.create({
            name: displayName || "Google User",
            email: email.toLowerCase(),
            password: null,
            googleId,
            authProviders: ["google"],
            image: photo,
          });
          return done(null, user);
        }

        // Link Google to existing account (idempotent).
        const providers = new Set(user.authProviders || []);
        providers.add("google");
        user.authProviders = [...providers];
        if (!user.googleId) user.googleId = googleId;
        if (!user.image && photo) user.image = photo;
        if (!user.name && displayName) user.name = displayName;
        await user.save();

        return done(null, user);
      } catch (err) {
        console.log(err);
        const error = new BaseError(
          "Authentication",
          err?.statusCode || 400,
          err?.message || "Google login failed",
          true,
          { ...err },
        );

        return done(new TransfromError(error));
      }
    },
  );
}
