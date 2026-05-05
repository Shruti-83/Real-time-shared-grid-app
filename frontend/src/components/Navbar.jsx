import { useBreakpoint } from "../hooks/useBreakpoint";

function Navbar({ user, online, cooldown }) {
  const { isMobile, isTablet } = useBreakpoint();
  const isSmall = isMobile || isTablet;

  return (
    <nav style={styles.nav}>
      {/* LEFT — Logo */}
      <div style={styles.logoGroup}>
        <div style={styles.logoIcon}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1" fill="white" opacity="0.9" />
            <rect x="9" y="1" width="6" height="6" rx="1" fill="white" opacity="0.5" />
            <rect x="1" y="9" width="6" height="6" rx="1" fill="white" opacity="0.5" />
            <rect x="9" y="9" width="6" height="6" rx="1" fill="white" opacity="0.9" />
          </svg>
        </div>
        {!isMobile && (
          <span style={styles.logoText}>GRIDWAR</span>
        )}
        <span style={styles.liveBadge}>LIVE</span>
      </div>

      {/* CENTER — Cooldown */}
      <div style={{
        ...styles.cooldownPill,
        padding: isMobile ? "4px 10px" : "5px 16px",
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke={cooldown > 0 ? "#ffb347" : "#3ddc84"} strokeWidth="1.5" />
          <line
            x1="6" y1="6" x2="6" y2="2.5"
            stroke={cooldown > 0 ? "#ffb347" : "#3ddc84"}
            strokeWidth="1.5" strokeLinecap="round"
          />
        </svg>
        <span style={{
          ...styles.cooldownText,
          color: cooldown > 0 ? "#ffb347" : "#3ddc84",
          fontSize: isMobile ? "11px" : "13px",
          minWidth: isMobile ? "60px" : "80px",
        }}>
          {cooldown > 0
            ? (isMobile ? `${(cooldown / 1000).toFixed(1)}s` : `WAIT ${(cooldown / 1000).toFixed(1)}s`)
            : (isMobile ? "READY" : "READY TO FIRE")}
        </span>
      </div>

      {/* RIGHT — User + Online */}
      <div style={styles.rightGroup}>
        {/* Online indicator */}
        <div style={styles.onlineGroup}>
          <div style={styles.onlineDot} />
          {!isMobile && (
            <span style={styles.onlineText}>{online} online</span>
          )}
          {isMobile && (
            <span style={styles.onlineText}>{online}</span>
          )}
        </div>

        {/* User avatar */}
        {user && (
          <div style={styles.userGroup}>
            <div style={{
              ...styles.avatar,
              background: user.color,
              width: isMobile ? "26px" : "30px",
              height: isMobile ? "26px" : "30px",
              fontSize: isMobile ? "10px" : "11px",
            }}>
              {user.name.slice(-2).toUpperCase()}
            </div>
            {!isSmall && (
              <div>
                <div style={styles.userName}>{user.name}</div>
                <div style={styles.userId}>{user.userId.slice(0, 10)}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes navpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes dotpulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }
      `}</style>
    </nav>
  );
}

const styles = {
  nav: {
    background: "linear-gradient(90deg, #0a0c10 0%, #0d1220 100%)",
    borderBottom: "1px solid #1e2a3a",
    padding: "0 16px",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 200,
    gap: "8px",
  },
  logoGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  logoIcon: {
    width: "28px",
    height: "28px",
    background: "linear-gradient(135deg, #4a9fe0, #1e5fa0)",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "15px",
    fontWeight: 700,
    color: "#c8d8f0",
    letterSpacing: "2px",
  },
  liveBadge: {
    fontSize: "10px",
    background: "#1e3050",
    color: "#4a9fe0",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: "1px",
  },
  cooldownPill: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#111620",
    border: "1px solid #1e2a3a",
    borderRadius: "20px",
    flexShrink: 0,
  },
  cooldownText: {
    fontFamily: "'Share Tech Mono', monospace",
    textAlign: "center",
  },
  rightGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },
  onlineGroup: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  onlineDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#3ddc84",
    boxShadow: "0 0 6px #3ddc84",
    animation: "dotpulse 1.5s infinite",
    flexShrink: 0,
  },
  onlineText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "11px",
    color: "#4a6080",
  },
  userGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  avatar: {
    borderRadius: "50%",
    border: "2px solid #1e2a3a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#fff",
    fontFamily: "'Share Tech Mono', monospace",
    flexShrink: 0,
  },
  userName: {
    fontSize: "12px",
    color: "#c0cce0",
    lineHeight: 1.2,
  },
  userId: {
    fontSize: "10px",
    color: "#3a5070",
    fontFamily: "'Share Tech Mono', monospace",
  },
};

export default Navbar;