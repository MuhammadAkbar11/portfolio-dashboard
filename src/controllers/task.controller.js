import { validationResult } from "express-validator";
import BaseError, { ValidationError } from "../helpers/baseError.helper.js";
import TaskModel from "../models/Task.Model.js";

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

  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array(), _render, {
        title: "Error",
        values: req.body,
        taskActionError: true,
      });

      req.flash("errors", errValidate);
      res.redirect(`${redirect}?task_action_error=true`);
      return;
    }

    await TaskModel.create({ note, project: projectId, status });
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

  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array(), _render, {
        values: req.body,
        taskActionError: true,
      });

      req.flash("errors", errValidate);
      res.redirect(`${redirect}?task_action_error=true`);
      return;
    }

    const task = await TaskModel.findById(id);

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
    const task = await TaskModel.findById(id);

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
