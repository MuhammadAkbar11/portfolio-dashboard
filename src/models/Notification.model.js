import mongoose from "mongoose";
import { TASK_STATUS_ENUM } from "../utils/constants.js";

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    isRead: {
      type: Boolean,
    },
    content: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model(
  "NotificationModel",
  notificationSchema,
  "notifications"
);

export default NotificationModel;
