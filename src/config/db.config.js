import chalk from "chalk";
import mongoose from "mongoose";
import consoleLog from "../utils/consoleLog.js";
import { MONGO_URI } from "./env.config.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true, // useCreateIndex: true,
    });
    consoleLog.info(
      `[mongoose] mongo connected on mongodb://*****:*****@${chalk.bold(
        conn?.connection?.host,
      )}:${chalk?.bold(conn.connection.port)} `,
    );
    consoleLog.info(
      `[mongoose] mongo database : ${chalk.bold(conn.connection.name)}`,
    );
  } catch (error) {
    console.log(error);
    if (error.message) {
      consoleLog.error(
        `[mongoose] failed to connected mongo on ${error?.message}`,
      );
    }

    process.exit(1);
  }
};

export default connectDB;
