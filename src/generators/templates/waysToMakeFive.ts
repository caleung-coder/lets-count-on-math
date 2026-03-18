import type { Difficulty, Question } from "../../types"

const TEMPLATE_KEY = "ways_to_make_5"
const CONCEPT = "composing_5"

function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function makePair(a: number, b: number): string {
  return `${a} + ${b}`
}

function sumPair(pair: string): number {
  const [left, right] = pair.split("+").map(part => Number(part.trim()))
  return left + right
}

export function generateWaysToMakeFiveQuestion(
  _difficulty: Difficulty
): Question {
  const correctPairs = [
    makePair(0, 5),
    makePair(1, 4),
    makePair(2, 3),
    makePair(3, 2),
    makePair(4, 1),
    makePair(5, 0)
  ]

  const incorrectPairs = [
    makePair(0, 4),
    makePair(1, 3),
    makePair(2, 2),
    makePair(4, 2),
    makePair(3, 3),
    makePair(5, 1)
  ]

  const incorrectChoice = randomItem(incorrectPairs)
  const remainingCorrect = shuffle([...correctPairs]).slice(0, 3)

  const options = shuffle([
    incorrectChoice,
    ...remainingCorrect
  ])

  const correctIndex = options.findIndex(option => option === incorrectChoice)
  const incorrectSum = sumPair(incorrectChoice)

  return {
    prompt: "Which pair does NOT make 5?",
    options,
    correctIndex,
    explanation: `Three pairs make 5. ${incorrectChoice} = ${incorrectSum}.`,
    concept: CONCEPT,
    difficulty: 1,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true
  } as Question
}