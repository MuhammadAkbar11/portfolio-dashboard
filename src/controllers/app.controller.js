import ProjectModel from "../models/Project.model.js";
import TaskModel from "../models/Task.model.js";
import SkillModel from "../models/Skill.model.js";
import { TASK_STATUS_ENUM } from "../utils/constants.js";

export const getLanding = (req, res) => {
  res.render("landing", {
    title: "Portfolio Management",
    path: "/",
  });
};

export const getIndex = async (req, res, next) => {
  try {
    const totalProjects = await ProjectModel.countDocuments({ user: req.user._id });
    const totalSkills = await SkillModel.countDocuments({ user: req.user._id });
    const totalTasks = await TaskModel.countDocuments({ user: req.user._id });
    const completedTasks = await TaskModel.countDocuments({ user: req.user._id, status: TASK_STATUS_ENUM.DONE });

    const recentProjects = await ProjectModel.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(5);

    const pendingTasks = await TaskModel.find({ user: req.user._id, status: { $ne: TASK_STATUS_ENUM.DONE } })
      .populate("project")
      .sort({ updatedAt: -1 })
      .limit(5);

    const doneTasks = await TaskModel.find({ user: req.user._id, status: TASK_STATUS_ENUM.DONE })
      .populate("project")
      .sort({ updatedAt: -1 })
      .limit(5);

    const skills = await SkillModel.find({ user: req.user._id }).sort({ order: 1 });

    res.render("index", {
      title: "Dashboard",
      path: "/dashboard",
      stats: {
        totalProjects,
        totalSkills,
        totalTasks,
        completedTasks,
      },
      recentProjects,
      pendingTasks,
      doneTasks,
      skills,
    });
  } catch (error) {
    next(error);
  }
};
