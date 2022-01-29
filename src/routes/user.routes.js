import {
  deleteSkill,
  getProfile,
  postSkill,
  putSkill,
} from "../controllers/user.controller.js";
import { ensureAuth } from "../middleware/auth.js";

function UserRoutes(app) {
  app.route("/profile").get(ensureAuth, getProfile);
  app
    .route("/profile/skills")
    .post(ensureAuth, postSkill)
    .put(ensureAuth, putSkill)
    .delete(ensureAuth, deleteSkill);
}

export default UserRoutes;
