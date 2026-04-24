import {
  getLocalAuthCallback,
  getSignIn,
  getSignUp,
  postSignIn,
  postLogout,
  postSignUp,
} from "../controllers/auth.controller.js";
import { userValidate } from "../helpers/validation.helper.js";
import { ensureGuest } from "../middleware/auth.js";
import {
  passportAuthGoogle,
  passportAuthGoogleCallback,
  passportAuthSignIn,
} from "../middleware/passportAuth.js";
import * as envConfigs from "../config/env.config.js";

function AuthRoutes(app) {
  app
    .route("/auth")
    .get(ensureGuest, getSignIn)
    .post(
      userValidate("signin"),
      postSignIn,
      passportAuthSignIn,
      getLocalAuthCallback,
    );

  // Google OAuth
  app.get(
    "/auth/google",
    ensureGuest,
    (req, res, next) => {
      if (!envConfigs.GOOGLE_CLIENT_ID || !envConfigs.GOOGLE_CLIENT_SECRET) {
        req.flash("flashdata", {
          type: "warning",
          message: "Google login is not configured",
        });
        return res.redirect("/auth");
      }
      return next();
    },
    passportAuthGoogle,
  );
  app.get(
    "/auth/google/callback",
    ensureGuest,
    passportAuthGoogleCallback,
    getLocalAuthCallback,
  );

  // app
  //   .route("/auth/signup")
  //   .get(ensureGuest, getSignUp)
  //   .post(
  //     userValidate("signup"),
  //     postSignUp,
  //     passportAuthSignIn,
  //     getLocalAuthCallback
  //   );

  app.post("/auth/logout", postLogout);
}

export default AuthRoutes;
