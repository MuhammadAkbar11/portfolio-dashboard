import ProjectModel from "../models/Project.model.js";

function TaskSocker(socket) {
  socket.on("project-tasks", async ({ projectId }, cb) => {
    try {
      const project = await ProjectModel.findById(projectId);
      const projectTasks = await project.getTasks();
      cb(projectTasks.tasks, null);
    } catch (error) {
      cb && cb(null, error);
    }
  });
}

export default TaskSocker;
