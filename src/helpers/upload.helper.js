import fs from "fs";
import path from "path";
import multer from "multer";
import dayjs from "dayjs";
import BaseError from "../helpers/baseError.helper.js";

class Upload {
  constructor({
    fieldName = "image",
    folderName = "uploads/",
    fileTypes = /jpg|jpeg|png/,
  }) {
    this.fieldName = fieldName;
    this.folderName = folderName;
    this.fileTypes = fileTypes;

    if (!fs.existsSync(this.folderName)) {
      fs.mkdirSync(this.folderName, { recursive: true });
    }
  }

  diskStorage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.folderName);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const timestamp = dayjs().valueOf();

        // Try to get a meaningful name from request
        let baseName = "upload";
        if (req.body && req.body.title) {
          baseName = req.body.title;
        } else if (req.user && req.user.name) {
          baseName = req.user.name;
        } else if (req.body && req.body.name) {
          baseName = req.body.name;
        }

        const safeBaseName = baseName.split(" ").join("-").toLowerCase();
        cb(null, `${safeBaseName}_${timestamp}${ext}`);
      },
    });
  }

  checkFileType(file, cb) {
    const extname = this.fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimeType = this.fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new BaseError("Multer", 500, "Images Only", true));
    }
  }

  single() {
    const storage = this.diskStorage();
    return multer({
      storage,
      fileFilter: (req, file, cb) => {
        this.checkFileType(file, cb);
      },
    }).single(this.fieldName);
  }
}

export default Upload;
