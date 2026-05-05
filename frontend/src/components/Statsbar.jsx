import { useBreakpoint } from "../hooks/useBreakpoint";

function Statsbar({ stats, online, cooldown, yourCount }) {
  const { isMobile } = useBreakpoint();

  const items = [
    {
      label: "Claimed",
      value: `${stats?.claimed ?? 0}/${stats?.total ?? 1000}`,
      color: "#3ddc84",
      sub: `${stats?.percentClaimed ?? "0.0"}%`,
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
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
      gap: "8px",
      marginBottom: "12px",
    }}>
      {items.map(({ label, value, color, sub }) => (
        <div key={label} style={styles.card}>
          <span style={styles.label}>{label}</span>
          <span style={{ ...styles.value, color, fontSize: isMobile ? "16px" : "20px" }}>
            {value}
          </span>
          {sub && <span style={styles.sub}>{sub}</span>}
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    background: "#111620",
    border: "1px solid #1e2a3a",
    borderRadius: "8px",
    padding: "8px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  label: {
    fontSize: "9px",
    color: "#4a6080",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Share Tech Mono', monospace",
  },
  value: {
    fontWeight: 700,
    fontFamily: "'Share Tech Mono', monospace",
    lineHeight: 1.2,
  },
  sub: {
    fontSize: "10px",
    color: "#3a5070",
    fontFamily: "'Share Tech Mono', monospace",
  },
};

export default Statsbar;