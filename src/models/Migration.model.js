import mongoose from "mongoose";

const migrationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    runAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const MigrationModel = mongoose.model(
  "MigrationModel",
  migrationSchema,
  "migrations",
);

export default MigrationModel;
