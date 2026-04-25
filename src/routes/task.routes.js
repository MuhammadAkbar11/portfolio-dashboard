import {
  deleteProjectTask,
  getTasks,
  postProjectTask,
  putProjectTask,
} from "../controllers/task.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { taskSchema } from "../validators/index.js";
import { ensureAuth } from "../middleware/auth.js";

function TaskRoutes(app) {
  app
    .route("/tasks/:id")
    .put(ensureAuth, validateRequest(taskSchema), putProjectTask)
    .delete(ensureAuth, deleteProjectTask);
  app
    .route("/tasks")
    .get(ensureAuth, getTasks)
    .post(ensureAuth, validateRequest(taskSchema), postProjectTask);
}

export default TaskRoutes;
