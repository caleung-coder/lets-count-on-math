import type { Difficulty, Question } from "../../types"
import { shuffle } from "../utils"

const CONCEPT = "compare_quantities"
const TEMPLATE_KEY = "which_group_has_most_rows"

const EMOJIS = ["🐱", "🐶", "🍎", "🍕", "🚗", "⚽", "👕", "🐻"]

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function chooseCounts(): number[] {
  const largest = randomInt(3, 5)

  const smallerOptions: number[] = []
  for (let n = 1; n < largest; n += 1) {
    smallerOptions.push(n)
  }

  const smallerCounts = [
    smallerOptions[randomInt(0, smallerOptions.length - 1)],
    smallerOptions[randomInt(0, smallerOptions.length - 1)],
    smallerOptions[randomInt(0, smallerOptions.length - 1)]
  ]

  return shuffle([largest, ...smallerCounts])
}

export function generateWhichGroupHasMostRowsQuestion(
  difficulty: Difficulty
): Question {
  const emojis = shuffle([...EMOJIS]).slice(0, 4)
  const counts = chooseCounts()

  const groups = emojis.map((emoji, i) => ({
    emoji,
    count: counts[i]
  }))

  const max = Math.max(...counts)
  const correctIndex = counts.indexOf(max)

  return {
    prompt: "Which group has the MOST?",
    options: emojis,
    correctIndex,
    explanation: `${groups[correctIndex].emoji} appears ${max} times. That is the most.`,
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "emoji",
    countsForScore: true,
    visual: {
      type: "comparison_rows",
      groups
    }
  } as Question
}