import { Server as SocketServer } from "socket.io";

const socketServer = server => {
  return new SocketServer(server, {
    cors: true,
    origins: [],
  });
};

export default socketServer;
