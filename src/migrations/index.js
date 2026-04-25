import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.config.js";
import MigrationModel from "../models/Migration.model.js";

dotenv.config();

const __dirname = path.resolve();
const MIGRATIONS_DIR = path.join(__dirname, "src/migrations/scripts");

async function runMigrations() {
  try {
    await connectDB();
    console.log("Database connected for migrations.");

    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith(".js")).sort();
    
    for (const file of files) {
      const alreadyRun = await MigrationModel.findOne({ name: file });
      if (alreadyRun) {
        console.log(`Migration ${file} already run. Skipping.`);
        continue;
      }

      console.log(`Running migration: ${file}`);
      const migration = await import(`./scripts/${file}`);
      
      if (migration.up) {
        await migration.up();
        await MigrationModel.create({ name: file });
        console.log(`Migration ${file} completed successfully.`);
      } else {
        console.warn(`Migration ${file} does not have an 'up' function.`);
      }
    }

    console.log("All migrations completed.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

const command = process.argv[2];

if (command === "up") {
  runMigrations();
} else {
  console.log("Usage: node src/migrations/index.js up");
  process.exit(1);
}
