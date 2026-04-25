import NotificationModel from "../../models/Notification.model.js";

function RegisterNotificationHandlers(io, socket) {
  socket.on("load-count-new-notif", async ({ limit = null }, cb) => {
    try {
      const userId = socket.handshake.auth.userId;
      if (!userId) return cb && cb("User ID not found in socket handshake");

      const countNotif = await NotificationModel.find({
        user: userId,
        isRead: false,
      }).countDocuments();

      const listNotif = await NotificationModel.find({ user: userId })
        .sort({
          createdAt: -1,
        })
        .limit(limit || 5);

      socket.emit("count-notif", {
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
      const userId = socket.handshake.auth.userId;
      if (!userId) return cb && cb("User ID not found in socket handshake");

      await NotificationModel.updateMany({ user: userId, isRead: false }, { isRead: true });
      cb(null);
    } catch (error) {
      cb && cb(error);
    }
  });
}

export default RegisterNotificationHandlers;
