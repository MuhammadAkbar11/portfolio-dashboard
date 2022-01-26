import NotificationModel from "../models/Notification.model.js";
import { TransfromError } from "./baseError.helper.js";

const notifDataSchema = {
  user: null,
  isRead: false,
  icon: "bell",
  title: "Created new data",
  url: "/",
  type: "PUBLIC",
  content: "Successfully created new data",
};

class Notification {
  constructor(data = notifDataSchema) {
    this.user = data.user;
    this.isRead = data.isRead;
    this.icon = data.icon;
    this.title = data.title;
    this.url = data.url;
    this.type = data.type;
    this.content = data.content;

    this.save();
  }

  async save() {
    try {
      return await NotificationModel.create(this);
    } catch (error) {
      const trError = new TransfromError(error);
      throw new trError();
    }
  }
}

export default Notification;
