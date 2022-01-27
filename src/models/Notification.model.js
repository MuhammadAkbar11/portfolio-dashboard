import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    theme: {
      icon: {
        type: String,
      },
      color: {
        type: String,
      },
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    content: {
      type: String,
      required: true,
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
