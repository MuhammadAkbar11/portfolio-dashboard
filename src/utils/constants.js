import path from "path";

const __dirname = path.resolve();

export const STATIC_FOLDER = path.join(__dirname, "src", "static");
export const UPLOADS_FOLDER = path.join(__dirname, "uploads");

export const PROJECT_STATUS_ENUM = {
  TODO: "TODO",
  PROGRESS: "PROGRESS",
  ON_HOLD: "ON_HOLD",
  FINISHED: "FINISHED",
};
