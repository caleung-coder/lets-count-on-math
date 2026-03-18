import React from "react"

type Shape =
  | "triangle"
  | "square"
  | "hexagon"
  | "trapezoid"
  | "rhombus"

interface Props {
  shape: Shape
  side?: number
}

export default function PatternBlock({ shape, side = 28 }: Props) {

  const stroke = "#222"
  const strokeWidth = 0.7

  const h = Math.sqrt(3) / 2 * side

  const colors: Record<Shape, string> = {
    triangle: "#43A047",
    square: "#F57C00",
    hexagon: "#FDD835",
    trapezoid: "#E53935",
    rhombus: "#1E88E5"
  }

  const fill = colors[shape]

  if (shape === "triangle") {

    const width = side
    const height = h

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <polygon
          points={`${width/2},0 ${width},${height} 0,${height}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  if (shape === "rhombus") {

    const width = side * 2
    const height = h

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <polygon
          points={`0,${height/2} ${side},0 ${width},${height/2} ${side},${height}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  if (shape === "trapezoid") {

    const width = side * 2
    const height = h

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <polygon
          points={`${side/2},0 ${side*1.5},0 ${width},${height} 0,${height}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  if (shape === "hexagon") {

    const width = side * 2
    const height = Math.sqrt(3) * side

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <polygon
          points={`
            ${side/2},0
            ${side*1.5},0
            ${width},${height/2}
            ${side*1.5},${height}
            ${side/2},${height}
            0,${height/2}
          `}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  if (shape === "square") {

    const size = side * 0.9

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          width={size}
          height={size}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  return null
}