// src/components/Cell.jsx
function Cell({ cell, onClick }) {
  return (
    <div
      onClick={onClick}
      title={cell?.ownerName || "Unclaimed"}
      style={{
        width: "15px",
        height: "15px",
        backgroundColor: cell?.ownerColor || "#111820",
        cursor: "pointer",
        borderRadius: "1px",
        transition: "transform 0.1s, filter 0.1s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.35)";
        e.currentTarget.style.filter = "brightness(1.5)";
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