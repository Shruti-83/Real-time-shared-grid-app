import {
  getGrid,
  getBlock,
  setBlock,
  buildLeaderboard,
  getGridStats,
  getCooldownRemaining,
  setCooldown,
  resetGrid, 
} from "../config/gridStore.js";
import {
  addUser,
  removeUser,
  getUser,
  getOnlineCount,
  getOnlineList,
} from "../config/userStore.js";
import { TOTAL_BLOCKS, COOLDOWN_MS, GRID_COLS, GRID_ROWS } from "../config/grid.js";
import Block from "../models/Block.js";
import User from "../models/User.js";

// ── Helper: broadcast updated online presence ────────────────────────────────
const broadcastPresence = (io) => {
  io.emit("presence_update", {
    onlineCount: getOnlineCount(),
    onlineUsers: getOnlineList(),
  });
};

// ── Main socket handler ──────────────────────────────────────────────────────
const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    // ── Event: join ──────────────────────────────────────────────────────────
    // Client sends: { userId, name, color }
    socket.on("join", async ({ userId, name, color }) => {
          if (getUser(socket.id)) return;
      if (!userId || !name || !color) {
        return socket.emit("error", { msg: "Invalid join payload" });
      }

      // Register in memory
      addUser(socket.id, { userId, name, color });

      // Persist user to DB (upsert)
      try {
        await User.findOneAndUpdate(
          { userId },
          { name, color, isOnline: true, lastActive: new Date() },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error("User upsert error:", err.message);
      }

      // Send full initial state to this client only
      socket.emit("init", {
  grid: [...getGrid()],

        cols: GRID_COLS,
        rows: GRID_ROWS,
        total: TOTAL_BLOCKS,
        leaderboard: buildLeaderboard(),
        stats: getGridStats(),
        cooldownMs: COOLDOWN_MS,
      });

      // Notify all clients of new online count
      broadcastPresence(io);
      console.log(`👤 ${name} (${userId}) joined — ${getOnlineCount()} online`);
    });

    // ── Event: capture ───────────────────────────────────────────────────────
    // Client sends: { blockIndex }
    socket.on("capture", async ({ blockIndex }) => {
        console.log("📥 capture received", blockIndex); // ← add at very top
  
      const user = getUser(socket.id);
       console.log("👤 user found:", user); // ← add this too
      if (!user) {
        return socket.emit("error", { msg: "Not registered. Send join first." });
      }

      const { userId, name, color } = user;

      // Validate block index
      if (
        typeof blockIndex !== "number" ||
        blockIndex < 0 ||
        blockIndex >= TOTAL_BLOCKS
      ) {
        return socket.emit("error", { msg: "Invalid block index" });
      }

      // Cooldown check
      const remaining = getCooldownRemaining(userId, COOLDOWN_MS);
      console.log("⏱ cooldown remaining:", remaining); // ← add this
      if (remaining > 0) {
         console.log("🚫 blocked by cooldown"); // ← add this
        return socket.emit("cooldown", {
          remaining,
          msg: `Wait ${(remaining / 1000).toFixed(1)}s before capturing again`,
        });
      }
      

      // Already owned by same user — no-op
      const existing = getBlock(blockIndex);
      if (existing?.ownerId === userId) {
        return socket.emit("error", { msg: "You already own this block" });
      }

      // ── Capture ──────────────────────────────────────────────────────────
      const capturedAt = new Date();
      const blockData = { ownerId: userId, ownerName: name, ownerColor: color, capturedAt };

      // Update in-memory immediately (fast path)
      setBlock(blockIndex, blockData);
      setCooldown(userId);

      // Persist to MongoDB asynchronously — does not block emit
      Block.findOneAndUpdate(
        { index: blockIndex },
        { ownerId: userId, ownerName: name, ownerColor: color, capturedAt },
        { upsert: true }
      ).catch((err) => console.error("Block persist error:", err.message));

      User.findOneAndUpdate(
        { userId },
        { lastActive: new Date() }
      ).catch(() => {});

      // Broadcast to ALL clients
      const leaderboard = buildLeaderboard();
      const stats = getGridStats();

      io.emit("block_captured", {
        blockIndex,
        ...blockData,
        leaderboard,
        stats,
      });
      // After the existing io.emit("block_captured", { ... }) call:

if (stats.claimed >= TOTAL_BLOCKS) {
  const winner = leaderboard[0];

  io.emit("game_over", {
    winner,
    leaderboard,
    message: `${winner.name} dominates with ${winner.count} blocks!`,
  });

  setTimeout(async () => {
    resetGrid();

    // Wipe all ownership from MongoDB
    await Block.updateMany(
      {},
      { $unset: { ownerId: "", ownerName: "", ownerColor: "", capturedAt: "" } }
    ).catch((err) => console.error("Reset error:", err.message));

    io.emit("grid_reset", {
      grid: getGrid(),
      stats: getGridStats(),
      leaderboard: [],
    });

    console.log("🔄 Grid reset after game over");
  }, 10_000); // 10 second cooldown before reset
}

      console.log(`🎯 Block ${blockIndex} → ${name} | Total: ${stats.claimed}/${stats.total}`);
    });

    // ── Event: disconnect ────────────────────────────────────────────────────
    socket.on("disconnect", async (reason) => {
      const user = removeUser(socket.id);
      if (user) {
        try {
          await User.findOneAndUpdate(
            { userId: user.userId },
            { isOnline: false }
          );
        } catch (_) {}
        broadcastPresence(io);
        console.log(`👋 ${user.name} disconnected (${reason}) — ${getOnlineCount()} online`);
      }
    });
  });
};

export default registerSocketHandlers;