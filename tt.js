import { io } from "socket.io-client";

const socket = io("https://rbs-emb.art/orders", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connect error:", err.message);
});
