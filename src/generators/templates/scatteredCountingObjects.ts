import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "scattered_counting_objects"
const TEMPLATE_KEY = "scattered_counting_objects"

type ObjectSet = {
  targetLabelPlural: string
  targetLabelSingular: string
  targetEmoji: string
  distractorLabelPlural: string
  distractorEmoji: string
}

const OBJECT_SETS: ObjectSet[] = [
  {
    targetLabelPlural: "cats",
    targetLabelSingular: "cat",
    targetEmoji: "🐱",
    distractorLabelPlural: "dogs",
    distractorEmoji: "🐶"
  },
  {
    targetLabelPlural: "shirts",
    targetLabelSingular: "shirt",
    targetEmoji: "👕",
    distractorLabelPlural: "hats",
    distractorEmoji: "🧢"
  },
  {
    targetLabelPlural: "pizza slices",
    targetLabelSingular: "pizza slice",
    targetEmoji: "🍕",
    distractorLabelPlural: "apples",
    distractorEmoji: "🍎"
  },
  {
    targetLabelPlural: "soccer balls",
    targetLabelSingular: "soccer ball",
    targetEmoji: "⚽",
    distractorLabelPlural: "basketballs",
    distractorEmoji: "🏀"
  }
]

type PositionMode = "top_left" | "top_right" | "bottom_left" | "bottom_right"

let lastScatteredPosition: PositionMode | null = null

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
    lastScatteredPosition === null
      ? feasible
      : feasible.filter(mode => mode !== lastScatteredPosition)

  const chosen =
    withoutLast.length > 0 ? chooseOne(withoutLast) : chooseOne(feasible)

  lastScatteredPosition = chosen
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

function explanationFor(
  labelSingular: string,
  labelPlural: string,
  count: number
): string {
  if (count === 1) {
    return `There is one ${labelSingular}.`
  }

  return `There are ${numberWord(count)} ${labelPlural}.`
}

function buildScatteredItems(
  targetEmoji: string,
  targetCount: number,
  distractorEmoji: string,
  distractorCount: number
) {
  const items: Array<{ emoji: string; isTarget: boolean }> = []

  for (let i = 0; i < targetCount; i += 1) {
    items.push({ emoji: targetEmoji, isTarget: true })
  }

  for (let i = 0; i < distractorCount; i += 1) {
    items.push({ emoji: distractorEmoji, isTarget: false })
  }

  const shuffledItems = shuffle(items)

  const width = 260
  const height = 160
  const cell = 42

  const cols = Math.floor(width / cell)
  const rows = Math.floor(height / cell)

  const grid: Array<{ x: number; y: number }> = []

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      grid.push({
        x: c * cell + 6,
        y: r * cell + 6
      })
    }
  }

  const positions = shuffle(grid).slice(0, shuffledItems.length)

  return shuffledItems.map((item, index) => ({
    emoji: item.emoji,
    isTarget: item.isTarget,
    x: positions[index].x,
    y: positions[index].y
  }))
}

export function generateScatteredCountingObjectsQuestion(
  difficulty: Difficulty
): Question {
  const objectSet = chooseOne(OBJECT_SETS)

  const maxTarget =
    difficulty === 1 ? 5 :
    difficulty === 2 ? 6 :
    difficulty === 3 ? 7 :
    8

  const maxDistractor =
    difficulty === 1 ? 4 :
    difficulty === 2 ? 5 :
    difficulty === 3 ? 6 :
    7

  const targetCount = Math.floor(Math.random() * maxTarget) + 1
  const distractorCount = Math.floor(Math.random() * maxDistractor) + 1

  const options = buildSortedChoices(targetCount, 10)
  const correctIndex = options.findIndex(option => Number(option) === targetCount)

  return {
    prompt: `How many ${objectSet.targetLabelPlural}?`,
    options,
    correctIndex,
    explanation: explanationFor(
      objectSet.targetLabelSingular,
      objectSet.targetLabelPlural,
      targetCount
    ),
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "scattered_counting",
      items: buildScatteredItems(
        objectSet.targetEmoji,
        targetCount,
        objectSet.distractorEmoji,
        distractorCount
      ),
      width: 260,
      height: 160
    }
  } as Question
}