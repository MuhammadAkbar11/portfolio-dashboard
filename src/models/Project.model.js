import mongoose from "mongoose";
import { PROJECT_STATUS_ENUM, TASK_STATUS_ENUM } from "../utils/constants.js";
import TaskModel from "./Task.Model.js";

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
    demo: {
      type: String,
    },
    github: {
      type: String,
    },
    image: {
      type: String,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.methods.getTasks = async function () {
  const tasks = await TaskModel.find({ project: this._id })
    .sort([["createdAt", 1]])
    .exec();
  const progress = tasks.reduce(
    (c, { status }) => {
      if (status == TASK_STATUS_ENUM.TODO) c.todo++;
      if (status == TASK_STATUS_ENUM.DONE) c.done++;
      if (status == TASK_STATUS_ENUM.PROGRESS) c.inProggress++;
      c.total++;
      c.percentage = parseInt((c.done / c.total) * 100);
      return c;
    },
    { todo: 0, inProggress: 0, done: 0, total: 0, percentage: 0 }
  );

  const taskByGroup = tasks.reduce(
    (c, task) => {
      if (task.status == TASK_STATUS_ENUM.TODO) c.todo.push(task);
      if (task.status == TASK_STATUS_ENUM.DONE) c.done.push(task);
      if (task.status == TASK_STATUS_ENUM.PROGRESS) c.progress.push(task);
      return c;
    },
    { todo: [], done: [], progress: [] }
  );

  return { tasks: taskByGroup, progress };
};

const ProjectModel = mongoose.model("ProjectModel", projectSchema, "projects");

export default ProjectModel;
