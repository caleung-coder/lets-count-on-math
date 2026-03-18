import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "ten_frame_quantity"
const TEMPLATE_KEY = "ten_frame_quantity"

type VisualVariant = {
  labelPlural: string
  labelSingular: string
  emoji?: string
}

const VISUAL_VARIANTS: VisualVariant[] = [
  { labelPlural: "dots", labelSingular: "dot" },
  { labelPlural: "cats", labelSingular: "cat", emoji: "🐱" },
  { labelPlural: "dogs", labelSingular: "dog", emoji: "🐶" },
  { labelPlural: "apples", labelSingular: "apple", emoji: "🍎" },
  { labelPlural: "pizza slices", labelSingular: "pizza slice", emoji: "🍕" }
]

type PositionMode = "top_left" | "top_right" | "bottom_left" | "bottom_right"

let lastTenFramePosition: PositionMode | null = null

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
    lastTenFramePosition === null
      ? feasible
      : feasible.filter(mode => mode !== lastTenFramePosition)

  const chosen =
    withoutLast.length > 0 ? chooseOne(withoutLast) : chooseOne(feasible)

  lastTenFramePosition = chosen
  return chosen
}

function buildSortedChoices(correct: number, maxValue: number): string[] {
  const lowerPool: number[] = []
  const upperPool: number[] = []

  for (let i = 0; i < correct; i += 1) {
    lowerPool.push(i)
  }

  for (let i = correct + 1; i <= maxValue; i += 1) {
    upperPool.push(i)
  }

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

function explanationLabel(count: number, variant: VisualVariant): string {
  return count === 1 ? variant.labelSingular : variant.labelPlural
}

export function generateTenFrameQuantityQuestion(
  difficulty: Difficulty
): Question {
  const maxCount = 10

  const count = Math.floor(Math.random() * maxCount) + 1
  const variant = chooseOne(VISUAL_VARIANTS)
  const options = buildSortedChoices(count, 10)
  const correctIndex = options.findIndex(option => Number(option) === count)

  return {
    prompt: `How many ${variant.labelPlural}?`,
    options,
    correctIndex,
    explanation: `There ${count === 1 ? "is" : "are"} ${numberWord(count)} ${explanationLabel(count, variant)}.`,
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "ten_frame",
      count,
      emoji: variant.emoji ?? null
    }
  } as Question
}