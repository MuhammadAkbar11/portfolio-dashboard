import { getProjectsApi } from "../../controllers/api/project.api.controller.js";
import validateApiKey from "../../middleware/validateApiKey.js";

function ProjectApiRoutes(app, prefix) {
  app.route(`${prefix}/projects`).get(validateApiKey, getProjectsApi);
}

export default ProjectApiRoutes;
