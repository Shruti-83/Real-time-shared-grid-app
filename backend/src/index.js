import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import connectDB from "./config/db.js";
import { initGridState } from "./config/gridStore.js";
import apiRoutes from "./routes/api.js";
import registerSocketHandlers from "./socket/handlers.js";

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// ── Express app ──────────────────────────────────────────────────────────────
const app = express();

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

// REST routes
app.use("/api", apiRoutes);

// ── HTTP + Socket.io server ──────────────────────────────────────────────────
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Register all socket event handlers
registerSocketHandlers(io);

// ── Boot sequence ────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();          // 1. Connect MongoDB
  await initGridState();      // 2. Seed / hydrate in-memory grid
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.io ready`);
    console.log(`🗄️  REST API at http://localhost:${PORT}/api`);
  });
};

start();