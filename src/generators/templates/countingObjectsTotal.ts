import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "counting_objects_total"
const TEMPLATE_KEY = "counting_objects_total"

type ObjectSet = {
  firstLabelPlural: string
  firstEmoji: string
  secondLabelPlural: string
  secondEmoji: string
}

const OBJECT_SETS: ObjectSet[] = [
  {
    firstLabelPlural: "cats",
    firstEmoji: "🐱",
    secondLabelPlural: "dogs",
    secondEmoji: "🐶"
  },
  {
    firstLabelPlural: "shirts",
    firstEmoji: "👕",
    secondLabelPlural: "hats",
    secondEmoji: "🧢"
  },
  {
    firstLabelPlural: "pizza slices",
    firstEmoji: "🍕",
    secondLabelPlural: "apples",
    secondEmoji: "🍎"
  },
  {
    firstLabelPlural: "soccer balls",
    firstEmoji: "⚽",
    secondLabelPlural: "basketballs",
    secondEmoji: "🏀"
  }
]

type PositionMode = "top_left" | "top_right" | "bottom_left" | "bottom_right"

let lastCountingTotalPosition: PositionMode | null = null

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
    lastCountingTotalPosition === null
      ? feasible
      : feasible.filter(mode => mode !== lastCountingTotalPosition)

  const chosen =
    withoutLast.length > 0 ? chooseOne(withoutLast) : chooseOne(feasible)

  lastCountingTotalPosition = chosen
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

export function generateCountingObjectsTotalQuestion(
  difficulty: Difficulty
): Question {
  const objectSet = chooseOne(OBJECT_SETS)

  const maxGroup =
    difficulty === 1 ? 5 :
    difficulty === 2 ? 6 :
    difficulty === 3 ? 7 :
    8

  let firstCount = Math.floor(Math.random() * maxGroup) + 1
  let secondCount = Math.floor(Math.random() * maxGroup) + 1
  let total = firstCount + secondCount

  while (total > 10) {
    firstCount = Math.floor(Math.random() * maxGroup) + 1
    secondCount = Math.floor(Math.random() * maxGroup) + 1
    total = firstCount + secondCount
  }

  const targetFirst = Math.random() < 0.5
  const options = buildSortedChoices(total, 10)
  const correctIndex = options.findIndex(option => Number(option) === total)

  return {
    prompt: "How many items altogether?",
    options,
    correctIndex,
    explanation: `There are ${numberWord(total)} altogether. ${firstCount} + ${secondCount} = ${total}.`,
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "counting_groups",
      targetEmoji: objectSet.firstEmoji,
      targetCount: firstCount,
      distractorEmoji: objectSet.secondEmoji,
      distractorCount: secondCount,
      targetFirst
    }
  } as Question
}