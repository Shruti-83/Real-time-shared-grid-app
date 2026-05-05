import { useRef } from "react";

function Cell({ cell, onClick, size }) {
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      onClick={onClick}
      title={cell?.ownerName ? `Owned by ${cell.ownerName}` : "Unclaimed — click to capture"}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: cell?.ownerColor || "#111820",
        cursor: "pointer",
        borderRadius: "1px",
        transition: "transform 0.08s ease, filter 0.08s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.4)";
        e.currentTarget.style.filter = "brightness(1.6)";
        e.currentTarget.style.zIndex = "10";
        e.currentTarget.style.position = "relative";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.filter = "brightness(1)";
        e.currentTarget.style.zIndex = "auto";
        e.currentTarget.style.position = "static";
      }}
    />
  );
}

export default Cell;