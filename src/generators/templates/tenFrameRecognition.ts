import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "ten_frame_recognition"
const TEMPLATE_KEY = "ten_frame_recognition"

type Variant = {
  count: number
  label: string
  singular: string
  emoji?: string
}

function buildPool(difficulty: Difficulty): Variant[] {
  if (difficulty === 1) {
    return [
      { count: 1, label: "dots", singular: "dot" },
      { count: 2, label: "dots", singular: "dot" },
      { count: 3, label: "dots", singular: "dot" },
      { count: 4, label: "dots", singular: "dot" },
      { count: 5, label: "dots", singular: "dot" },
      { count: 3, label: "cats", singular: "cat", emoji: "🐱" },
      { count: 4, label: "dogs", singular: "dog", emoji: "🐶" },
      { count: 5, label: "apples", singular: "apple", emoji: "🍎" }
    ]
  }

  return [
    { count: 1, label: "dots", singular: "dot" },
    { count: 2, label: "dots", singular: "dot" },
    { count: 3, label: "dots", singular: "dot" },
    { count: 4, label: "dots", singular: "dot" },
    { count: 5, label: "dots", singular: "dot" },
    { count: 6, label: "dots", singular: "dot" },
    { count: 7, label: "dots", singular: "dot" },
    { count: 8, label: "dots", singular: "dot" },
    { count: 9, label: "dots", singular: "dot" },
    { count: 4, label: "cats", singular: "cat", emoji: "🐱" },
    { count: 5, label: "dogs", singular: "dog", emoji: "🐶" },
    { count: 6, label: "pizza slices", singular: "pizza slice", emoji: "🍕" },
    { count: 7, label: "apples", singular: "apple", emoji: "🍎" },
    { count: 8, label: "soccer balls", singular: "soccer ball", emoji: "⚽" }
  ]
}

function uniqueCounts(target: number, max: number): number[] {
  const pool: number[] = []
  for (let i = 1; i <= max; i += 1) {
    if (i !== target) pool.push(i)
  }

  const distractors = shuffle(pool).slice(0, 3)
  return shuffle([target, ...distractors])
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

function targetLabel(variant: Variant): string {
  return variant.count === 1 ? variant.singular : variant.label
}

export function generateTenFrameRecognitionQuestion(
  difficulty: Difficulty
): Question {
  const variant = chooseOne(buildPool(difficulty))
  const counts = uniqueCounts(variant.count, difficulty === 1 ? 5 : 9)
  const correctIndex = counts.findIndex(c => c === variant.count)

  return {
    prompt: `Which ten-frame shows ${variant.count} ${targetLabel(variant)}?`,
    options: counts.map(String),
    correctIndex,
    explanation: `The correct ten-frame shows ${numberWord(variant.count)} ${targetLabel(variant)}.`,
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visualChoices: counts.map(count => ({
      type: "ten_frame",
      count,
      emoji: variant.emoji ?? null
    }))
  } as Question
}