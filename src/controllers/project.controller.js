import BaseError, { TransfromError } from "../helpers/baseError.helper.js";
import ProjectModel from "../models/Project.model.js";

export const getProjects = async (req, res, next) => {
  try {
    const projects = await ProjectModel.find({});

    const flashdata = req.flash("flashdata");

    res.render("project/list-project", {
      title: "Projects",
      path: "/projects",
      flashdata: flashdata,
      projects,
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
    stacks: ["stack1", "stack2"],
    image: "/img/photos/unsplash-1",
  };
  try {
    const project = await ProjectModel.create(newProject);

    if (!project) {
      throw new BaseError("Not Found", 404, "Project not found", true, {
        errorView: "errors/404",
        renderData: { title: 404 },
      });
    }

    req.flash("flashdata", {
      type: "success",
      message: "Success adding new product",
    });
    res.redirect("/projects/" + project._id + "/edit");
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to create product",
    });
    res.redirect("/projects");
  }
};

export const putProject = async (req, res, next) => {
  const {
    title,
    status,
    demo,
    github,
    progress,
    description,
    isSelected,
    stacks,
  } = req.body;
  const id = req.params.id;
  try {
    const project = await ProjectModel.findById(id);

    if (!project) {
      req.flash("flashdata", {
        type: "danger",
        message: "Failed to update product",
      });
      res.redirect(`/projects${id}/edit`);
      return;
    }

    project.title = title;
    project.status = status;
    project.isSelected = isSelected == "on" ? true : false;
    project.stacks = stacks.split(",");
    project.demo = demo;
    project.github = github;
    project.description = description;
    project.progress = +progress;

    await project.save();

    req.flash("flashdata", {
      type: "success",
      message: "Update project success!",
    });
    res.redirect(`/projects`);
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to update product",
    });
    res.redirect(`/projects`);
  }
};

export const getEditProject = async (req, res, next) => {
  const id = req.params.id;
  try {
    const flashdata = req.flash("flashdata");
    const project = await ProjectModel.findById(id);

    project.stacks = res.render("project/form-project", {
      title: "Edit Project",
      path: "/projects",
      flashdata: flashdata,
      project: {
        ...project._doc,
        stacks: project.stacks.join(","),
      },
      errors: null,
      values: null,
    });
  } catch (error) {
    const trError = new TransfromError(error);

    next(trError);
  }
};
