import { useEffect, useRef, useState } from "react";
import socket from "./socket.js";
import Navbar from "./components/Navbar.jsx";
import Grid from "./components/Grid.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import Statsbar from "./components/Statsbar.jsx";
import GameOver from "./components/GameOver.jsx";
import { useBreakpoint } from "./hooks/useBreakpoint.js";

const COLORS = [
  "#f5a623", "#7ed321", "#4a90e2", "#d0021b",
  "#9013fe", "#00b8d9", "#ff6b6b", "#50fa7b",
];

const TOTAL = 1000; // 40×25

function App() {
  const { isMobile, isTablet } = useBreakpoint();
  const isSmall = isMobile || isTablet;

  const [grid, setGrid] = useState(Array(TOTAL).fill(null));
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({ claimed: 0, total: TOTAL, percentClaimed: "0.0" });
  const [cooldown, setCooldown] = useState(0);
  const [user, setUser] = useState(null);
  const [online, setOnline] = useState(0);
  const [gameOver, setGameOver] = useState(null);
  const [cooldownMs, setCooldownMs] = useState(1500);

  const cdTimerRef = useRef(null);
  const cooldownEndRef = useRef(0);
  const isCoolingDown = useRef(false);

  // ── Identity ────────────────────────────────────────────────────────────────
  const getOrCreateIdentity = () => {
    const stored = localStorage.getItem("grid_identity");
    if (stored) return JSON.parse(stored);
    const userId = "user_" + Math.random().toString(36).slice(2, 9);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const identity = { userId, name: "User_" + userId.slice(-4), color };
    localStorage.setItem("grid_identity", JSON.stringify(identity));
    return identity;
  };

  // ── Socket setup ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const newUser = getOrCreateIdentity();
    setUser(newUser);

    // Clear listeners before attaching
    socket.off("init");
    socket.off("block_captured");
    socket.off("cooldown");
    socket.off("presence_update");
    socket.off("game_over");
    socket.off("grid_reset");
    socket.off("connect");

    socket.emit("join", newUser);

    socket.on("init", (data) => {
      setGrid([...data.grid]);
      setLeaderboard([...data.leaderboard]);
      setStats({ ...data.stats });
      setCooldownMs(data.cooldownMs || 1500);
    });

    socket.on("block_captured", ({ blockIndex, ownerId, ownerColor, ownerName, leaderboard, stats }) => {
      setGrid((prev) =>
        prev.map((cell, i) =>
          i === blockIndex ? { ownerId, ownerColor, ownerName } : cell
        )
      );
      setLeaderboard([...leaderboard]);
      setStats({ ...stats });
    });

    socket.on("cooldown", ({ remaining }) => {
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
      const stored = localStorage.getItem("grid_identity");
      if (stored) socket.emit("join", JSON.parse(stored));
      isCoolingDown.current = false;
      setCooldown(0);
    });

    return () => {
      socket.off("connect");
      socket.off("init");
      socket.off("block_captured");
      socket.off("cooldown");
      socket.off("presence_update");
      socket.off("game_over");
      socket.off("grid_reset");
      if (cdTimerRef.current) clearInterval(cdTimerRef.current);
    };
  }, []);

  // ── Cooldown start ───────────────────────────────────────────────────────────
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

  // ── Capture ──────────────────────────────────────────────────────────────────
  const handleClick = (index) => {
    if (isCoolingDown.current) return;
    isCoolingDown.current = true;
    socket.emit("capture", { blockIndex: index });
    startCooldown();
  };

  // ── Your cells ───────────────────────────────────────────────────────────────
  const yourCount = user
    ? grid.filter((c) => c?.ownerId === user.userId).length
    : 0;

  // ── Layout ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#0a0c10", minHeight: "100vh", color: "#e0e6f0" }}>

      <Navbar user={user} online={online} cooldown={cooldown} />

      <main style={{
        padding: isMobile ? "10px 10px" : isTablet ? "12px 14px" : "16px 20px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}>

        {/* Stats row */}
        <Statsbar
          stats={stats}
          online={online}
          cooldown={cooldown}
          yourCount={yourCount}
        />

        {/* 
          Layout:
          - Mobile:  Grid on top, Leaderboard (horizontal chips) below
          - Tablet:  Grid on top, Leaderboard (horizontal chips) below
          - Desktop: Grid left, Leaderboard panel right (side by side)
        */}
        <div style={{
          display: "flex",
          flexDirection: isSmall ? "column" : "row",
          gap: isSmall ? "10px" : "14px",
          alignItems: isSmall ? "stretch" : "flex-start",
        }}>
          <Grid grid={grid} onClick={handleClick} />
          <Leaderboard leaderboard={leaderboard} currentUserId={user?.userId} />
        </div>

      </main>

      <GameOver gameOver={gameOver} />
    </div>
  );
}

export default App;