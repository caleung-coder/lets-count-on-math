import React from "react"

type FractionProps = {
  numerator: number
  denominator: number
  whole?: number
}

function FractionCore({
  numerator,
  denominator
}: {
  numerator: number
  denominator: number
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1
      }}
    >
      <span
        style={{
          fontSize: "0.9em",
          fontWeight: 500
        }}
      >
        {numerator}
      </span>

      <span
        style={{
          borderTop: "2px solid currentColor",
          width: "1.25em",
          margin: "2px 0"
        }}
      />

      <span
        style={{
          fontSize: "0.9em",
          fontWeight: 500
        }}
      >
        {denominator}
      </span>
    </span>
  )
}

export default function Fraction({ numerator, denominator, whole }: FractionProps) {
  if (whole === undefined) {
    return <FractionCore numerator={numerator} denominator={denominator} />
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px"
      }}
    >
      <span
        style={{
          fontSize: "1.5em",
          fontWeight: 500,
          lineHeight: 1
        }}
      >
        {whole}
      </span>

      <FractionCore numerator={numerator} denominator={denominator} />
    </span>
  )
}