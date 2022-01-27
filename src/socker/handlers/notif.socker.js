import NotificationModel from "../../models/Notification.model.js";

function RegisterNotificationHandlers(io, socket) {
  socket.on("load-count-new-notif", async ({ limit = null }, cb) => {
    try {
      const countNotif = await NotificationModel.find({
        isRead: false,
      }).countDocuments();
      const listNotif = await NotificationModel.find({})
        .sort({
          createdAt: -1,
        })
        .limit(limit || 5);
      io.emit("count-notif", {
        count: countNotif,
        listNotif: listNotif,
      });
      cb(null);
    } catch (error) {
      cb && cb(error);
    }
  });

  socket.on("reset-unread-notif", async cb => {
    try {
      await NotificationModel.updateMany({ isRead: false }, { isRead: true });
      cb(null);
    } catch (error) {
      cb && cb(error);
    }
  });
}

export default RegisterNotificationHandlers;
