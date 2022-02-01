import { v4 as uuidv4 } from "uuid";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../helpers/baseError.helper.js";
import UserModel from "../models/User.model.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import httpStatusCodes from "../utils/httpStatusCode.js";
import { sendEmail } from "../helpers/email.helper.js";
import { EMAIL } from "../config/env.config.js";

const generateApiKey = uuidv4;

export const getProfile = (req, res) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors");
    console.log(errors);
    res.render("profile", {
      title: "Profile",
      path: "/profile",
      flashdata,
      errors: errors,
      values: null,
    });
  } catch (error) {
    error.responseType = "page";
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

export const postChangePassword = async (req, res, next) => {
  try {
    const validate = validationResult(req);

    if (!validate.isEmpty()) {
      const errValidate = new ValidationError(validate.array(), "profile", {
        title: "Profile",
        path: "/profile",
      });

      throw errValidate;
    }

    const user = await UserModel.findById(req.user._id);

    const passwordMatch = await user.matchPassword(req.body.oldPassword);

    if (!passwordMatch) {
      throw new BaseError(
        "BadRequest",
        httpStatusCodes.BAD_REQUEST,
        "Current Password is wrong",
        true
      );
    }

    user.password = req.body.newPassword;

    await user.save();

    req.flash("flashdata", {
      type: "success",
      message: "Successfully change password",
    });
    res.redirect("/profile");
    // user.pas
  } catch (error) {
    req.flash("errors", {
      section: "password",
      message: error.message,
      errors: error,
      values: req.body,
    });
    res.redirect("/profile?#user-card-password");
  }
};

export const postRequestApiKey = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (user.apiKey) {
      req.flash("flashdata", {
        type: "warning",
        message: "You already have ApiKey",
      });
      res.redirect("/profile?tab=apikey");
      return;
    }

    const apiKey = generateApiKey();
    const hashedApiKey = await user.hashApiKey(apiKey);
    user.apiKey = hashedApiKey;
    await user.save();

    await sendEmail({
      from: EMAIL,
      to: req.user.email,
      subject: "Akbar Portfolio Dashboard - Request ApiKey",
      text: `Hello ${req.user.name} <br> Here is your ApiKey : ${hashedApiKey}`,
    });
    req.flash("flashdata", {
      type: "success",
      message: "Successfully generate Api Key",
    });
    res.redirect("/profile?tab=apikey");
    // const savedUser = await user.save();
  } catch (error) {
    console.log(error);
    req.flash("flashdata", {
      type: "danger",
      message: "Failed to generate Api Key",
    });
    res.redirect("/profile?tab=apikey");
  }
};
