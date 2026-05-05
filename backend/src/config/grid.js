export const GRID_COLS = parseInt(process.env.GRID_COLS) || 40;
export const GRID_ROWS = parseInt(process.env.GRID_ROWS) || 25;
export const TOTAL_BLOCKS = GRID_COLS * GRID_ROWS; // 1000 blocks
export const COOLDOWN_MS = parseInt(process.env.COOLDOWN_MS) || 1500;