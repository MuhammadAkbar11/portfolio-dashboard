import ProjectModel from "../../models/Project.model.js";

export const up = async () => {
  console.log("Running migration: Add year to projects...");
  const currentYear = new Date().getFullYear().toString();
  const result = await ProjectModel.updateMany(
    { year: { $exists: false } },
    { $set: { year: currentYear } }
  );
  console.log(`Updated ${result.modifiedCount} projects with default year ${currentYear}.`);
};

export const down = async () => {
  console.log("Rolling back migration: Add year to projects...");
  const result = await ProjectModel.updateMany(
    {},
    { $unset: { year: "" } }
  );
  console.log(`Removed year field from ${result.modifiedCount} projects.`);
};
