import mongoose from "mongoose";
import { PROJECT_STATUS_ENUM } from "../utils/constants.js";

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stacks: {
      type: Array,
    },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS_ENUM),
      default: PROJECT_STATUS_ENUM.TODO,
    },
    progress: {
      type: Number,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    demo: {
      type: String,
    },
    github: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model("ProjectModel", projectSchema, "projects");

export default ProjectModel;
