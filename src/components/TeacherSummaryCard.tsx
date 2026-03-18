
type DashboardRow = {
  key: string
  seen: number
  correct: number
  missed: number
  percent: number
}

type TeacherSummaryCardProps = {
  rows: DashboardRow[]
  getConceptLabel: (key: string) => string
}

const SAY_THIS: Record<string, string[]> = {
  which_one_doesnt_belong: [
    "What belongs together?",
    "Why does this one not belong?"
  ],
  ten_frame_quantity: [
    "What do you notice about the ten-frame?",
    "Do you see a 5 and some more?"
  ],
  counting_objects: [
    "Touch and count each item.",
    "How many are there?"
  ],
  ordinal_position: [
    "Let’s look at the row together.",
    "Which one is first, second, third, or fourth?"
  ],
  which_group_has_more: [
    "Let’s count both groups.",
    "Which group has MORE?"
  ],
  visual_pattern_recognition: [
    "What is repeating?",
    "Which part stays the same again and again?"
  ],
  scattered_counting_objects: [
    "Point as you count.",
    "How can we keep track so we do not skip any?"
  ],
  probability_likelihood: [
    "What outcomes are possible?",
    "Would that be impossible, unlikely, likely, or certain?"
  ],
  composing_5: [
    "Which pairs make 5?",
    "What two parts go together to make 5?"
  ],
  more_fewer_objects: [
    "Let’s count both groups.",
    "Which group has MORE? Which group has LESS?"
  ],
  shape_classification: [
    "What do these shapes have in common?",
    "Which one is different, and why?"
  ],
  counting_objects_total: [
    "Let’s count everything altogether.",
    "How many items are there in total?"
  ],
  pattern_block_counting: [
    "What shape are we counting?",
    "How many pattern blocks are there?"
  ],
  composing_10: [
    "Which pairs make 10?",
    "What two parts go together to make 10?"
  ],
  measurement_classification: [
    "What kind of measurement is this?",
    "Which one belongs to a different kind of measurement?"
  ],
  compare_quantities: [
    "Let’s compare all the groups.",
    "Which group has the most?"
  ],
  comparison_difference: [
    "How many more are needed to make them equal?",
    "What is left over?"
  ],
  number_sequences: [
    "What is the step each time?",
    "Which sequence is not like the others?"
  ],
  visual_pattern_next: [
    "What is repeating?",
    "What comes next?"
  ],
  classification_counting: [
    "Which items belong to the category?",
    "How many of that kind do you see?"
  ]
}

const TRY_THIS: Record<string, string[]> = {
  which_one_doesnt_belong: [
    "Show 4 objects and ask which belong together."
  ],
  ten_frame_quantity: [
    "Use counters in a ten-frame and ask, “How many do you see?”"
  ],
  counting_objects: [
    "Count small sets of like items together."
  ],
  ordinal_position: [
    "Line up 4 objects and ask for first, second, third, or fourth."
  ],
  which_group_has_more: [
    "Put out two small groups and ask which has MORE."
  ],
  visual_pattern_recognition: [
    "Build a simple repeating pattern and ask what is repeating."
  ],
  scattered_counting_objects: [
    "Spread out counters and practise careful counting."
  ],
  probability_likelihood: [
    "Use a small set of items and ask what is likely or impossible."
  ],
  composing_5: [
    "Build 5 with counters in different ways."
  ],
  more_fewer_objects: [
    "Compare two groups and ask which has MORE or LESS."
  ],
  shape_classification: [
    "Sort shapes by shared attributes."
  ],
  counting_objects_total: [
    "Put two groups together and ask how many items altogether."
  ],
  pattern_block_counting: [
    "Count one kind of pattern block and name the shape."
  ],
  composing_10: [
    "Build 10 with counters or fingers in different ways."
  ],
  measurement_classification: [
    "Sort words or tools by what they measure."
  ],
  compare_quantities: [
    "Show three groups and ask which has the most."
  ],
  comparison_difference: [
    "Make two groups and ask how many more are needed to match."
  ],
  number_sequences: [
    "Read simple number sequences and ask what rule they follow."
  ],
  visual_pattern_next: [
    "Make a repeating pattern and ask what comes next."
  ],
  classification_counting: [
    "Mix categories and ask how many belong to one kind."
  ]
}

function pickStrongest(rows: DashboardRow[]) {
  const sorted = [...rows].sort((a, b) => {
    if (b.percent !== a.percent) return b.percent - a.percent
    return b.seen - a.seen
  })
  return sorted.slice(0, 2)
}

function pickNeedsSupport(rows: DashboardRow[]) {
  const sorted = [...rows].sort((a, b) => {
    if (a.percent !== b.percent) return a.percent - b.percent
    return b.seen - a.seen
  })
  return sorted.slice(0, 2)
}

export default function TeacherSummaryCard({
  rows,
  getConceptLabel
}: TeacherSummaryCardProps) {
  if (rows.length === 0) return null

  const strongest = pickStrongest(rows)
  const needsSupport = pickNeedsSupport(rows)
  const focusKey = needsSupport[0]?.key ?? strongest[0]?.key ?? ""

  const sayThis = SAY_THIS[focusKey] ?? [
    "What are we counting?",
    "How are we counting?"
  ]

  const tryThis = TRY_THIS[focusKey] ?? [
    "Repeat a similar task with concrete materials."
  ]

  return (
    <div
      style={{
        marginTop: 16,
        border: "1px solid #d8d8d8",
        borderRadius: 12,
        padding: 14,
        background: "#ffffff",
        textAlign: "left"
      }}
    >
      <p style={{ fontSize: 14, fontWeight: 700, color: "#444", margin: 0 }}>
        Teacher Summary
      </p>

      <div style={{ marginTop: 10 }}>
        <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
          Strong
        </p>
        {strongest.map(row => (
          <p key={`strong-${row.key}`} style={{ fontSize: 13, color: "#444", margin: "4px 0 0 0" }}>
            • {getConceptLabel(row.key)}
          </p>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
          Working On
        </p>
        {needsSupport.map(row => (
          <p key={`need-${row.key}`} style={{ fontSize: 13, color: "#444", margin: "4px 0 0 0" }}>
            • {getConceptLabel(row.key)}
          </p>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
          Say This
        </p>
        {sayThis.map((line, index) => (
          <p key={`say-${index}`} style={{ fontSize: 13, color: "#444", margin: "4px 0 0 0" }}>
            • {line}
          </p>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
          Try This Next
        </p>
        {tryThis.map((line, index) => (
          <p key={`try-${index}`} style={{ fontSize: 13, color: "#444", margin: "4px 0 0 0" }}>
            • {line}
          </p>
        ))}
      </div>
    </div>
  )
}