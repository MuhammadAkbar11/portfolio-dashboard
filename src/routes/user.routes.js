import {
  getProfile,
  postChangePassword,
  postRequestApiKey,
  postUpdateProfile,
  postUpdateProfileImage,
} from "../controllers/user.controller.js";
import { ensureAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { changePasswordSchema } from "../validators/index.js";
import { uploadProfileImage } from "../middleware/upload.js";

function UserRoutes(app) {
  app.post("/profile/requestApiKey", ensureAuth, postRequestApiKey);
  app.post(
    "/profile/change-password",
    ensureAuth,
    validateRequest(changePasswordSchema),
    postChangePassword,
  );
  app.post("/profile/update", ensureAuth, postUpdateProfile);
  app.post(
    "/profile/update-image",
    ensureAuth,
    uploadProfileImage,
    postUpdateProfileImage,
  );

  app.route("/profile").get(ensureAuth, getProfile);
}

export default UserRoutes;
