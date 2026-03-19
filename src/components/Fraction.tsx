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
        lineHeight: 1,
        fontSize: "0.9em",
        minWidth: "1.4em"
      }}
    >
      <span
        style={{
          fontWeight: 500
        }}
      >
        {numerator}
      </span>

      <span
        style={{
          borderTop: "2px solid currentColor",
          width: "100%",
          margin: "2px 0"
        }}
      />

      <span
        style={{
          fontWeight: 500
        }}
      >
        {denominator}
      </span>
    </span>
  )
}

export default function Fraction({
  numerator,
  denominator,
  whole
}: FractionProps) {
  if (whole === undefined) {
    return <FractionCore numerator={numerator} denominator={denominator} />
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px"
      }}
    >
      <span
        style={{
          fontSize: "1.4em",
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