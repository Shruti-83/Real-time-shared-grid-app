// src/App.jsx
import { useEffect, useRef, useState } from "react";
import socket from "./socket.js";
import Navbar from "./components/Navbar";
import Grid from "./components/Grid";
import Leaderboard from "./components/Leaderboard";
import StatsBar from "./components/StatsBar";


const COLORS = [
  "#f5a623", "#7ed321", "#4a90e2", "#d0021b",
  "#9013fe", "#00b8d9", "#ff6b6b", "#50fa7b",
];

function App() {
  const [grid, setGrid] = useState(Array(1600).fill(null));
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({ claimed: 0, total: 1600 });
  const [cooldown, setCooldown] = useState(0);
  const [user, setUser] = useState(null);
  const [online, setOnline] = useState(0);
  const cdTimerRef = useRef(null);
  const cooldownEndRef = useRef(0);
  const [gameOver, setGameOver] = useState(null);
const isCoolingDown = useRef(false); 
const [cooldownMs, setCooldownMs] = useState(0);
  // ── JOIN & SOCKET SETUP ───────────────────────────────────
  useEffect(() => {
  const getOrCreateIdentity = () => {
    const stored = localStorage.getItem("grid_identity");
    if (stored) return JSON.parse(stored);
    const userId = "user_" + Math.random().toString(36).slice(2, 9);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const identity = { userId, name: "User_" + userId.slice(-4), color };
    localStorage.setItem("grid_identity", JSON.stringify(identity));
    return identity;
  };

  const newUser = getOrCreateIdentity();
  setUser(newUser);

  // ── Remove any existing listeners FIRST ──
  socket.off("init");
  socket.off("block_captured");
  socket.off("cooldown");
  socket.off("presence_update");
  socket.off("game_over");
  socket.off("grid_reset");

  socket.emit("join", newUser);

  socket.on("init", (data) => {
    setGrid([...data.grid]);
    setLeaderboard([...data.leaderboard]);
    setStats({ ...data.stats });
    setCooldownMs(data.cooldownMs); 
  });

  socket.on("block_captured", ({ blockIndex, ownerId, ownerColor, ownerName, leaderboard, stats }) => {
  console.log("🎯 block_captured received", blockIndex, ownerColor); // ← add this

  setGrid((prev) => prev.map((cell, i) =>
    i === blockIndex ? { ownerId, ownerColor, ownerName } : cell
  ));
  setLeaderboard([...leaderboard]);
  setStats({ ...stats });
});

 socket.on("cooldown", ({ remaining }) => {
  console.log("⏱ server cooldown:", remaining);
  // Re-sync client timer with server's actual remaining time
  if (cdTimerRef.current) clearInterval(cdTimerRef.current);
  isCoolingDown.current = true;
  cooldownEndRef.current = Date.now() + remaining;
  setCooldown(remaining);

  cdTimerRef.current = setInterval(() => {
    const rem = cooldownEndRef.current - Date.now();
    if (rem <= 0) {
      clearInterval(cdTimerRef.current);
      setCooldown(0);
      isCoolingDown.current = false;
    } else {
      setCooldown(rem);
    }
  }, 50);
});
  socket.on("presence_update", ({ onlineCount }) => {
    setOnline(onlineCount);
  });

  socket.on("game_over", ({ winner, message, leaderboard }) => {
    setLeaderboard([...leaderboard]);
    setGameOver({ winner, message });
  });

  socket.on("grid_reset", ({ grid, stats, leaderboard }) => {
    setGrid([...grid]);
    setStats({ ...stats });
    setLeaderboard([...leaderboard]);
    setGameOver(null);
  });
socket.on("connect", () => {
  console.log("🔌 reconnected, rejoining...");
  const stored = localStorage.getItem("grid_identity");
  if (stored) socket.emit("join", JSON.parse(stored));
  
  // Reset cooldown ref on reconnect so it stays in sync
  isCoolingDown.current = false;
  setCooldown(0);
});
  // ── CLEANUP ──
  return () => {
    socket.off("connect"); 
    socket.off("init");
    socket.off("block_captured");
    socket.off("cooldown");
    socket.off("presence_update");
    socket.off("game_over");
    socket.off("grid_reset");
  };
}, []);

  // ── COOLDOWN TIMER ────────────────────────────────────────
const startCooldown = () => {
  if (cdTimerRef.current) clearInterval(cdTimerRef.current);
  isCoolingDown.current = true;
  cooldownEndRef.current = Date.now() + cooldownMs;

  cdTimerRef.current = setInterval(() => {
    const rem = cooldownEndRef.current - Date.now();
    if (rem <= 0) {
      clearInterval(cdTimerRef.current);
      isCoolingDown.current = false;
      setCooldown(0);
    } else {
      setCooldown(rem);
    }
  }, 50);
};

  // ── CAPTURE ───────────────────────────────────────────────
 const handleClick = (index) => {
  console.log("🖱 clicked", index, "cooling:", isCoolingDown.current);
  if (isCoolingDown.current) return;
  isCoolingDown.current = true;
  socket.emit("capture", { blockIndex: index });
  startCooldown();
};

  // ── YOUR CELL COUNT ───────────────────────────────────────
  const yourCount = user
    ? grid.filter((c) => c?.ownerId === user.userId).length
    : 0;

  return (
    <div
      style={{
        background: "#0a0c10",
        minHeight: "100vh",
        color: "#e0e6f0",
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <Navbar user={user} online={online} cooldown={cooldown} />

      <main style={{ padding: "16px 20px" }}>
        <StatsBar
          stats={stats}
          online={online}
          cooldown={cooldown}
          yourCount={yourCount}
        />
        {gameOver && (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    zIndex: 100, fontFamily: "'Share Tech Mono', monospace",
  }}>
    <div style={{ fontSize: "12px", color: "#4a6080", letterSpacing: "3px", marginBottom: "12px" }}>
      TERRITORY CONQUERED
    </div>
    <div style={{ fontSize: "32px", color: gameOver.winner?.color, fontWeight: 700, marginBottom: "8px" }}>
      {gameOver.winner?.name}
    </div>
    <div style={{ fontSize: "16px", color: "#7090b0", marginBottom: "24px" }}>
      {gameOver.message}
    </div>
    <div style={{ fontSize: "12px", color: "#3a5070", letterSpacing: "2px" }}>
      GRID RESETS IN 10 SECONDS...
    </div>
  </div>
)}

        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
          <Grid grid={grid} onClick={handleClick} />
          <Leaderboard
            leaderboard={leaderboard}
            currentUserId={user?.userId}
          />
        </div>
      </main>
    </div>
  );
}

export default App;