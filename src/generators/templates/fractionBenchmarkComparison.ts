import type { Difficulty, Question, QuestionOption } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "fractions_benchmark"

type FractionLike = {
  numerator: number
  denominator: number
}

function fractionOption(numerator: number, denominator: number): QuestionOption {
  return {
    kind: "fraction",
    numerator,
    denominator
  }
}

function fractionText(f: FractionLike): string {
  return `${f.numerator}/${f.denominator}`
}

function fractionValue(f: FractionLike): number {
  return f.numerator / f.denominator
}

function sortedFractionTexts(values: FractionLike[]): string[] {
  return [...values]
    .sort((a, b) => fractionValue(a) - fractionValue(b))
    .map(fractionText)
}

function buildQuestion(
  options: QuestionOption[],
  correctValue: QuestionOption,
  explanation: string,
  difficulty: Difficulty,
  templateKey: "fractions_benchmark_half" | "fractions_benchmark_one"
): Question {
  const shuffled = shuffle(options)

  const correctIndex = shuffled.findIndex(option => {
    if (typeof option === "string" || typeof correctValue === "string") {
      return option === correctValue
    }

    if ("kind" in option && "kind" in correctValue) {
      if (option.kind !== correctValue.kind) return false

      if (option.kind === "fraction" && correctValue.kind === "fraction") {
        return (
          option.numerator === correctValue.numerator &&
          option.denominator === correctValue.denominator &&
          option.whole === correctValue.whole
        )
      }

      if (option.kind === "text" && correctValue.kind === "text") {
        return option.text === correctValue.text
      }
    }

    return false
  })

  return {
    prompt: "Which does NOT belong?",
    options: shuffled,
    correctIndex,
    explanation,
    concept: CONCEPT,
    difficulty,
    templateKey,
    kind: "text",
    countsForScore: true
  }
}

function generateLessThanHalfQuestion(difficulty: Difficulty): Question {
  const matching: FractionLike[] = [
    { numerator: 1, denominator: 4 },
    { numerator: 1, denominator: 3 },
    { numerator: 2, denominator: 5 }
  ]

  const intruder: FractionLike = chooseOne([
    { numerator: 2, denominator: 3 },
    { numerator: 3, denominator: 4 },
    { numerator: 5, denominator: 6 }
  ])

  const options: QuestionOption[] = [
    ...matching.map(f => fractionOption(f.numerator, f.denominator)),
    fractionOption(intruder.numerator, intruder.denominator)
  ]

  const [a, b, c] = sortedFractionTexts(matching)

  const explanation =
    `${a}, ${b}, and ${c} are all less than one-half.   ${fractionText(intruder)} is greater than one-half.`

  return buildQuestion(
    options,
    fractionOption(intruder.numerator, intruder.denominator),
    explanation,
    difficulty,
    "fractions_benchmark_half"
  )
}

function generateGreaterThanHalfQuestion(difficulty: Difficulty): Question {
  const matching: FractionLike[] = [
    { numerator: 3, denominator: 4 },
    { numerator: 2, denominator: 3 },
    { numerator: 5, denominator: 6 }
  ]

  const intruder: FractionLike = chooseOne([
    { numerator: 1, denominator: 4 },
    { numerator: 1, denominator: 3 },
    { numerator: 2, denominator: 5 }
  ])

  const options: QuestionOption[] = [
    ...matching.map(f => fractionOption(f.numerator, f.denominator)),
    fractionOption(intruder.numerator, intruder.denominator)
  ]

  const [a, b, c] = sortedFractionTexts(matching)

  const explanation =
    `${a}, ${b}, and ${c} are all greater than one-half.   ${fractionText(intruder)} is less than one-half.`

  return buildQuestion(
    options,
    fractionOption(intruder.numerator, intruder.denominator),
    explanation,
    difficulty,
    "fractions_benchmark_half"
  )
}

function generateEqualToHalfQuestion(difficulty: Difficulty): Question {
  const matching: FractionLike[] = [
    { numerator: 1, denominator: 2 },
    { numerator: 2, denominator: 4 },
    { numerator: 3, denominator: 6 }
  ]

  const intruder: FractionLike = chooseOne([
    { numerator: 3, denominator: 4 },
    { numerator: 2, denominator: 5 },
    { numerator: 1, denominator: 3 }
  ])

  const options: QuestionOption[] = [
    ...matching.map(f => fractionOption(f.numerator, f.denominator)),
    fractionOption(intruder.numerator, intruder.denominator)
  ]

  const explanation =
    `1/2, 2/4, and 3/6 are equivalent to one-half.   ${fractionText(intruder)} is not.`

  return buildQuestion(
    options,
    fractionOption(intruder.numerator, intruder.denominator),
    explanation,
    difficulty,
    "fractions_benchmark_half"
  )
}

function generateLessThanOneQuestion(difficulty: Difficulty): Question {
  const matching: FractionLike[] = [
    { numerator: 1, denominator: 2 },
    { numerator: 3, denominator: 4 },
    { numerator: 5, denominator: 6 }
  ]

  const intruder: FractionLike = chooseOne([
    { numerator: 5, denominator: 4 },
    { numerator: 7, denominator: 6 },
    { numerator: 9, denominator: 8 }
  ])

  const options: QuestionOption[] = [
    ...matching.map(f => fractionOption(f.numerator, f.denominator)),
    fractionOption(intruder.numerator, intruder.denominator)
  ]

  const [a, b, c] = sortedFractionTexts(matching)

  const explanation =
    `${a}, ${b}, and ${c} are all less than 1.   ${fractionText(intruder)} is greater than 1.`

  return buildQuestion(
    options,
    fractionOption(intruder.numerator, intruder.denominator),
    explanation,
    difficulty,
    "fractions_benchmark_one"
  )
}

function generateGreaterThanOneQuestion(difficulty: Difficulty): Question {
  const matching: FractionLike[] = [
    { numerator: 5, denominator: 4 },
    { numerator: 7, denominator: 6 },
    { numerator: 9, denominator: 8 }
  ]

  const intruder: FractionLike = chooseOne([
    { numerator: 1, denominator: 2 },
    { numerator: 3, denominator: 4 },
    { numerator: 5, denominator: 6 }
  ])

  const options: QuestionOption[] = [
    ...matching.map(f => fractionOption(f.numerator, f.denominator)),
    fractionOption(intruder.numerator, intruder.denominator)
  ]

  const [a, b, c] = sortedFractionTexts(matching)

  const explanation =
    `${a}, ${b}, and ${c} are all greater than 1.   ${fractionText(intruder)} is less than 1.`

  return buildQuestion(
    options,
    fractionOption(intruder.numerator, intruder.denominator),
    explanation,
    difficulty,
    "fractions_benchmark_one"
  )
}

export function generateFractionBenchmarkComparisonQuestion(
  difficulty: Difficulty,
  templateKey: "fractions_benchmark_half" | "fractions_benchmark_one" = "fractions_benchmark_half"
): Question {
  if (templateKey === "fractions_benchmark_one") {
    switch (difficulty) {
      case 1:
        return generateLessThanOneQuestion(1)
      case 2:
        return chooseOne([
          generateLessThanOneQuestion(2),
          generateGreaterThanOneQuestion(2)
        ])
      case 3:
        return chooseOne([
          generateLessThanOneQuestion(3),
          generateGreaterThanOneQuestion(3)
        ])
      case 4:
      default:
        return chooseOne([
          generateLessThanOneQuestion(4),
          generateGreaterThanOneQuestion(4)
        ])
    }
  }

  switch (difficulty) {
    case 1:
      return generateEqualToHalfQuestion(1)
    case 2:
      return chooseOne([
        generateLessThanHalfQuestion(2),
        generateGreaterThanHalfQuestion(2),
        generateEqualToHalfQuestion(2)
      ])
    case 3:
      return chooseOne([
        generateLessThanHalfQuestion(3),
        generateGreaterThanHalfQuestion(3),
        generateEqualToHalfQuestion(3)
      ])
    case 4:
    default:
      return chooseOne([
        generateLessThanHalfQuestion(4),
        generateGreaterThanHalfQuestion(4),
        generateEqualToHalfQuestion(4)
      ])
  }
}