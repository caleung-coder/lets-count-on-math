import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "pattern_block_counting"
const TEMPLATE_KEY = "pattern_block_counting"

type Variant = {
  labelPlural: string
  labelSingular: string
  symbol: string
  count: number
}

const VARIANTS: Variant[] = [
  { labelPlural: "triangles", labelSingular: "triangle", symbol: "▲", count: 3 },
  { labelPlural: "triangles", labelSingular: "triangle", symbol: "▲", count: 4 },
  { labelPlural: "triangles", labelSingular: "triangle", symbol: "▲", count: 5 },

  { labelPlural: "squares", labelSingular: "square", symbol: "■", count: 3 },
  { labelPlural: "squares", labelSingular: "square", symbol: "■", count: 4 },
  { labelPlural: "squares", labelSingular: "square", symbol: "■", count: 5 },

  { labelPlural: "hexagons", labelSingular: "hexagon", symbol: "⬢", count: 3 },
  { labelPlural: "hexagons", labelSingular: "hexagon", symbol: "⬢", count: 4 },
  { labelPlural: "hexagons", labelSingular: "hexagon", symbol: "⬢", count: 5 },

  { labelPlural: "trapezoids", labelSingular: "trapezoid", symbol: "⏢", count: 3 },
  { labelPlural: "trapezoids", labelSingular: "trapezoid", symbol: "⏢", count: 4 },
  { labelPlural: "trapezoids", labelSingular: "trapezoid", symbol: "⏢", count: 5 },

  { labelPlural: "rhombuses", labelSingular: "rhombus", symbol: "◆", count: 3 },
  { labelPlural: "rhombuses", labelSingular: "rhombus", symbol: "◆", count: 4 },
  { labelPlural: "rhombuses", labelSingular: "rhombus", symbol: "◆", count: 5 }
]

type PositionMode = "top_left" | "top_right" | "bottom_left" | "bottom_right"

let lastPatternBlockPosition: PositionMode | null = null

function numberWord(n: number): string {
  const words = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten"
  ]
  return words[n] ?? String(n)
}

function sampleDistinct(values: number[], count: number): number[] {
  return shuffle([...values]).slice(0, count)
}

function choosePositionMode(feasible: PositionMode[]): PositionMode {
  const withoutLast =
    lastPatternBlockPosition === null
      ? feasible
      : feasible.filter(mode => mode !== lastPatternBlockPosition)

  const chosen =
    withoutLast.length > 0 ? chooseOne(withoutLast) : chooseOne(feasible)

  lastPatternBlockPosition = chosen
  return chosen
}

function buildSortedChoices(correct: number, maxValue: number): string[] {
  const lowerPool: number[] = []
  const upperPool: number[] = []

  for (let i = 0; i < correct; i += 1) lowerPool.push(i)
  for (let i = correct + 1; i <= maxValue; i += 1) upperPool.push(i)

  const feasible: PositionMode[] = []

  if (upperPool.length >= 3) feasible.push("top_left")
  if (lowerPool.length >= 1 && upperPool.length >= 2) feasible.push("top_right")
  if (lowerPool.length >= 2 && upperPool.length >= 1) feasible.push("bottom_left")
  if (lowerPool.length >= 3) feasible.push("bottom_right")

  const mode = choosePositionMode(feasible)

  if (mode === "top_left") {
    return [correct, ...sampleDistinct(upperPool, 3)]
      .sort((a, b) => a - b)
      .map(String)
  }

  if (mode === "top_right") {
    return [
      ...sampleDistinct(lowerPool, 1),
      correct,
      ...sampleDistinct(upperPool, 2)
    ]
      .sort((a, b) => a - b)
      .map(String)
  }

  if (mode === "bottom_left") {
    return [
      ...sampleDistinct(lowerPool, 2),
      correct,
      ...sampleDistinct(upperPool, 1)
    ]
      .sort((a, b) => a - b)
      .map(String)
  }

  return [...sampleDistinct(lowerPool, 3), correct]
    .sort((a, b) => a - b)
    .map(String)
}

function explanationFor(variant: Variant): string {
  if (variant.count === 1) {
    return `There is one ${variant.labelSingular}.`
  }

  return `There are ${numberWord(variant.count)} ${variant.labelPlural}.`
}

export function generatePatternBlockCountingQuestion(
  difficulty: Difficulty
): Question {
  const pool =
    difficulty === 1
      ? VARIANTS.filter(v => v.count >= 3 && v.count <= 5)
      : VARIANTS

  const variant = chooseOne(pool)
  const options = buildSortedChoices(variant.count, 10)
  const correctIndex = options.findIndex(option => Number(option) === variant.count)

  return {
    prompt: `How many ${variant.labelPlural}?`,
    options,
    correctIndex,
    explanation: explanationFor(variant),
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "pattern_block_counting",
      symbol: variant.symbol,
      count: variant.count
    }
  } as Question
}