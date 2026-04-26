import path from "path";
import fs from "fs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import BaseError, { TransfromError } from "../helpers/baseError.helper.js";
import UserModel from "../models/User.model.js";
import httpStatusCodes from "../utils/httpStatusCode.js";
import deleteFile from "../utils/index.js";
import { sendEmail } from "../helpers/email.helper.js";
import { EMAIL } from "../config/env.config.js";
import { UPLOADS_NAME } from "../utils/constants.js";

const generateApiKey = uuidv4;

export const getProfile = async (req, res) => {
  try {
    const flashdata = req.flash("flashdata");
    const errors = req.flash("errors");

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

// export const postSkill = async (req, res, next) => {
//   const { skillName } = req.body;
//   const userSkills = req.user.skills;
//   try {
//     const tes = await UserModel.updateOne(
//       { _id: req.user._id },
//       {
//         $push: {
//           skills: { name: skillName, order: userSkills.length + 1 },
//         },
//       }
//     );
//     req.flash("flashdata", {
//       type: "success",
//       message: "Successfully add a new skill",
//     });
//     res.redirect("/profile?tab=skill");
//   } catch (error) {
//     req.flash("flashdata", {
//       type: "danger",
//       message: "Failed to create skill",
//     });
//     res.redirect("/profile?tab=skill");
//   }
// };

// export const deleteSkill = async (req, res, next) => {
//   const { skillId } = req.body;
//   try {
//     await UserModel.updateOne(
//       { _id: req.user._id },
//       {
//         $pull: {
//           skills: { _id: skillId },
//         },
//       }
//     );
//     req.flash("flashdata", {
//       type: "success",
//       message: "Successfully delete skill",
//     });
//     res.redirect("/profile?tab=skill");
//   } catch (error) {
//     req.flash("flashdata", {
//       type: "danger",
//       message: "Failed to delete skill",
//     });
//     res.redirect("/profile?tab=skill");
//   }
// };

// export const putSkill = async (req, res, next) => {
//   const { skillName, skillId } = req.body;
//   try {
//     const query = {
//       _id: req.user._id,
//       "skills._id": mongoose.Types.ObjectId(skillId),
//     };
//     const updateDocument = {
//       $set: {
//         "skills.$.name": skillName,
//       },
//     };
//     await UserModel.updateOne(query, updateDocument);

//     req.flash("flashdata", {
//       type: "success",
//       message: "Successfully update skill",
//     });
//     res.redirect("/profile?tab=skill");
//   } catch (error) {
//     req.flash("flashdata", {
//       type: "danger",
//       message: "Failed to update skill",
//     });
//     res.redirect("/profile?tab=skill");
//   }
// };

export const postChangePassword = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    const passwordMatch = await user.matchPassword(req.body.oldPassword);

    if (!passwordMatch) {
      throw new BaseError(
        "BadRequest",
        httpStatusCodes.BAD_REQUEST,
        "Current Password is wrong",
        true,
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
    user.apiKey = apiKey;
    await user.save();

    await sendEmail({
      from: EMAIL,
      to: req.user.email,
      subject: "Portfolio Dashboard - Your API Key",
      text: `Hello ${req.user.name},<br><br>You have successfully generated a new API Key for your portfolio dashboard.<br><br><strong>Your API Key:</strong> ${apiKey}<br><br>Use this key in the <code>X-API-Key</code> header to access your data via our API.`,
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
export const postUpdateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      throw new BaseError("Not Found", 404, "User not found", true);
    }

    user.name = name;
    await user.save();

    req.flash("flashdata", {
      type: "success",
      message: "Profile updated successfully",
    });
    res.redirect("/profile");
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const postUpdateProfileImage = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      throw new BaseError("Not Found", 404, "User not found", true);
    }

    if (req.fileimg && req.fileimg.type === "success") {
      const oldImage = user.image;

      // Resize the uploaded image to 128x128
      const filePath = req.fileimg.data.path;
      const buffer = await sharp(filePath)
        .resize(128, 128, {
          fit: "cover",
          position: "center",
        })
        .toBuffer();

      fs.writeFileSync(filePath, buffer);

      // Delete old local image if it exists and is not the default
      if (
        oldImage &&
        !oldImage.startsWith("http") &&
        oldImage !== "uploads/profile/default.png" &&
        oldImage !== "profile/guest.png"
      ) {
        deleteFile(path.join(UPLOADS_NAME, oldImage));
      }

      user.image = `profile/${req.fileimg.data.filename}`;
      await user.save();

      req.flash("flashdata", {
        type: "success",
        message: "Profile image updated successfully",
      });
    } else {
      req.flash("flashdata", {
        type: "danger",
        message: req.fileimg?.message || "Failed to upload image",
      });
    }

    res.redirect("/profile");
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};
