import { useMemo, useRef, useEffect, useState } from "react";
import Cell from "./Cell";
import { useBreakpoint } from "../hooks/useBreakpoint";

const COLS = 40;
const ROWS = 25;

function Grid({ grid, onClick }) {
  const { isMobile, isTablet, width } = useBreakpoint();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(width);

  // Measure actual container width for precise cell sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Cell size: fill available width, but cap on desktop
  const cellSize = useMemo(() => {
    const gap = 1; // 1px gap between cells
    const totalGap = (COLS - 1) * gap;
    const available = containerWidth - totalGap;
    const computed = Math.floor(available / COLS);

    if (isMobile) return Math.max(6, Math.min(computed, 9));
    if (isTablet) return Math.max(9, Math.min(computed, 13));
    return Math.max(13, Math.min(computed, 16)); // desktop
  }, [containerWidth, isMobile, isTablet]);

  const gridPx = cellSize * COLS + (COLS - 1);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Grid label */}
      <div style={styles.label}>
        <span style={styles.labelText}>TERRITORY MAP</span>
        <span style={styles.labelSub}>{COLS}×{ROWS} · {COLS * ROWS} BLOCKS</span>
      </div>

      {/* Scrollable container on small screens */}
      <div
        style={{
          overflowX: isMobile ? "auto" : "visible",
          overflowY: "visible",
          WebkitOverflowScrolling: "touch",
          paddingBottom: "4px",
        }}
      >
        <div
          ref={containerRef}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
            gap: "1px",
            background: "#0d1018",
            border: "1px solid #1e2a3a",
            borderRadius: "6px",
            padding: "4px",
            width: isMobile ? `${gridPx + 8}px` : "100%",
            maxWidth: isMobile ? "none" : `${gridPx + 8}px`,
          }}
        >
          {grid.map((cell, i) => (
            <Cell
              key={i}
              cell={cell}
              size={cellSize}
              onClick={() => onClick(i)}
            />
          ))}
        </div>
      </div>

      {isMobile && (
        <p style={styles.scrollHint}>← Scroll to see full map →</p>
      )}
    </div>
  );
}

const styles = {
  label: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    marginBottom: "6px",
  },
  labelText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "10px",
    color: "#4a6080",
    letterSpacing: "2px",
  },
  labelSub: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "9px",
    color: "#2a3a50",
    letterSpacing: "1px",
  },
  scrollHint: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "9px",
    color: "#2a3a50",
    textAlign: "center",
    marginTop: "6px",
    letterSpacing: "1px",
  },
};

export default Grid;