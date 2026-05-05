import { TOTAL_BLOCKS, GRID_COLS } from "../config/grid.js";
import Block from "../models/Block.js";

// gridState[i] = null (unclaimed) | { ownerId, ownerName, ownerColor, capturedAt }
let gridState = new Array(TOTAL_BLOCKS).fill(null);

// userId → timestamp of last capture
const cooldowns = new Map();

// ── Seed / hydrate from MongoDB ──────────────────────────────────────────────
export const initGridState = async () => {
  const count = await Block.countDocuments();

  if (count === 0) {
    // First run — seed all block documents
    const docs = Array.from({ length: TOTAL_BLOCKS }, (_, i) => ({
      index: i,
      row: Math.floor(i / GRID_COLS),
      col: i % GRID_COLS,
    }));
    await Block.insertMany(docs);
    console.log(`🔧 Seeded ${TOTAL_BLOCKS} block documents`);
  } else {
    // Hydrate in-memory state from DB
    const claimed = await Block.find({ ownerId: { $ne: null } }).lean();
    claimed.forEach((b) => {
      gridState[b.index] = {
        ownerId:    b.ownerId,
        ownerName:  b.ownerName,
        ownerColor: b.ownerColor,
        capturedAt: b.capturedAt,
      };
    });
    console.log(`✅ Hydrated ${claimed.length} claimed blocks from DB`);
  }
};

// ── Grid accessors ───────────────────────────────────────────────────────────
export const getGrid = () => gridState.map(cell => cell ? { ...cell } : null);

export const getBlock = (index) => gridState[index];

export const setBlock = (index, data) => {
  gridState[index] = data;
};

// ── Cooldown helpers ─────────────────────────────────────────────────────────
export const getCooldownRemaining = (userId, cooldownMs) => {
  const last = cooldowns.get(userId) || 0;
  const elapsed = Date.now() - last;
  return elapsed >= cooldownMs ? 0 : cooldownMs - elapsed;
};

export const setCooldown = (userId) => {
  cooldowns.set(userId, Date.now());
};

// ── Leaderboard (derived from in-memory state) ───────────────────────────────
export const buildLeaderboard = () => {
  const tally = {};
  gridState.forEach((cell) => {
    if (!cell) return;
    const { ownerId, ownerName, ownerColor } = cell;
    if (!tally[ownerId]) {
      tally[ownerId] = { userId: ownerId, name: ownerName, color: ownerColor, count: 0 };
    }
    tally[ownerId].count++;
  });
  return Object.values(tally)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

// ── Stats ────────────────────────────────────────────────────────────────────
export const getGridStats = () => {
  const claimed = gridState.filter(Boolean).length;
  return {
    total: TOTAL_BLOCKS,
    claimed,
    unclaimed: TOTAL_BLOCKS - claimed,
    percentClaimed: ((claimed / TOTAL_BLOCKS) * 100).toFixed(1),
  };
};
export const resetGrid = () => {
  gridState = new Array(TOTAL_BLOCKS).fill(null);
};