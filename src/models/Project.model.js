import mongoose from "mongoose";

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
      required: true,
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
      required: true,
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
