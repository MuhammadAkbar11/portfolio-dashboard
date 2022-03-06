import { TransfromError } from "../../helpers/baseError.helper.js";
import ProjectModel from "../../models/Project.model.js";

export const getProjectsApi = async (req, res, next) => {
  try {
    const getProjects = await ProjectModel.find({ isHidden: false }).select(
      "-isHidden"
    );

    const listProjects = await Promise.all(
      getProjects.map(async pro => {
        const { progress } = await pro.getTasks();
        pro.progress = progress;
        return pro;
      })
    );

    res.json({
      message: "Success to get your projects list",
      projects: listProjects,
      total: listProjects.length,
    });
  } catch (error) {
    error.responseType = "json";
    const trError = new TransfromError(error);

    next(trError);
  }
};
