import { io } from "socket.io-client";

const socket = io("https://hargeisa-connect.onrender.com", {
  transports: ["websocket"], // 🔥 muhiim
  upgrade: false,
  withCredentials: true,
});

export default socket;