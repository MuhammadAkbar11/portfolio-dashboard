import { getProfile } from "../controllers/user.controller.js";
import { ensureAuth } from "../middleware/auth.js";

function UserRoutes(app) {
  app.route("/profile").get(ensureAuth, getProfile);
}

export default UserRoutes;
