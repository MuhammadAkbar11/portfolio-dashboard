import {
  deleteProject,
  getEditProject,
  getProjectDetails,
  getProjects,
  postProjects,
  putProject,
} from "../controllers/project.controller.js";
import { ensureAuth } from "../middleware/auth.js";
import { uploadProjectImage } from "../middleware/upload.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { projectSchema } from "../validators/index.js";

function ProjectRoutes(app) {
  app.route("/projects/:id/edit").get(ensureAuth, getEditProject);

  app
    .route("/projects/:id")
    .get(ensureAuth, getProjectDetails)
    .put(ensureAuth, uploadProjectImage, validateRequest(projectSchema), putProject)
    .delete(ensureAuth, deleteProject);
  app
    .route("/projects")
    .get(ensureAuth, getProjects)
    .post(ensureAuth, postProjects);
}

export default ProjectRoutes;
