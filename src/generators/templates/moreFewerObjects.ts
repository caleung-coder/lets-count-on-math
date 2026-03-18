import type { Difficulty, Question } from "../../types"

const CONCEPT = "which_group_has_less"
const TEMPLATE_KEY = "more_fewer_objects"

type ObjectSet = {
  firstEmoji: string
  firstNamePlural: string
  secondEmoji: string
  secondNamePlural: string
}

const OBJECT_SETS: ObjectSet[] = [
  { firstEmoji: "🐶", firstNamePlural: "dogs", secondEmoji: "🐱", secondNamePlural: "cats" },
  { firstEmoji: "🍎", firstNamePlural: "apples", secondEmoji: "🍌", secondNamePlural: "bananas" },
  { firstEmoji: "👕", firstNamePlural: "shirts", secondEmoji: "🧢", secondNamePlural: "hats" },
  { firstEmoji: "⚽", firstNamePlural: "soccer balls", secondEmoji: "🏀", secondNamePlural: "basketballs" },
  { firstEmoji: "🚗", firstNamePlural: "cars", secondEmoji: "🚌", secondNamePlural: "buses" }
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

function explanationFor(
  firstCount: number,
  secondCount: number,
  firstNamePlural: string,
  secondNamePlural: string
): string {
  if (firstCount === secondCount) {
    return "The groups are equal."
  }

  const difference = Math.abs(firstCount - secondCount)

  if (difference === 1) {
    const singularize = (word: string) => word.endsWith("s") ? word.slice(0, -1) : word

    if (firstCount < secondCount) {
      return `There is 1 less ${singularize(firstNamePlural)} than ${secondNamePlural}.`
    }

    return `There is 1 less ${singularize(secondNamePlural)} than ${firstNamePlural}.`
  }

  if (firstCount < secondCount) {
    return `There are ${difference} less ${firstNamePlural} than ${secondNamePlural}.`
  }

  return `There are ${difference} less ${secondNamePlural} than ${firstNamePlural}.`
}

export function generateMoreFewerObjectsQuestion(
  difficulty: Difficulty
): Question {
  const objectSet = OBJECT_SETS[randomInt(0, OBJECT_SETS.length - 1)]

  const maxCount =
    difficulty === 1 ? 5 :
    difficulty === 2 ? 6 :
    difficulty === 3 ? 7 :
    8

  const makeEqual = Math.random() < 0.25

  let firstCount = randomInt(1, maxCount)
  let secondCount = randomInt(1, maxCount)

  if (makeEqual) {
    secondCount = firstCount
  } else {
    while (firstCount === secondCount) {
      secondCount = randomInt(1, maxCount)
    }
  }

  const options = shuffle([
    objectSet.firstEmoji,
    objectSet.secondEmoji,
    "equal",
    "not_sure"
  ])

  let correctAnswer = "equal"
  if (firstCount < secondCount) correctAnswer = objectSet.firstEmoji
  if (secondCount < firstCount) correctAnswer = objectSet.secondEmoji

  const correctIndex = options.findIndex(option => option === correctAnswer)

  return {
    prompt: "Which group has less?",
    options,
    correctIndex,
    explanation: explanationFor(
      firstCount,
      secondCount,
      objectSet.firstNamePlural,
      objectSet.secondNamePlural
    ),
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "aligned_comparison_groups",
      topEmoji: objectSet.firstEmoji,
      topCount: firstCount,
      bottomEmoji: objectSet.secondEmoji,
      bottomCount: secondCount
    }
  } as Question
}