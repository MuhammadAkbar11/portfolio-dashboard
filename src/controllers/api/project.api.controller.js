import { TransfromError } from "../../helpers/baseError.helper.js";
import ProjectModel from "../../models/Project.model.js";

export const getProjectsApi = async (req, res, next) => {
  try {
    const filter = { isHidden: false };
    if (!req.isUsingMainKey && req.user) {
      filter.user = req.user._id;
    }

    const getProjects = await ProjectModel.find(filter).select(
      "title description stacks demo github image year isSelected"
    );

    const listProjects = await Promise.all(
      getProjects.map(async pro => {
        const projectObj = pro.toObject();
        const { progress } = await pro.getTasks();
        projectObj.progress = progress;
        
        // Ensure image URL is absolute
        if (projectObj.image && !projectObj.image.startsWith('http')) {
          const baseUrl = `${req.protocol}://${req.headers.host}`;
          projectObj.image = `${baseUrl}/${projectObj.image.replace(/^\/+/, '')}`;
        }
        
        return projectObj;
      })
    );

    res.json({
      success: true,
      message: "Projects retrieved successfully",
      data: listProjects,
      total: listProjects.length,
    });
  } catch (error) {
    error.responseType = "json";
    const trError = new TransfromError(error);

    next(trError);
  }
};
