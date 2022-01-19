import { Server as SocketServer } from "socket.io";
import RegisterTaskHandlers from "./handlers/task.socker.js";

function SockerApp(server) {
  const io = new SocketServer(server, {
    cors: true,
    origins: [],
  });

  const onConnection = socket => {
    socket.on("join", room => {
      socket.join(room.trim());
    });

    RegisterTaskHandlers(io, socket);
  };

  io.on("connection", onConnection);
}

export default SockerApp;
