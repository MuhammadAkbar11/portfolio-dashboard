import { io } from "socket.io-client";

const socket = io();

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

const socketClient = socket;

export default socketClient;
