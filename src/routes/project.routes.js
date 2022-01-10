import {
  getEditProject,
  getProjects,
  postProjects,
} from "../controllers/project.controller.js";
import { ensureAuth } from "../middleware/auth.js";

function ProjectRoutes(app) {
  app
    .route("/projects")
    .get(ensureAuth, getProjects)
    .post(ensureAuth, postProjects);
  app.route("/edit-project/:id").get(ensureAuth, getEditProject);
}

export default ProjectRoutes;
