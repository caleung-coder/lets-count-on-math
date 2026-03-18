type AlignedComparisonGroupsProps = {
  topEmoji: string
  topCount: number
  bottomEmoji: string
  bottomCount: number
}

export default function AlignedComparisonGroups({
  topEmoji,
  topCount,
  bottomEmoji,
  bottomCount
}: AlignedComparisonGroupsProps) {
  const totalColumns = Math.max(topCount, bottomCount)

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "repeat(2, 1fr)",
        rowGap: 8,
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 6
      }}
    >
      {[0, 1].map(row => (
        <div
          key={row}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${totalColumns}, 42px)`,
            columnGap: 4,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {Array.from({ length: totalColumns }, (_, i) => {
            const show =
              row === 0
                ? i < topCount
                : i >= totalColumns - bottomCount

            const emoji =
              row === 0 ? topEmoji : bottomEmoji

            return (
              <span
                key={`${row}-${i}`}
                style={{
                  width: 42,
                  height: 42,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  lineHeight: 1
                }}
              >
                {show ? emoji : ""}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}