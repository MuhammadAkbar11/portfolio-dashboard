import ProjectModel from "../../models/Project.model.js";
import TaskModel from "../../models/Task.Model.js";

function RegisterTaskHandlers(io, socket) {
  socket.on("project-tasks", async ({ projectId }, cb) => {
    try {
      const project = await ProjectModel.findById(projectId);
      const projectTasks = await project.getTasks();

      cb(null, projectTasks.tasks);
    } catch (error) {
      cb && cb(error);
    }
  });

  socket.on("create-project-task", async (data, cb) => {
    try {
      const newTask = {
        note: data.note,
        status: data.status,
        project: data.projectId,
      };

      const createdTask = await TaskModel.create(newTask);

      const totalTaskByStatus = await TaskModel.find({
        project: data.projectId,
        status: data.status,
      }).countDocuments();

      cb && cb(null, { message: "success create task" });
      io.to(data.room).emit("new-project-task", {
        messgae: "New task created",
        task: {
          ...createdTask._doc,
          total: totalTaskByStatus,
        },
      });
    } catch (error) {
      console.log(error);
      cb && cb(error, null);
    }
  });
}

export default RegisterTaskHandlers;
