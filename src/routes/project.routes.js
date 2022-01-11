import {
  getEditProject,
  getProjects,
  postProjects,
  putProject,
} from "../controllers/project.controller.js";
import { ensureAuth } from "../middleware/auth.js";

function ProjectRoutes(app) {
  app.route("/projects/:id/edit").get(ensureAuth, getEditProject);

  app.route("/projects/:id").put(ensureAuth, putProject);
  app
    .route("/projects")
    .get(ensureAuth, getProjects)
    .post(ensureAuth, postProjects);
}

export default ProjectRoutes;
