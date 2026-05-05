import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  reconnectionDelayMax: 2000,
  transports: ["websocket"],
  upgrade: false,
});

export default socket;