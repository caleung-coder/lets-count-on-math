import type { Difficulty, Question } from "../../types"

const TEMPLATE_KEY = "how_many_more_fewer_objects"
const CONCEPT = "comparison_difference"

const OBJECTS = [
  { emoji: "🐶", singular: "dog", plural: "dogs" },
  { emoji: "🐱", singular: "cat", plural: "cats" },
  { emoji: "🐰", singular: "rabbit", plural: "rabbits" },
  { emoji: "🐻", singular: "bear", plural: "bears" },
  { emoji: "🍎", singular: "apple", plural: "apples" },
  { emoji: "🍌", singular: "banana", plural: "bananas" },
  { emoji: "🍇", singular: "bunch of grapes", plural: "bunches of grapes" },
  { emoji: "🍓", singular: "strawberry", plural: "strawberries" }
]

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildOptions(correct: number): string[] {
  const pool = new Set<number>()
  pool.add(correct)

  for (let value = 0; value <= 6; value += 1) {
    if (value !== correct) {
      pool.add(value)
    }
    if (pool.size >= 4) break
  }

  return shuffle([...pool].slice(0, 4)).map(String)
}

export function generateHowManyMoreFewerObjectsQuestion(
  difficulty: Difficulty = 1
): Question {
  let first = OBJECTS[randomInt(0, OBJECTS.length - 1)]
  let second = OBJECTS[randomInt(0, OBJECTS.length - 1)]

  while (first.emoji === second.emoji) {
    second = OBJECTS[randomInt(0, OBJECTS.length - 1)]
  }

  const makeEqual = Math.random() < 0.25

  let topCount = randomInt(2, 6)
  let bottomCount = randomInt(1, 5)

  if (makeEqual) {
    bottomCount = topCount
  } else {
    while (bottomCount >= topCount) {
      bottomCount = randomInt(1, 5)
    }
  }

  const difference = topCount - bottomCount
  const options = buildOptions(difference)
  const correctIndex = options.findIndex(option => Number(option) === difference)

  let explanation = ""

  if (difference === 0) {
    explanation = `The groups are equal. ${topCount} - ${bottomCount} = ${difference}.`
  } else if (difference === 1) {
    explanation = `There is 1 more ${first.singular} than ${second.plural}. ${topCount} - ${bottomCount} = ${difference}.`
  } else {
    explanation = `There are ${difference} more ${first.plural} than ${second.plural}. ${topCount} - ${bottomCount} = ${difference}.`
  }

  return {
    prompt: `How many more ${first.plural} than ${second.plural}?`,
    options,
    correctIndex,
    explanation,
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "aligned_comparison_groups",
      topEmoji: first.emoji,
      topCount,
      bottomEmoji: second.emoji,
      bottomCount
    }
  } as Question
}