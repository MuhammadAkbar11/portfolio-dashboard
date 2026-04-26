import path from "path";
import { MODE } from "../config/env.config.js";

const __dirname = path.resolve();

export const STATIC_FOLDER =
  MODE != "development"
    ? path.join(__dirname, "src", "dist")
    : path.join(__dirname, "build");
export const UPLOADS_NAME = MODE === "development" ? ".dev/uploads" : "uploads";
export const UPLOADS_FOLDER = path.join(__dirname, UPLOADS_NAME);

export const PROJECT_STATUS_ENUM = {
  TODO: "TODO",
  PROGRESS: "PROGRESS",
  ON_HOLD: "ON_HOLD",
  FINISHED: "FINISHED",
};

export const TASK_STATUS_ENUM = {
  TODO: "TODO",
  PROGRESS: "PROGRESS",
  DONE: "DONE",
};
