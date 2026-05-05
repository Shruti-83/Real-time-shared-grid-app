import { useBreakpoint } from "../hooks/useBreakpoint";

function Leaderboard({ leaderboard, currentUserId }) {
  const { isMobile, isTablet } = useBreakpoint();
  const isSmall = isMobile || isTablet;
  const max = leaderboard.length > 0 ? leaderboard[0].count || 1 : 1;

  if (isSmall) {
    // ── Horizontal scrollable chips on mobile/tablet ──────────────────────────
    return (
      <div style={styles.mobileWrapper}>
        <div style={styles.mobileHeader}>
          <span style={styles.sectionLabel}>LEADERBOARD</span>
          <span style={styles.sectionSub}>{leaderboard.length} players</span>
        </div>
        <div style={styles.chipRow}>
          {leaderboard.length === 0 && (
            <span style={styles.empty}>No captures yet</span>
          )}
          {leaderboard.map((user, i) => {
            const isMe = user.userId === currentUserId;
            return (
              <div
                key={user.userId || i}
                style={{
                  ...styles.chip,
                  border: isMe ? `1px solid ${user.ownerColor || user.color}` : "1px solid #1e2a3a",
                  background: isMe ? "#1a2230" : "#111620",
                }}
              >
                <span style={styles.chipRank}>#{i + 1}</span>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: user.ownerColor || user.color,
                  flexShrink: 0,
                }} />
                <span style={{
                  ...styles.chipName,
                  color: isMe ? "#f0c060" : "#c0cce0",
                }}>
                  {isMe ? "YOU" : (user.ownerName || user.name)}
                </span>
                <span style={styles.chipCount}>{user.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Vertical panel on desktop ─────────────────────────────────────────────
  return (
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <span style={styles.sectionLabel}>LEADERBOARD</span>
        <span style={styles.sectionSub}>{leaderboard.length} players</span>
      </div>

      {leaderboard.length === 0 && (
        <div style={styles.emptyPanel}>No captures yet</div>
      )}

      {leaderboard.map((user, i) => {
        const isMe = user.userId === currentUserId;
        const barW = max > 0 ? Math.round(((user.count || 0) / max) * 100) : 0;

        return (
          <div key={user.userId || i}>
            <div style={{
              ...styles.row,
              background: isMe ? "#1a2230" : "transparent",
            }}>
              <span style={styles.rank}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>
              <span style={{
                width: "10px", height: "10px",
                borderRadius: "50%",
                background: user.ownerColor || user.color,
                flexShrink: 0,
              }} />
              <span style={{
                ...styles.rowName,
                color: isMe ? "#f0c060" : "#c0cce0",
              }}>
                {isMe ? "YOU" : (user.ownerName || user.name)}
              </span>
              <span style={styles.rowCount}>{user.count || 0}</span>
            </div>
            <div style={{ height: "3px", background: "#1a2230" }}>
              <div style={{
                height: "100%",
                width: `${barW}%`,
                background: user.ownerColor || user.color,
                transition: "width 0.4s ease",
                borderRadius: "2px",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  // Desktop panel
  panel: {
    background: "#111620",
    border: "1px solid #1e2a3a",
    borderRadius: "8px",
    padding: "12px",
    width: "210px",
    flexShrink: 0,
    alignSelf: "flex-start",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "10px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 4px",
    borderRadius: "4px",
    transition: "background 0.2s",
  },
  rank: {
    width: "24px",
    fontSize: "11px",
    color: "#3a5070",
    textAlign: "center",
    flexShrink: 0,
  },
  rowName: {
    flex: 1,
    fontSize: "13px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "90px",
  },
  rowCount: {
    fontSize: "12px",
    color: "#7090b0",
    fontFamily: "'Share Tech Mono', monospace",
  },
  emptyPanel: {
    fontSize: "12px",
    color: "#3a5070",
    fontFamily: "'Share Tech Mono', monospace",
    textAlign: "center",
    padding: "20px 0",
  },

  // Mobile/tablet horizontal chips
  mobileWrapper: {
    background: "#111620",
    border: "1px solid #1e2a3a",
    borderRadius: "8px",
    padding: "10px 12px",
  },
  mobileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "8px",
  },
  chipRow: {
    display: "flex",
    gap: "6px",
    overflowX: "auto",
    paddingBottom: "4px",
    WebkitOverflowScrolling: "touch",
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    borderRadius: "20px",
    padding: "4px 10px",
    flexShrink: 0,
    cursor: "default",
  },
  chipRank: {
    fontSize: "9px",
    color: "#3a5070",
    fontFamily: "'Share Tech Mono', monospace",
  },
  chipName: {
    fontSize: "12px",
    fontFamily: "'Share Tech Mono', monospace",
    maxWidth: "70px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  chipCount: {
    fontSize: "11px",
    color: "#7090b0",
    fontFamily: "'Share Tech Mono', monospace",
  },

  // Shared
  sectionLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "10px",
    color: "#4a6080",
    letterSpacing: "2px",
  },
  sectionSub: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "9px",
    color: "#2a3a50",
  },
  empty: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "11px",
    color: "#3a5070",
  },
};

export default Leaderboard;