import {
  getProfile,
  postChangePassword,
  postRequestApiKey,
} from "../controllers/user.controller.js";
import { userValidate } from "../helpers/validation.helper.js";
import { ensureAuth } from "../middleware/auth.js";

function UserRoutes(app) {
  app.post("/profile/requestApiKey", ensureAuth, postRequestApiKey);
  app.post(
    "/profile/change-password",
    ensureAuth,
    userValidate("change-pw"),
    postChangePassword
  );

  app.route("/profile").get(ensureAuth, getProfile);
}

export default UserRoutes;
