import { io } from "socket.io-client";

const socket = io();

export function socketRoom(room) {
  socket.emit("join", room);
}
