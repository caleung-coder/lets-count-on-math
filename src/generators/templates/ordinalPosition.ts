import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "ordinal_position"
const TEMPLATE_KEY = "ordinal_position"

const ORDINALS = ["first", "second", "third", "fourth"] as const
type Direction = "left" | "right"

function buildOptions(): string[] {
  // Always in order (no shuffle)
  return ["first", "second", "third", "fourth"]
}

function buildQuestion(
  items: string[],
  targetIndex: number,
  direction: Direction,
  difficulty: Difficulty
): Question {
  const correctOrdinal = ORDINALS[targetIndex]
  const options = buildOptions()
  const correctIndex = options.findIndex(option => option === correctOrdinal)

  const directionText =
    direction === "left" ? "From left to right" : "From right to left"

  return {
    prompt: `Look at the row of 4 emojis.\n${directionText}, which place is the ${items[targetIndex]} in?`,
    options,
    correctIndex,
    explanation: `The ${items[targetIndex]} is in the ${correctOrdinal} position.`,
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "ordinal_row",
      items,
      showLR: true
    }
  } as Question
}

function generateItems(): string[] {
  // Only 4 items now
  return shuffle(["🐟", "🎾", "🐻", "👟", "🚲"]).slice(0, 4)
}

export function generateOrdinalPositionQuestion(
  difficulty: Difficulty
): Question {
  const items = generateItems()

  const direction: Direction =
    difficulty === 1 ? "left" : chooseOne(["left", "right"])

  const targetIndex = Math.floor(Math.random() * items.length)

  return buildQuestion(items, targetIndex, direction, difficulty)
}