import RegisterNotificationHandlers from "./handlers/notif.socker.js";
import RegisterTaskHandlers from "./handlers/task.socker.js";

function SockerApp(io) {
  const onConnection = socket => {
    console.log(`socket.io connected: ${socket.id}`);
    const userId = socket.handshake.auth.userId;
    if (userId) {
      socket.join(`user:${userId}`);
    }
    socket.on("join", room => {
      socket.join(room.trim());
    });

    RegisterTaskHandlers(io, socket);
    RegisterNotificationHandlers(io, socket);
  };

  io.on("connection", onConnection);
}

export default SockerApp;
