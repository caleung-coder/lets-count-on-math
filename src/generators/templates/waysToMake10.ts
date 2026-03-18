import type { Question } from "../../types"

const TEMPLATE_KEY = "ways_to_make_10"
const CONCEPT = "composing_10"

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

export function generateWaysToMake10Question(): Question {
  const correctPairs = [
    makePair(0, 10),
    makePair(1, 9),
    makePair(2, 8),
    makePair(3, 7),
    makePair(4, 6),
    makePair(5, 5),
    makePair(6, 4),
    makePair(7, 3),
    makePair(8, 2),
    makePair(9, 1),
    makePair(10, 0)
  ]

  const incorrectPairs = [
    makePair(0, 9),
    makePair(1, 8),
    makePair(2, 7),
    makePair(3, 6),
    makePair(4, 5),
    makePair(7, 4),
    makePair(8, 3),
    makePair(6, 6)
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
    prompt: "Which pair does NOT make 10?",
    options,
    correctIndex,
    explanation: `Three pairs make 10. ${incorrectChoice} = ${incorrectSum}.`,
    concept: CONCEPT,
    difficulty: 2,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true
  } as Question
}