import type { Difficulty, Question, QuestionOption } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "fraction_magnitude"
const TEMPLATE_KEY = "fraction_magnitude"

type SimpleFraction = {
  numerator: number
  denominator: number
}

function makeFraction(numerator: number, denominator: number): QuestionOption {
  return {
    kind: "fraction",
    numerator,
    denominator
  }
}

function fractionText(f: SimpleFraction): string {
  return `${f.numerator}/${f.denominator}`
}

function denominatorWord(d: number): string {
  const map: Record<number, string> = {
    2: "halves",
    3: "thirds",
    4: "fourths",
    5: "fifths",
    6: "sixths",
    7: "sevenths",
    8: "eighths",
    9: "ninths",
    10: "tenths",
    11: "elevenths",
    12: "twelfths"
  }

  return map[d] ?? `${d}ths`
}

function buildQuestion(
  options: QuestionOption[],
  correctIndex: number,
  explanation: string,
  difficulty: Difficulty
): Question {
  return {
    prompt: "Which does NOT belong?",
    options,
    correctIndex,
    concept: CONCEPT,
    difficulty,
    explanation,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true
  }
}

function generateLessThanHalfQuestion(difficulty: Difficulty): Question {
  const matching: SimpleFraction[] = [
    { numerator: 1, denominator: 3 },
    { numerator: 1, denominator: 4 },
    { numerator: 1, denominator: 5 }
  ]

  const intruder = chooseOne([
    { numerator: 2, denominator: 3 },
    { numerator: 3, denominator: 4 },
    { numerator: 4, denominator: 5 }
  ])

  const rawOptions = [
    ...matching.map(f => makeFraction(f.numerator, f.denominator)),
    makeFraction(intruder.numerator, intruder.denominator)
  ]

  const options = shuffle(rawOptions)

  const correctIndex = options.findIndex(
    o =>
      typeof o !== "string" &&
      "kind" in o &&
      o.kind === "fraction" &&
      o.numerator === intruder.numerator &&
      o.denominator === intruder.denominator
  )

  const explanation =
    `${fractionText(matching[0])}, ${fractionText(matching[1])}, and ${fractionText(matching[2])} are less than 1/2.   ${fractionText(intruder)} is greater than 1/2.`

  return buildQuestion(options, correctIndex, explanation, difficulty)
}

function generateGreaterThanHalfQuestion(difficulty: Difficulty): Question {
  const matching: SimpleFraction[] = [
    { numerator: 2, denominator: 3 },
    { numerator: 3, denominator: 4 },
    { numerator: 4, denominator: 5 }
  ]

  const intruder = chooseOne([
    { numerator: 1, denominator: 3 },
    { numerator: 1, denominator: 4 },
    { numerator: 2, denominator: 5 }
  ])

  const rawOptions = [
    ...matching.map(f => makeFraction(f.numerator, f.denominator)),
    makeFraction(intruder.numerator, intruder.denominator)
  ]

  const options = shuffle(rawOptions)

  const correctIndex = options.findIndex(
    o =>
      typeof o !== "string" &&
      "kind" in o &&
      o.kind === "fraction" &&
      o.numerator === intruder.numerator &&
      o.denominator === intruder.denominator
  )

  const explanation =
    `${fractionText(matching[0])}, ${fractionText(matching[1])}, and ${fractionText(matching[2])} are greater than 1/2.   ${fractionText(intruder)} is less than 1/2.`

  return buildQuestion(options, correctIndex, explanation, difficulty)
}

function generateUnitFractionQuestion(difficulty: Difficulty): Question {
  const matching: SimpleFraction[] = [
    { numerator: 1, denominator: 3 },
    { numerator: 1, denominator: 5 },
    { numerator: 1, denominator: 7 }
  ]

  const intruder = chooseOne([
    { numerator: 2, denominator: 3 },
    { numerator: 3, denominator: 5 },
    { numerator: 2, denominator: 7 }
  ])

  const rawOptions = [
    ...matching.map(f => makeFraction(f.numerator, f.denominator)),
    makeFraction(intruder.numerator, intruder.denominator)
  ]

  const options = shuffle(rawOptions)

  const correctIndex = options.findIndex(
    o =>
      typeof o !== "string" &&
      "kind" in o &&
      o.kind === "fraction" &&
      o.numerator === intruder.numerator &&
      o.denominator === intruder.denominator
  )

  const explanation =
    `${fractionText(matching[0])}, ${fractionText(matching[1])}, and ${fractionText(matching[2])} are unit fractions (numerator is 1).   ${fractionText(intruder)} is not a unit fraction.`

  return buildQuestion(options, correctIndex, explanation, difficulty)
}

function generateSameDenominatorQuestion(difficulty: Difficulty): Question {
  const denominator = chooseOne([4, 6, 8, 10])

  const matching: SimpleFraction[] = [
    { numerator: 1, denominator },
    { numerator: 3, denominator },
    { numerator: 5, denominator }
  ]

  const intruder = chooseOne([
    { numerator: 1, denominator: denominator - 1 },
    { numerator: 2, denominator: denominator - 2 },
    { numerator: 3, denominator: denominator + 1 }
  ])

  const rawOptions = [
    ...matching.map(f => makeFraction(f.numerator, f.denominator)),
    makeFraction(intruder.numerator, intruder.denominator)
  ]

  const options = shuffle(rawOptions)

  const correctIndex = options.findIndex(
    o =>
      typeof o !== "string" &&
      "kind" in o &&
      o.kind === "fraction" &&
      o.numerator === intruder.numerator &&
      o.denominator === intruder.denominator
  )

  const explanation =
    `${fractionText(matching[0])}, ${fractionText(matching[1])}, and ${fractionText(matching[2])} have the same denominator.   They are all counting ${denominatorWord(denominator)}.   ${fractionText(intruder)} is not.`

  return buildQuestion(options, correctIndex, explanation, difficulty)
}

export function generateFractionMagnitudeQuestion(difficulty: Difficulty): Question {
  switch (difficulty) {
    case 1:
      return generateUnitFractionQuestion(1)

    case 2:
      return Math.random() < 0.5
        ? generateLessThanHalfQuestion(2)
        : generateGreaterThanHalfQuestion(2)

    case 3:
      return Math.random() < 0.5
        ? generateLessThanHalfQuestion(3)
        : generateSameDenominatorQuestion(3)

    case 4:
    default:
      return Math.random() < 0.5
        ? generateGreaterThanHalfQuestion(4)
        : generateSameDenominatorQuestion(4)
  }
}