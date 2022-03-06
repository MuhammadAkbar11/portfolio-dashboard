import BaseError from "../helpers/baseError.helper.js";
import SkillModel from "../models/Skill.model.js";

export const postSkill = async (req, res, next) => {
  const { skillName } = req.body;
  try {
    const skillsLength = await SkillModel.countDocuments();

    await SkillModel.create({
      name: skillName,
      order: Number(skillsLength + 1),
    });

    req.flash("flashdata", {
      type: "success",
      message: "Successfully add a new skill",
    });
    res.redirect("/profile?tab=skill");
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to create skill",
    });
    res.redirect("/profile?tab=skill");
  }
};

export const deleteSkill = async (req, res, next) => {
  const { skillId } = req.body;
  try {
    await SkillModel.findByIdAndDelete(skillId);
    req.flash("flashdata", {
      type: "success",
      message: "Successfully delete skill",
    });
    res.redirect("/profile?tab=skill");
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to delete skill",
    });
    res.redirect("/profile?tab=skill");
  }
};

export const putSkill = async (req, res, next) => {
  const { skillName, order, skillId } = req.body;

  try {
    const skill = await SkillModel.findById(skillId);

    if (!skill) {
      throw new BaseError(
        "NotFound",
        400,
        "Can't update skill because skill not found",
        true,
        {}
      );
    }

    const newOrder = order;
    const oldOrder = skill.order;

    if (skill.order !== order) {
      const getSkillByOrder = await SkillModel.findOne({ order: order });
      getSkillByOrder.order = oldOrder;
      await getSkillByOrder.save();
      skill.order = newOrder;
    }

    skill.name = skillName;
    await skill.save();

    req.flash("flashdata", {
      type: "success",
      message: "Successfully update skill",
    });
    res.redirect("/profile?tab=skill");
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to update skill",
    });
    res.redirect("/profile?tab=skill");
  }
};
