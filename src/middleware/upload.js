import multer from "multer";

import Upload from "../helpers/upload.helper.js";

const uploadSingle = new Upload({
  fieldName: "image",
  folderName: "uploads/project/",
}).single();

export const uploadProjectImage = (req, res, next) => {
  uploadSingle(req, res, function (err) {
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

// export default uploadFilesMiddleware ;
