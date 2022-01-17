import { validationResult } from "express-validator";
import { ValidationError } from "../helpers/baseError.helper.js";
import TaskModel from "../models/Task.Model.js";

export const postProjectTask = async (req, res) => {
  const { note, projectId, status, _render } = req.body;
  const successRedirect = req.query.successRedirect || "/projects/" + projectId;
  const errorRedirect = req.query.errorRedirect || "/projects/" + projectId;

  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array(), _render, {
        title: "Error",
        values: req.body,
        taskActionError: true,
      });

      req.flash("errors", errValidate);
      res.redirect(`${errorRedirect}?task_action_error=true`);
      return;
    }

    await TaskModel.create({ note, project: projectId, status });
    req.flash("flashdata", {
      type: "success",
      message: "Success add a task",
    });
    res.redirect(successRedirect);
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to create project",
    });
    res.redirect(`${errorRedirect}?task_action_error=true`);
  }
};
