import { TransfromError } from "../../helpers/baseError.helper.js";

import SkillModel from "../../models/Skill.model.js";

export const getSkillsApi = async (req, res, next) => {
  try {
    const listSkill = await SkillModel.find({})
      .select("-__v -createdAt -updatedAt")
      .sort([["order", 1]]);

    res.json({
      message: "Success to get your skills list",
      skills: listSkill,
      total: listSkill.length,
    });
  } catch (error) {
    error.responseType = "json";
    const trError = new TransfromError(error);

    next(trError);
  }
};
