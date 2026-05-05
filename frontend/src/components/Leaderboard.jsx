// src/components/Leaderboard.jsx
function Leaderboard({ leaderboard, currentUserId }) {
  const max = leaderboard.length > 0 ? leaderboard[0].count || 1 : 1;

  return (
    <div
      style={{
        background: "#111620",
        border: "1px solid #1e2a3a",
        borderRadius: "8px",
        padding: "12px",
        width: "200px",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: "10px",
          color: "#4a6080",
          letterSpacing: "2px",
          fontFamily: "'Share Tech Mono', monospace",
          marginBottom: "10px",
          textTransform: "uppercase",
        }}
      >
        Leaderboard
      </div>

      {leaderboard.length === 0 && (
        <div
          style={{
            fontSize: "12px",
            color: "#3a5070",
            fontFamily: "'Share Tech Mono', monospace",
            textAlign: "center",
            padding: "16px 0",
          }}
        >
          No captures yet
        </div>
      )}

   {leaderboard.map((user, i) => {
  const isMe = user.userId === currentUserId;
  const barW = max > 0
    ? Math.round(((user.count || 0) / max) * 100)
    : 0;

  return (
    <div key={user.userId || i}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px",
          borderBottom: "1px solid #1a2230",
          background: isMe ? "#1a2230" : "transparent",
          borderRadius: "4px",
          transition: "background 0.2s",
        }}
      >
        <span style={{ width: "16px", fontSize: "11px", color: "#2a3a50" }}>
          {i + 1}
        </span>

        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: user.color,
          }}
        />

        <span
          style={{
            flex: 1,
            fontSize: "13px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90px",
            color: isMe ? "#f0c060" : "#c0cce0",
          }}
        >
          {isMe ? "YOU" : user.name}
        </span>

        <span style={{ fontSize: "12px", color: "#7090b0" }}>
          {user.count || 0}
        </span>
      </div>

      <div style={{ height: "3px", background: "#1a2230" }}>
        <div
          style={{
            height: "100%",
            width: `${barW}%`,
            background: user.color,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
})}
    </div>
  );
}

export default Leaderboard;