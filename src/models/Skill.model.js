import mongoose from "mongoose";

const skillSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const SkillModel = mongoose.model("SkillModel", skillSchema, "skills");

export default SkillModel;
