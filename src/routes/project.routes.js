import { getProjects } from "../controllers/project.controller.js";
import { ensureAuth } from "../middleware/auth.js";

function ProjectRoutes(app) {
  app.route("/projects").get(ensureAuth, getProjects);
}

export default ProjectRoutes;
