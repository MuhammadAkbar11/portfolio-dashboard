import { TransfromError } from "../helpers/baseError.helper.js";

export const getProjects = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    res.render("project/list-project", {
      title: "Projects",
      path: "/projects",
      flashdata: flashdata,
      errors: null,
      values: null,
    });
  } catch (error) {
    const trError = new TransfromError(error);

    next(trError);
  }
};
