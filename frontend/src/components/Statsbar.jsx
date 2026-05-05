// src/components/StatsBar.jsx
function StatsBar({ stats, online, cooldown, yourCount }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "14px",
        flexWrap: "wrap",
      }}
    >
      {[
        {
          label: "Claimed",
          value: `${stats?.claimed ?? 0}/${stats?.total ?? 1600}`,
          color: "#3ddc84",
        },
        {
          label: "Your Cells",
          value: yourCount ?? 0,
          color: "#ffb347",
        },
        {
          label: "Online",
          value: online,
          color: "#c8d8f0",
        },
        {
          label: "Cooldown",
          value: cooldown > 0 ? `${(cooldown / 1000).toFixed(1)}s` : "Ready",
          color: cooldown > 0 ? "#ff6b6b" : "#3ddc84",
        },
      ].map(({ label, value, color }) => (
        <div
          key={label}
          style={{
            background: "#111620",
            border: "1px solid #1e2a3a",
            borderRadius: "8px",
            padding: "6px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "90px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "#4a6080",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color,
              fontFamily: "'Share Tech Mono', monospace",
              lineHeight: 1.3,
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;