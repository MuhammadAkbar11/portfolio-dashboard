import { Server as SocketServer } from "socket.io";

import TaskSocker from "./task.socker.js";

function SockerApp(server) {
  const io = new SocketServer(server, {
    cors: true,
    // origins: ["http://localhost:3000"],
  });

  const onConnection = socket => {
    console.log("socket connected");

    TaskSocker(socket);
  };

  io.on("connection", onConnection);
}

export default SockerApp;
