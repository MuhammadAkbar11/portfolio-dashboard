import { postProjectTask } from "../controllers/task.controller.js";

import { ensureAuth } from "../middleware/auth.js";

function TaskRoutes(app) {
  app.route("/tasks").post(ensureAuth, postProjectTask);
}

export default TaskRoutes;
