import { TransfromError } from "../helpers/baseError.helper.js";
import ProjectModel from "../models/Project.model.js";

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

export const postProjects = async (req, res, next) => {
  const newProject = {
    title: "new project",
    description: "Project description",
    status: "NEW",
    progress: 0,
    github: "https://github.com/MuhammadAkbar11/",
    demo: "",
    isSelected: false,
    stacks: [],
    image: "/img/photos/unsplash-1",
  };
  try {
    const project = await ProjectModel.create(newProject);

    req.flash("flashdata", {
      type: "success",
      message: "Success adding new product",
    });
    res.redirect("/edit-project/" + project._id);
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to create product",
    });
    res.redirect("/projects");
  }
};

export const getEditProject = async (req, res, next) => {
  try {
    const flashdata = req.flash("flashdata");
    res.render("project/form-project", {
      title: "Create new Project",
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
