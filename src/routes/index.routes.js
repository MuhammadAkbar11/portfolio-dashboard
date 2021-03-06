import { getIndex } from "../controllers/app.controller.js";
import { ensureAuth } from "../middleware/auth.js";
import APIsRoutes from "./api/apis.routes.js";
import AuthRoutes from "./auth.routes.js";
import ProjectRoutes from "./project.routes.js";
import SkillRoutes from "./skill.routes.js";
import UserRoutes from "./user.routes.js";

function MainRoutes(app) {
  app.get("/", ensureAuth, getIndex);

  // auth Routes
  AuthRoutes(app);

  // User Routes
  UserRoutes(app);

  // Project Routes
  ProjectRoutes(app);

  // Skill
  SkillRoutes(app);

  // Api main routes
  APIsRoutes(app);
}

export default MainRoutes;
