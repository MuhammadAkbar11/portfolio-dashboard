import { TransfromError } from "../../helpers/baseError.helper.js";

import SkillModel from "../../models/Skill.model.js";

export const getSkillsApi = async (req, res, next) => {
  try {
    const filter = {};
    if (!req.isUsingMainKey && req.user) {
      filter.user = req.user._id;
    }

    const listSkill = await SkillModel.find(filter)
      .select("name level order")
      .sort([["order", 1]]);

    res.json({
      success: true,
      message: "Skills retrieved successfully",
      data: listSkill,
      total: listSkill.length,
    });
  } catch (error) {
    error.responseType = "json";
    const trError = new TransfromError(error);

    next(trError);
  }
};
