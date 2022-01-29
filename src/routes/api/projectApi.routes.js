import { getProjectsApi } from "../../controllers/api/project.api.controller.js";

function ProjectApiRoutes(app, prefix) {
  app.route(`${prefix}/projects`).get(getProjectsApi);
}

export default ProjectApiRoutes;
