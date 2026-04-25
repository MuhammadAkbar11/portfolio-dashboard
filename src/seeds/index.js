import path from "path";
import fs from "fs";
import * as envConfigs from "../config/env.config.js";
import bcryptjs from "bcryptjs";
import connectDB from "../config/db.config.js";
import consoleLog from "../utils/consoleLog.js";
import UserModel from "../models/User.model.js";
import ProjectModel from "../models/Project.model.js";
import TaskModel from "../models/Task.model.js";
import SkillModel from "../models/Skill.model.js";

const __dirname = path.resolve();

envConfigs.dotenvConfig;

connectDB();

function readJson(filename) {
  return JSON.parse(fs.readFileSync(path.resolve(`src/data/${filename}`), "utf-8"));
}

async function importData() {
  try {
    // ── Users ──────────────────────────────────────────────────────────
    const users = readJson("users.json").map(user => {
      const email = user?.email
        ? String(user.email).toLowerCase().trim()
        : user.email;
      const password =
        user?.password && String(user.password).length > 0
          ? bcryptjs.hashSync(String(user.password), 12)
          : null;

      const doc = {
        ...user,
        email,
        password,
        authProviders:
          Array.isArray(user?.authProviders) && user.authProviders.length > 0
            ? user.authProviders
            : ["local"],
      };

      if (user?.googleId) {
        doc.googleId = String(user.googleId);
      }

      return doc;
    });

    const createdUsers = await UserModel.insertMany(users);
    const defaultUser = createdUsers[0];
    consoleLog.info(`Created ${createdUsers.length} user(s). Default user: ${defaultUser.email}`);

    // ── Projects ────────────────────────────────────────────────────────
    const projectsRaw = readJson("projects.json");
    const projectDocs = projectsRaw.map(p => ({ ...p, user: defaultUser._id }));
    const createdProjects = await ProjectModel.insertMany(projectDocs);
    consoleLog.info(`Created ${createdProjects.length} project(s).`);

    // ── Tasks ───────────────────────────────────────────────────────────
    const tasksRaw = readJson("tasks.json");
    const taskDocs = tasksRaw.map(t => ({
      note: t.note,
      status: t.status,
      project: createdProjects[t.projectRef]?._id,
      user: defaultUser._id,
    }));
    const createdTasks = await TaskModel.insertMany(taskDocs);
    consoleLog.info(`Created ${createdTasks.length} task(s).`);

    // ── Skills ──────────────────────────────────────────────────────────
    const skillsRaw = readJson("skills.json");
    const skillDocs = skillsRaw.map(s => ({ ...s, user: defaultUser._id }));
    const createdSkills = await SkillModel.insertMany(skillDocs);
    consoleLog.info(`Created ${createdSkills.length} skill(s).`);

    consoleLog.info("Import completed successfully!");
    process.exit();
  } catch (error) {
    console.log(error);
    consoleLog.error("Import data failed!");
    process.exit(1);
  }
}

async function destroyData() {
  try {
    await TaskModel.deleteMany();
    await ProjectModel.deleteMany();
    await SkillModel.deleteMany();
    await UserModel.deleteMany();
    consoleLog.info("All seed data destroyed.");
    process.exit();
  } catch (error) {
    console.log(error);
    consoleLog.error("Destroy failed!");
    process.exit(1);
  }
}

function unknownSeed() {
  console.log("Unknown command. Use: seed=import | seed=destroy");
  process.exit();
}

const command = process.argv.find(arg => arg.includes("seed="))?.split("=")[1];

if (command === "import") {
  importData();
} else if (command === "destroy") {
  destroyData();
} else {
  unknownSeed();
}
