import { getDummy, postDummy } from "../../controllers/api/dumb.controller.js";
import { getProjectsApi } from "../../controllers/api/project.api.controller.js";
import { PREFIX_VERSION } from "../../helpers/version.helper.js";
import validateApiKey from "../../middleware/validateApiKey.js";

function APIsRoutes(app) {
  app.route(`${PREFIX_VERSION}`).get((req, res) => {
    res.send({ message: "Hello" });
  });

  app.route(`${PREFIX_VERSION}/dummies`).get(getDummy).post(postDummy);

  app.route(`${PREFIX_VERSION}/projects`).get(validateApiKey, getProjectsApi);
}

export default APIsRoutes;
