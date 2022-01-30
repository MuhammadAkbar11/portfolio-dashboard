import {
  deleteSkill,
  getProfile,
  postChangePassword,
  postSkill,
  putSkill,
} from "../controllers/user.controller.js";
import { userValidate } from "../helpers/validation.helper.js";
import { ensureAuth } from "../middleware/auth.js";

function UserRoutes(app) {
  app.route("/profile").get(ensureAuth, getProfile);
  app
    .route("/profile/change-password")
    .post(ensureAuth, userValidate("change-pw"), postChangePassword);

  app
    .route("/profile/skills")
    .post(ensureAuth, postSkill)
    .put(ensureAuth, putSkill)
    .delete(ensureAuth, deleteSkill);
}

export default UserRoutes;
