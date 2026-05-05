import { useBreakpoint } from "../hooks/useBreakpoint";

function GameOver({ gameOver }) {
  const { isMobile } = useBreakpoint();

  if (!gameOver) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <div style={styles.subtitle}>TERRITORY CONQUERED</div>
        <div style={{
          ...styles.winnerName,
          color: gameOver.winner?.color || "#4a9fe0",
          fontSize: isMobile ? "24px" : "32px",
        }}>
          {gameOver.winner?.name || "Unknown"}
        </div>
        <div style={styles.message}>{gameOver.message}</div>
        <div style={styles.countdown}>GRID RESETS IN 10 SECONDS...</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.88)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 300,
    padding: "20px",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "11px",
    color: "#4a6080",
    letterSpacing: "3px",
    fontFamily: "'Share Tech Mono', monospace",
  },
  winnerName: {
    fontWeight: 700,
    fontFamily: "'Share Tech Mono', monospace",
  },
  message: {
    fontSize: "15px",
    color: "#7090b0",
    fontFamily: "'Rajdhani', sans-serif",
  },
  countdown: {
    fontSize: "11px",
    color: "#3a5070",
    letterSpacing: "2px",
    fontFamily: "'Share Tech Mono', monospace",
  },
};

export default GameOver;