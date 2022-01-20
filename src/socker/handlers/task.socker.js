import BaseError from "../../helpers/baseError.helper.js";
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

  socket.on("delete-project-task", async ({ projectId, taskId }, cb) => {
    try {
      const task = await TaskModel.findById(taskId);
      const taskStatus = task.status;

      if (!task) {
        throw new BaseError("Not Found", 400, "Task Not Found", true, {
          responseType: "json",
        });
      }
      await task.remove();

      const totalTaskByStatus = await TaskModel.find({
        project: projectId,
        status: taskStatus,
      }).countDocuments();

      console.log(totalTaskByStatus);

      cb(null, { message: "Delete Task" });
    } catch (error) {
      console.log(error);
      cb && cb(error);
    }
  });
}

export default RegisterTaskHandlers;
