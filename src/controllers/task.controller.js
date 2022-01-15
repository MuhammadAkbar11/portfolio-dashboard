import BaseError, { TransfromError } from "../helpers/baseError.helper.js";
import TaskModel from "../models/Task.Model.js";

export const postProjectTask = async (req, res) => {
  const { name } = req.body;
  const projectID = req.params.projectID;
  const successRedirect = req.query.successRedirect || "/projects/" + projectID;
  const errorRedirect = req.query.errorRedirect || "/projects/" + projectID;

  try {
    await TaskModel.create({ name });

    res.redirect(successRedirect);
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to create project",
    });
    res.redirect(errorRedirect);
  }
};
