import BaseError from "../helpers/baseError.helper.js";
import TaskModel from "../models/Task.model.js";
import ProjectModel from "../models/Project.model.js";

export const getTasks = async (req, res) => {
  try {
    res.json({
      user: req.user,
      message: "Task List",
    });
  } catch (error) {
    console.log(error);
  }
};

export const postProjectTask = async (req, res) => {
  const { note, projectId, status, _render } = req.body;
  const redirect =
    req.query.redirect || `/projects/${projectId}#tasks-container`;

  try {    const project = await ProjectModel.findOne({ _id: projectId, user: req.user._id });

    if (!project) {
      throw new BaseError("Unauthorized", 401, "You don't have permission to add tasks to this project", true, {
        errorView: "errors/401",
        renderData: { title: 401 },
      });
    }

    await TaskModel.create({
      note,
      project: projectId,
      status,
      user: req.user._id,
    });
    req.flash("flashdata", {
      type: "success",
      message: " successfully create a task",
    });
    res.redirect(`${redirect}`);
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to create task",
    });
    res.redirect(`${redirect}?task_action_error=true`);
  }
};

export const putProjectTask = async (req, res) => {
  const id = req.params.id;
  const { note, projectId, status, _render } = req.body;
  const redirect =
    req.query.redirect || `/projects/${projectId}#tasks-container`;

  try {    const task = await TaskModel.findOne({ _id: id, user: req.user._id });

    if (!task) {
      throw new BaseError("Not Found", 400, "Task Not Found", true, {});
    }
    task.note = note;
    task.status = status;

    await task.save();

    req.flash("flashdata", {
      type: "success",
      message: "Task successfully updated",
    });
    res.redirect(`${redirect}`);
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to update task",
    });
    res.redirect(`${redirect}?task_action_error=true`);
  }
};

export const deleteProjectTask = async (req, res) => {
  const id = req.params.id;
  const projectId = req.body.projectId;
  const redirect =
    req.query.redirect || `/projects/${projectId}#tasks-container`;
  try {
    const task = await TaskModel.findOne({ _id: id, user: req.user._id });

    if (!task) {
      throw new BaseError("Not Found", 400, "Task Not Found", true, {});
    }

    await task.remove();

    req.flash("flashdata", {
      type: "success",
      message: "Successfully delete task",
    });
    res.redirect(redirect);
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to delete task",
    });
    res.redirect(redirect);
  }
};
