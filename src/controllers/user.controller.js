import { TransfromError } from "../helpers/baseError.helper.js";
import UserModel from "../models/User.model.js";
import mongoose from "mongoose";

export const getProfile = (req, res) => {
  try {
    const flashdata = req.flash("flashdata");
    res.render("profile", {
      title: "Profile",
      path: "/profile",
      flashdata,
    });
  } catch (error) {
    const transError = new TransfromError(error);
    next(transError);
  }
};

export const postSkill = async (req, res, next) => {
  const { skillName } = req.body;
  const userSkills = req.user.skills;
  try {
    const tes = await UserModel.updateOne(
      { _id: req.user._id },
      {
        $push: {
          skills: { name: skillName, order: userSkills.length + 1 },
        },
      }
    );
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
    await UserModel.updateOne(
      { _id: req.user._id },
      {
        $pull: {
          skills: { _id: skillId },
        },
      }
    );
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
  const { skillName, skillId } = req.body;
  try {
    const query = {
      _id: req.user._id,
      "skills._id": mongoose.Types.ObjectId(skillId),
    };
    const updateDocument = {
      $set: {
        "skills.$.name": skillName,
      },
    };
    await UserModel.updateOne(query, updateDocument);

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
