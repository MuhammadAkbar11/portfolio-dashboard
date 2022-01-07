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
import { passportAuthSignIn } from "../middleware/passportAuth.js";

function AuthRoutes(app) {
  app
    .route("/auth")
    .get(ensureGuest, getSignIn)
    .post(
      userValidate("signin"),
      postSignIn,
      passportAuthSignIn,
      getLocalAuthCallback
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
