type Props = {
  option: unknown
}

const GEOMETRY_OPTIONS = new Set([
  "◺ Right triangle",
  "△ Isosceles triangle",
  "◿ Scalene triangle",
  "□ Square",
  "▭ Rectangle",
  "◇ Rhombus",
  "▱ Parallelogram",
  "○ Small circle",
  "◯ Big circle",
  "⬭ Ellipse",
  "⬠ Pentagon",
  "⬡ Hexagon"
])

const TEXT_ONLY_OPTIONS = new Set([
  "🍕 Pizza slice",
  "👕 Shirt",
  "🍎 Apple",
  "🍌 Banana",
  "🧢 Cap",
  "👟 Shoe",
  "👖 Pants",
  "🧥 Jacket",
  "🚗 Car",
  "🚌 Bus",
  "🚲 Bicycle",
  "⚽ Soccer ball",
  "🏀 Basketball",
  "🎾 Tennis ball",
  "🐦 Bird",
  "🦅 Eagle",
  "🕊️ Dove",
  "✈️ Airplane",
  "🚁 Helicopter",
  "🛩️ Small plane",
  "🐱 Cat",
  "🐶 Dog",
  "🐰 Rabbit",
  "🍪 Cookie"
])

function renderShape(option: string) {
  const stroke = "#222"
  const strokeWidth = 3

  switch (option) {

  case "◺ Right triangle":
  return (
    <svg width={36} height={32} viewBox="0 0 36 32">
      <polygon
        points="6,28 6,8 30,28"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
      />
    </svg>
  )
  
    case "◿ Scalene triangle":
      return (
        <svg width={36} height={32} viewBox="0 0 36 32">
          <polygon
            points="6,28 14,6 30,28"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="miter"
          />
        </svg>
      )

case "△ Isosceles triangle":
  return (
    <svg width={36} height={36} viewBox="0 0 36 36">
      <polygon
        points="18,2 30,34 6,34"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
      />
    </svg>
  )

    case "□ Square":
      return (
        <svg width={34} height={34} viewBox="0 0 34 34">
          <rect
            x="2"
            y="2"
            width="30"
            height="30"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    case "▭ Rectangle":
      return (
        <svg width={40} height={28} viewBox="0 0 40 28">
          <rect
            x="2"
            y="2"
            width="36"
            height="24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    case "◇ Rhombus":
      return (
        <svg width={36} height={32} viewBox="0 0 36 32">
          <polygon
            points="18,4 32,16 18,28 4,16"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    case "▱ Parallelogram":
      return (
        <svg width={48} height={28} viewBox="0 0 48 28">
          <polygon
            points="14,4 44,4 32,24 4,24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="miter"
          />
        </svg>
      )

    case "○ Small circle":
      return (
        <svg width={32} height={32}>
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    case "◯ Big circle":
      return (
        <svg width={60} height={60}>
          <circle
            cx="30"
            cy="30"
            r="24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    case "⬭ Ellipse":
      return (
        <svg width={44} height={32}>
          <ellipse
            cx="22"
            cy="16"
            rx="18"
            ry="12"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    case "⬠ Pentagon":
      return (
        <svg width={36} height={36} viewBox="0 0 36 36">
          <polygon
            points="18,4 32,14 26,32 10,32 4,14"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    case "⬡ Hexagon":
      return (
        <svg width={36} height={32} viewBox="0 0 36 32">
          <polygon
            points="10,2 26,2 34,16 26,30 10,30 2,16"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </svg>
      )

    default:
      return null
  }
}

function renderTextOnlyOption(option: string) {
  const firstSpace = option.indexOf(" ")
  const emoji = firstSpace >= 0 ? option.slice(0, firstSpace) : option
  const label = firstSpace >= 0 ? option.slice(firstSpace + 1) : ""

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        width: "100%",
        padding: "0 8px",
        boxSizing: "border-box",
        textAlign: "center"
      }}
    >
      <span
        style={{
          fontSize: 32,
          lineHeight: 1,
          flex: "0 0 auto"
        }}
      >
        {emoji}
      </span>

      <span
        style={{
          fontSize: 19,
          fontWeight: 500,
          lineHeight: 1.15,
          textAlign: "left",
          maxWidth: 130
        }}
      >
        {label}
      </span>
    </div>
  )
}

function renderPlainTextOption(text: string) {
  const isSequence = /^[0-9,\s]+$/.test(text)

  let fontSize = 32
  let whiteSpace: "normal" | "nowrap" = "normal"
  let lineHeight = 1.15

  if (isSequence) {
    fontSize = 26
    whiteSpace = "nowrap"
    lineHeight = 1.05
  } else if (text.length >= 11) {
    fontSize = 22
  } else if (text.length >= 8) {
    fontSize = 26
  }

  return (
    <span
      style={{
        fontSize,
        fontWeight: 400,
        textAlign: "center",
        whiteSpace,
        lineHeight,
        display: "inline-block",
        maxWidth: "100%"
      }}
    >
      {text}
    </span>
  )
}

export default function MathOption({ option }: Props) {
  if (typeof option !== "string") {
    return <span>{String(option)}</span>
  }

  if (TEXT_ONLY_OPTIONS.has(option)) {
    return renderTextOnlyOption(option)
  }

  if (!GEOMETRY_OPTIONS.has(option)) {
    return renderPlainTextOption(option)
  }

  const firstSpace = option.indexOf(" ")
  const label = firstSpace >= 0 ? option.slice(firstSpace + 1) : ""

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8
      }}
    >
      {renderShape(option)}
      <span style={{ fontSize: 16 }}>{label}</span>
    </div>
  )
}