type TenFrameProps = {
  count: number
  emoji?: string
  compact?: boolean
}

export default function TenFrame({
  count,
  emoji,
  compact = false
}: TenFrameProps) {
  const safeCount = Math.max(0, Math.min(10, count))

  const cellSize = compact ? 30 : 52
  const outerBorder = compact ? "2px solid #555" : "2px solid #444"
  const innerBorder = compact ? "1px solid #d7d7d7" : "1px solid #dddddd"
  const dotSize = compact ? 10 : 18
  const emojiSize = compact ? 18 : 28
  const radius = compact ? 8 : 14

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(5, ${cellSize}px)`,
        gridTemplateRows: `repeat(2, ${cellSize}px)`,
        width: "fit-content",
        margin: "0 auto",
        border: outerBorder,
        borderRadius: radius,
        overflow: "hidden",
        background: "#ffffff",
        boxSizing: "border-box"
      }}
    >
      {Array.from({ length: 10 }, (_, i) => {
        const filled = i < safeCount

        return (
          <div
            key={i}
            style={{
              width: cellSize,
              height: cellSize,
              boxSizing: "border-box",
              border: innerBorder,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              background: "#ffffff"
            }}
          >
            {filled ? (
              emoji ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: emojiSize,
                    lineHeight: 1,
                    transform: compact ? "translateY(-1px)" : "none"
                  }}
                >
                  {emoji}
                </span>
              ) : (
                <div
                  style={{
                    width: dotSize,
                    height: dotSize,
                    borderRadius: "50%",
                    background: "#22313f"
                  }}
                />
              )
            ) : null}
          </div>
        )
      })}
    </div>
  )
}