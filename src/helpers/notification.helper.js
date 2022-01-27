import NotificationModel from "../models/Notification.model.js";
import { TransfromError } from "./baseError.helper.js";

class Notification {
  constructor({
    user = null,
    isRead = false,
    icon = "bell",
    color = "success",
    title = "Created new data",
    url = "/",
    type = "PUBLIC",
    content = "Successfully created new data",
  }) {
    this.user = user;
    this.isRead = isRead;
    this.theme = { icon, color };
    this.title = title;
    this.url = url;
    this.type = type;
    this.content = content;

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
