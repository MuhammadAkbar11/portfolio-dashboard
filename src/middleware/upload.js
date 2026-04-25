import multer from "multer";

import Upload from "../helpers/upload.helper.js";
import { UPLOADS_NAME } from "../utils/constants.js";

const uploadSingleProject = new Upload({
  fieldName: "image",
  folderName: `${UPLOADS_NAME}/project/`,
}).single();

const uploadSingleProfile = new Upload({
  fieldName: "image",
  folderName: `${UPLOADS_NAME}/profile/`,
}).single();

const handleUpload = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, function (err) {
    let file = {
      type: "success",
      message: "Upload file success",
      data: req.file,
    };

    if (err instanceof multer.MulterError) {
      file = {
        type: "error",
        message: "Failed to upload",
        data: null,
      };
      req.fileimg = file;
      next();
    } else if (err) {
      file = {
        type: "error",
        message: "Failed to upload",
        data: null,
      };
      req.fileimg = file;
      next();
    } else {
      if (req.file === undefined) {
        file = {
          type: "error",
          message: "Please upload your file",
          data: null,
        };
      }
      req.fileimg = file;
      next();
    }
  });
};

export const uploadProjectImage = handleUpload(uploadSingleProject);
export const uploadProfileImage = handleUpload(uploadSingleProfile);
