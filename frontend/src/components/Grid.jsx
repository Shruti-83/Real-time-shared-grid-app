// src/components/Grid.jsx
import Cell from "./Cell";

function Grid({ grid, onClick }) {
  const claimed = grid.filter(Boolean).length;
  const total = grid.length;
  const pct = total > 0 ? Math.round((claimed / total) * 100) : 0;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: "10px",
          color: "#4a6080",
          letterSpacing: "3px",
          textTransform: "uppercase",
          fontFamily: "'Share Tech Mono', monospace",
          marginBottom: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Territory Grid — 40×40</span>
        <span style={{ color: "#3a5a7a" }}>
          {claimed}/{total} cells
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(40, 15px)",
          gap: "1px",
          background: "#0d1117",
          border: "1px solid #1e2a3a",
          borderRadius: "8px",
          padding: "4px",
        }}
      >
        {grid.map((cell, i) => (
          <Cell key={i} cell={cell} onClick={() => onClick(i)} />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            color: "#3a5070",
            fontFamily: "'Share Tech Mono', monospace",
            marginBottom: "4px",
          }}
        >
          <span>Territory claimed</span>
          <span>{pct}%</span>
        </div>
        <div
          style={{
            height: "6px",
            background: "#1a2230",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "linear-gradient(90deg, #1e5fa0, #4a9fe0)",
              borderRadius: "3px",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Grid;