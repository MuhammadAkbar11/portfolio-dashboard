import BaseError from "../../helpers/baseError.helper.js";
import Notification from "../../helpers/notification.helper.js";
import ProjectModel from "../../models/Project.model.js";
import TaskModel from "../../models/Task.model.js";

function RegisterTaskHandlers(io, socket) {
  socket.on("project-tasks", async ({ projectId }, cb) => {
    try {
      const userId = socket.handshake.auth.userId;
      const project = await ProjectModel.findOne({ _id: projectId, user: userId });

      if (project) {
        const projectTasks = await project.getTasks();
        cb(null, projectTasks.tasks);
      } else {
        throw new BaseError("Not Found", 404, "Project not found or unauthorized");
      }
    } catch (error) {
      cb && cb(error);
    }
  });

  socket.on("create-project-task", async (data, cb) => {
    try {
      const userId = socket.handshake.auth.userId;
      const project = await ProjectModel.findOne({ _id: data.projectId, user: userId });

      if (!project) {
        throw new BaseError("Unauthorized", 401, "Unauthorized access to project");
      }

      const newTask = {
        note: data.note,
        status: data.status,
        project: data.projectId,
        user: userId,
      };

      const createdTask = await TaskModel.create(newTask);

      const totalTaskByStatus = await TaskModel.find({
        project: data.projectId,
        status: data.status,
        user: userId,
      }).countDocuments();

      cb && cb(null, { message: "success create task" });
      io.to(data.room).emit("new-project-task", {
        messgae: "New task created",
        task: {
          ...createdTask._doc,
          total: totalTaskByStatus,
        },
      });
      io.to(data.room).emit("update-project-task-count", {
        messgae: "Update count",
        status: data.status,
        count: totalTaskByStatus,
      });

      await new Notification({
        title: "Add new Task",
        icon: "file-plus",
        color: "success",
        content: `Add <b>${createdTask.note}</b> task in <b>${project.title}</b> project tasks`,
        url: `/projects/${project._id}#tasks-container`,
        user: userId,
      });

      io.to(`user:${userId}`).emit("new-notif");
    } catch (error) {
      console.log(error);
      cb && cb(error, null);
    }
  });

  socket.on("delete-project-task", async ({ projectId, taskId }, cb) => {
    try {
      const userId = socket.handshake.auth.userId;
      const project = await ProjectModel.findOne({ _id: projectId, user: userId });
      const task = await TaskModel.findOne({ _id: taskId, user: userId });

      if (!project || !task) {
        throw new BaseError("Not Found", 404, "Project or Task not found or unauthorized", true, {
          responseType: "json",
        });
      }
      const taskStatus = task.status;
      await task.remove();

      const totalTaskByStatus = await TaskModel.find({
        project: projectId,
        status: taskStatus,
        user: userId,
      }).countDocuments();

      io.to(`project:${projectId}`.trim()).emit("update-project-task-count", {
        messgae: "Update count",
        status: taskStatus,
        count: totalTaskByStatus,
      });

      await new Notification({
        title: "Delete a Task",
        icon: "file-minus",
        color: "danger",
        content: `Deleted ${task.note} task on <b>${project.title}</b> project tasks`,
        url: `/projects/${project._id}#tasks-container`,
        user: userId,
      });
      io.to(`user:${userId}`).emit("new-notif");
      cb(null, { message: "Delete Task" });
    } catch (error) {
      console.log(error);
      cb && cb(error);
    }
  });

  socket.on("edit-project-task", async (request, cb) => {
    const { note, status, projectId, room, taskId } = request;
    try {
      const userId = socket.handshake.auth.userId;
      const project = await ProjectModel.findOne({ _id: projectId, user: userId });
      const task = await TaskModel.findOne({ _id: taskId, user: userId });

      if (!project || !task) {
        throw new BaseError("Not Found", 404, "Project or Task not found or unauthorized", true, {
          responseType: "json",
        });
      }
      const oldStatus = task.status;

      if (!task) {
        throw new BaseError("Not Found", 400, "Task Not Found", true, {
          responseType: "json",
        });
      }

      task.note = note;
      task.status = status;

      const updateTask = await task.save();

      io.to(room).emit("updated-project-task", {
        messgae: "Updated Project Task",
        task: updateTask,
      });

      if (updateTask.status != oldStatus) {
        const tasksByTaskOldStatus = await TaskModel.find({
          project: projectId,
          status: oldStatus,
          user: userId,
        });

        const tasksByTaskNewStatus = await TaskModel.find({
          project: projectId,
          status: updateTask.status,
          user: userId,
        });

        const updatedTaskIndex = tasksByTaskNewStatus.findIndex(
          x => x.id == updateTask._id
        );

        const beforeTask = tasksByTaskNewStatus.find(
          (item, index) => index === updatedTaskIndex - 1
        );
        const nextTask = tasksByTaskNewStatus.find(
          (item, index) => index === updatedTaskIndex + 1
        );

        io.to(room).emit("update-project-task-count", {
          messgae: "Update count",
          status: oldStatus,
          count: tasksByTaskOldStatus.length,
        });
        io.to(room).emit("update-project-task-count", {
          messgae: "Update count",
          status: updateTask.status,
          count: tasksByTaskNewStatus.length,
        });
        io.to(room).emit("moved-project-task", {
          messgae: "Moved Project Task",
          from: oldStatus,
          to: updateTask.status,
          beforeTask,
          nextTask,
          task: updateTask,
        });

        await new Notification({
          title: "Update Project progress",
          icon: "activity",
          color: "primary",
          content: `Moving <b>${
            task.note
          }</b> task from <b class="text-capitalize">${oldStatus.toLocaleLowerCase()} Board</b> to <b class="text-capitalize">${updateTask.status.toLocaleLowerCase()} Board</b> on <b>${
            project.title
          }</b> project tasks`,
          url: `/projects/${project._id}#tasks-container`,
          user: userId,
        });
        io.to(`user:${userId}`).emit("new-notif");
      }

      cb(null, { message: "Update Task", isMoved: false });
    } catch (error) {
      console.log(error);
      cb && cb(error);
    }
  });
}

export default RegisterTaskHandlers;
