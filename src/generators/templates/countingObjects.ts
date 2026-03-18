import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "counting_objects"
const TEMPLATE_KEY = "counting_objects"

type ObjectSet = {
  labelPlural: string
  labelSingular: string
  emoji: string
}

const OBJECTS: ObjectSet[] = [
  { labelPlural: "cats", labelSingular: "cat", emoji: "🐱" },
  { labelPlural: "dogs", labelSingular: "dog", emoji: "🐶" },
  { labelPlural: "apples", labelSingular: "apple", emoji: "🍎" },
  { labelPlural: "bananas", labelSingular: "banana", emoji: "🍌" },
  { labelPlural: "cars", labelSingular: "car", emoji: "🚗" },
  { labelPlural: "bears", labelSingular: "bear", emoji: "🐻" }
]

function buildChoices(correct: number): string[] {
  const choices = new Set<number>()
  choices.add(correct)

  while (choices.size < 4) {
    const delta = Math.floor(Math.random() * 4) - 1
    const guess = Math.max(0, Math.min(10, correct + delta))
    choices.add(guess)
  }

  return shuffle([...choices]).map(String)
}

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

function explanationFor(
  singular: string,
  plural: string,
  count: number
): string {
  if (count === 1) {
    return `There is one ${singular}.`
  }

  return `There are ${numberWord(count)} ${plural}.`
}

function buildScatteredItems(emoji: string, count: number) {
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

  const positions = shuffle([...grid]).slice(0, count)

  return positions.map(pos => ({
    emoji,
    x: pos.x,
    y: pos.y
  }))
}

export function generateCountingObjectsQuestion(
  difficulty: Difficulty
): Question {
  const object = chooseOne(OBJECTS)

  const maxCount =
    difficulty === 1 ? 6 :
    difficulty === 2 ? 8 :
    difficulty === 3 ? 9 :
    10

  const count = Math.floor(Math.random() * maxCount) + 1

  const options = buildChoices(count)
  const correctIndex = options.findIndex(x => Number(x) === count)

  const visual =
    count <= 6
      ? {
          type: "dice_pattern",
          emoji: object.emoji,
          count
        }
      : {
          type: "scattered_counting",
          items: buildScatteredItems(object.emoji, count),
          width: 260,
          height: 160
        }

  return {
    prompt: `How many ${object.labelPlural} are there?`,
    options,
    correctIndex,
    explanation: explanationFor(
      object.labelSingular,
      object.labelPlural,
      count
    ),
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual
  } as Question
}