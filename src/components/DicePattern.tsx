import React from "react"

type Props = {
  emoji: string
  count: number
}

const positions: Record<number, number[][]> = {
  1: [[1,1]],

  2: [
    [0,0],
    [2,2]
  ],

  3: [
    [0,0],
    [1,1],
    [2,2]
  ],

  4: [
    [0,0],
    [0,2],
    [2,0],
    [2,2]
  ],

  5: [
    [0,0],
    [0,2],
    [1,1],
    [2,0],
    [2,2]
  ],

  6: [
    [0,0],
    [1,0],
    [2,0],
    [0,2],
    [1,2],
    [2,2]
  ]
}

export default function DicePattern({ emoji, count }: Props) {

  const coords = positions[count] ?? []

  return (
    <div
      style={{
        width: 160,
        height: 160,
        borderRadius: 18,
        border: "2px solid #444",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        alignItems: "center",
        justifyItems: "center",
        fontSize: 36,
        background: "#fafafa"
      }}
    >
      {[0,1,2].map(r =>
        [0,1,2].map(c => {
          const show = coords.some(([rr,cc]) => rr===r && cc===c)

          return (
            <div key={`${r}-${c}`}>
              {show ? emoji : ""}
            </div>
          )
        })
      )}
    </div>
  )
}