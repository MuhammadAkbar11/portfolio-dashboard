import path from "path";
import fs from "fs";
import * as envConfigs from "../config/env.config.js";
import bcryptjs from "bcryptjs";
import connectDB from "../config/db.config.js";
import consoleLog from "../utils/consoleLog.js";
import UserModel from "../models/User.model.js";

const __dirname = path.resolve();

envConfigs.dotenvConfig;

connectDB();

async function importData() {
  try {
    const usersJson = fs.readFileSync(path.resolve("src/data/users.json"));

    const users = JSON.parse(usersJson).map(user => {
      const email = user?.email ? String(user.email).toLowerCase().trim() : user.email;
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

      // Important: do NOT persist googleId=null for local users.
      // With a sparse+unique index, "missing field" is OK; "null" is treated as a value.
      if (user?.googleId) {
        doc.googleId = String(user.googleId);
      }

      return doc;
    });

    await UserModel.insertMany(users);

    consoleLog.info("Import Success");
    process.exit();
  } catch (error) {
    console.log(error);
    consoleLog.error("Import data is failed!");
    process.exit();
  }
}

async function destroyData() {
  try {
    await UserModel.deleteMany();
    consoleLog.error("Destroyed");
    process.exit();
  } catch (error) {
    consoleLog.error("Import data is failed!");
    process.exit();
  }
}

function unknownSeed() {
  console.log("Unknown command");
  process.exit();
}

const command = process.argv.find(arg => arg.includes("seed=")).split("=")[1];

if (command == "import") {
  importData();
} else if (command == "destroy") {
  destroyData();
} else {
  unknownSeed();
}
