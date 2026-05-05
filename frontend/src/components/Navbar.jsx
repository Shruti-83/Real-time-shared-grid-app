// src/components/Navbar.jsx
function Navbar({ user, online, cooldown }) {
  return (
    <nav
      style={{
        background: "linear-gradient(90deg, #0a0c10 0%, #0d1220 100%)",
        borderBottom: "1px solid #1e2a3a",
        padding: "0 20px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      {/* LEFT — logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            background: "linear-gradient(135deg, #4a9fe0, #1e5fa0)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1" fill="white" opacity="0.9" />
            <rect x="9" y="1" width="6" height="6" rx="1" fill="white" opacity="0.5" />
            <rect x="1" y="9" width="6" height="6" rx="1" fill="white" opacity="0.5" />
            <rect x="9" y="9" width="6" height="6" rx="1" fill="white" opacity="0.9" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "15px",
            fontWeight: 700,
            color: "#c8d8f0",
            letterSpacing: "2px",
          }}
        >
          GRIDWAR
        </span>
        <span
          style={{
            fontSize: "10px",
            background: "#1e3050",
            color: "#4a9fe0",
            padding: "2px 7px",
            borderRadius: "4px",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "1px",
          }}
        >
          LIVE
        </span>
      </div>

      {/* CENTER — cooldown pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#111620",
          border: "1px solid #1e2a3a",
          borderRadius: "20px",
          padding: "5px 16px",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke={cooldown > 0 ? "#ffb347" : "#3ddc84"} strokeWidth="1.5" />
          <line
            x1="6" y1="6"
            x2="6" y2="2.5"
            stroke={cooldown > 0 ? "#ffb347" : "#3ddc84"}
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              transformOrigin: "6px 6px",
              transform: cooldown > 0 ? `rotate(${((1 - cooldown / 1800) * 360)}deg)` : "none",
            }}
          />
        </svg>
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "13px",
            color: cooldown > 0 ? "#ffb347" : "#3ddc84",
            minWidth: "80px",
            textAlign: "center",
          }}
        >
          {cooldown > 0 ? `WAIT ${(cooldown / 1000).toFixed(1)}s` : "READY TO FIRE"}
        </span>
      </div>

      {/* RIGHT — user + online */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#3ddc84",
              boxShadow: "0 0 6px #3ddc84",
              animation: "navpulse 1.5s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "12px",
              color: "#4a6080",
            }}
          >
            {online} online
          </span>
        </div>

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: user.color,
                border: "2px solid #1e2a3a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                color: "#fff",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              {user.name.slice(-2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#c0cce0", lineHeight: 1.2 }}>
                {user.name}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#3a5070",
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                {user.userId.slice(0, 10)}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes navpulse {
          0%,100%{opacity:1} 50%{opacity:0.3}
        }
      `}</style>
    </nav>
  );
}

export default Navbar;