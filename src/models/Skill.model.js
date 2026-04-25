import mongoose from "mongoose";

const skillSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    order: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SkillModel = mongoose.model("SkillModel", skillSchema, "skills");

export default SkillModel;
