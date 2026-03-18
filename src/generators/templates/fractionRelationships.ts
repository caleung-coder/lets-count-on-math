import type { Difficulty, Question, QuestionOption } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "fraction_relationships"
const TEMPLATE_KEY = "fraction_relationships"

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

function fractionText(fraction: SimpleFraction): string {
  return `${fraction.numerator}/${fraction.denominator}`
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

function isNMinusOneOverN(fraction: SimpleFraction): boolean {
  return fraction.numerator === fraction.denominator - 1
}

function isLessThanHalf(fraction: SimpleFraction): boolean {
  return fraction.numerator * 2 < fraction.denominator
}

function generateNMinusOnePatternQuestion(difficulty: Difficulty): Question {
  const matchingDenominators = shuffle([4, 5, 6, 7, 8, 9]).slice(0, 3)

  const matchingFractions: SimpleFraction[] = matchingDenominators.map(denominator => ({
    numerator: denominator - 1,
    denominator
  }))

  const intruderPool: SimpleFraction[] = [
    { numerator: 1, denominator: 3 },
    { numerator: 1, denominator: 5 },
    { numerator: 2, denominator: 5 },
    { numerator: 2, denominator: 7 },
    { numerator: 3, denominator: 7 },
    { numerator: 3, denominator: 8 },
    { numerator: 4, denominator: 9 }
  ]

  const usedDenominators = new Set(matchingFractions.map(f => f.denominator))

  const validIntruders = intruderPool.filter(fraction => {
    return (
      !usedDenominators.has(fraction.denominator) &&
      !isNMinusOneOverN(fraction) &&
      isLessThanHalf(fraction)
    )
  })

  const intruder = chooseOne(validIntruders)

  const rawOptions: QuestionOption[] = [
    ...matchingFractions.map(fraction => makeFraction(fraction.numerator, fraction.denominator)),
    makeFraction(intruder.numerator, intruder.denominator)
  ]

  const options = shuffle(rawOptions)

  const correctIndex = options.findIndex(option => {
    return (
      typeof option !== "string" &&
      "kind" in option &&
      option.kind === "fraction" &&
      option.numerator === intruder.numerator &&
      option.denominator === intruder.denominator &&
      option.whole === undefined
    )
  })

  const explanation =
    `${fractionText(matchingFractions[0])}, ${fractionText(matchingFractions[1])}, and ${fractionText(matchingFractions[2])} have numerators that are one less than their denominators.   ${fractionText(intruder)} does not.`

  return buildQuestion(options, correctIndex, explanation, difficulty)
}

export function generateFractionRelationshipsQuestion(
  difficulty: Difficulty
): Question {
  switch (difficulty) {
    case 1:
      return generateNMinusOnePatternQuestion(1)

    case 2:
      return generateNMinusOnePatternQuestion(2)

    case 3:
      return generateNMinusOnePatternQuestion(3)

    case 4:
    default:
      return generateNMinusOnePatternQuestion(4)
  }
}