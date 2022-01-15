import mongoose from "mongoose";
import { TASK_STATUS_ENUM } from "../utils/constants.js";

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: TASK_STATUS_ENUM,
      default: TASK_STATUS_ENUM.TODO,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectModel",
    },
    dateDone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model("TaskModel", taskSchema, "tasks");

export default TaskModel;
