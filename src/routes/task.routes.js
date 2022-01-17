import { postProjectTask } from "../controllers/task.controller.js";
import { taskValidate } from "../helpers/validation.helper.js";

import { ensureAuth } from "../middleware/auth.js";

function TaskRoutes(app) {
  app.route("/tasks").post(ensureAuth, taskValidate("create"), postProjectTask);
}

export default TaskRoutes;
