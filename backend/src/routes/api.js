import { Router } from "express";
import {
  getGrid,
  buildLeaderboard,
  getGridStats,
} from "../config/gridStore.js";
import { getOnlineCount, getOnlineList } from "../config/userStore.js";
import { GRID_COLS, GRID_ROWS, TOTAL_BLOCKS } from "../config/grid.js";

const router = Router();

// GET /api/state — full initial state (used by frontend on first load)
router.get("/state", (req, res) => {
  res.json({
    grid: getGrid(),
    cols: GRID_COLS,
    rows: GRID_ROWS,
    total: TOTAL_BLOCKS,
    leaderboard: buildLeaderboard(),
    onlineCount: getOnlineCount(),
    stats: getGridStats(),
  });
});

// GET /api/leaderboard
router.get("/leaderboard", (req, res) => {
  res.json(buildLeaderboard());
});

// GET /api/stats
router.get("/stats", (req, res) => {
  res.json({
    ...getGridStats(),
    onlineCount: getOnlineCount(),
    onlineUsers: getOnlineList(),
  });
});

// GET /api/health
router.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

export default router;