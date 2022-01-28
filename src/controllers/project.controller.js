import BaseError, { TransfromError } from "../helpers/baseError.helper.js";
import Notification from "../helpers/notification.helper.js";
import ProjectModel from "../models/Project.model.js";

import deleteFile from "../utils/index.js";

export const getProjects = async (req, res, next) => {
  try {
    const getProjects = await ProjectModel.find({});

    const listProjects = await Promise.all(
      getProjects.map(async pro => {
        const { progress } = await pro.getTasks();
        pro.progress = progress;

        return pro;
      })
    );

    const flashdata = req.flash("flashdata");

    res.render("project/list-project", {
      title: "Projects",
      path: "/projects",
      flashdata: flashdata,
      projects: listProjects,
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
    title: "New project",
    description: "Project description",
    github: "https://github.com/MuhammadAkbar11/",
    demo: "",
    isSelected: false,
    isHidden: false,
    stacks: ["stack1", "stack2", "stack3"],
    image: "/img/photos/unsplash-1.jpg",
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
      message: "Success generate a project",
    });
    await new Notification({
      title: "Created Project",
      icon: "plus-circle",
      color: "success",
      content: `Created a new project`,
      url: "/projects/" + project._id,
    });
    res.redirect("/projects/" + project._id + "/edit");
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to create project",
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
    description,
    isSelected,
    isHidden,
    stacks,
  } = req.body;

  const id = req.params.id;
  try {
    const project = await ProjectModel.findById(id);

    if (!project) {
      req.flash("flashdata", {
        type: "danger",
        message: "Failed to update project",
      });
      res.redirect(`/projects${id}/edit`);
      return;
    }

    const oldProjectImage = project.image;

    if (req.fileimg.data) {
      const filename = req.fileimg.data?.filename;
      if ("/img/photos/unsplash-1.jpg" != oldProjectImage) {
        deleteFile("uploads" + oldProjectImage);
      }
      project.image = `/project/${filename}`;
    }
    console.log(isHidden);
    project.title = title;
    project.status = status;
    project.isSelected = isSelected == "on" ? true : false;
    project.isHidden = isHidden == "off" ? true : false;
    project.stacks = stacks.split(",");
    project.demo = demo;
    project.github = github;
    project.description = description;

    await project.save();

    await new Notification({
      title: "Updated Project",
      icon: "edit",
      color: "primary",
      content: `Updated <b>${project.title}</b> project`,
      url: "/projects",
    });

    req.flash("flashdata", {
      type: "success",
      message: "Update project success!",
    });
    res.redirect(`/projects`);
  } catch (error) {
    console.log(error);
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to update project",
    });
    res.redirect(`/projects`);
  }
};

export const deleteProject = async (req, res, next) => {
  const id = req.params.id;

  try {
    const project = await ProjectModel.findById(id);

    await project.remove();

    req.flash("flashdata", {
      type: "success",
      message: "Delete project success!",
    });
    res.redirect(`/projects`);

    await new Notification({
      title: "Deleted A Project",
      icon: "trash-2",
      color: "danger",
      content: `Deleted <b>${project.title}</b> project`,
      url: "/projects",
    });
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to delete project",
    });
    res.redirect(`/projects`);
  }
};

export const getEditProject = async (req, res, next) => {
  const id = req.params.id;
  try {
    const flashdata = req.flash("flashdata");
    const project = await ProjectModel.findById(id);

    res.render("project/form-project", {
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

export const getProjectDetails = async (req, res, next) => {
  const id = req.params.id;

  try {
    const flashdata = req.flash("flashdata");
    const flashError = req.flash("errors");
    const project = await ProjectModel.findById(id);

    if (!project) {
      throw new BaseError("Not Found", 404, "Project not found", true, {
        errorView: "errors/404",
      });
    }

    const { progress } = await project.getTasks();

    res.render("project/details", {
      title: project.title,
      path: "/projects",
      flashdata: flashdata,
      project: {
        ...project._doc,
        progress,
      },
      taskActionError: Boolean(req.query.task_action_error),
      flashError: flashError,
      errors: null,
      values: null,
    });
  } catch (error) {
    const trError = new TransfromError(error);

    next(trError);
  }
};
