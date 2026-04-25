import { io } from "socket.io-client";

const userId = document.querySelector('meta[name="user-id"]')?.getAttribute('content');
const socket = io({
  auth: {
    userId
  }
});

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

const socketClient = socket;

export default socketClient;
