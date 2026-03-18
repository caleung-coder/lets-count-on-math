import type { Difficulty, Question, QuestionOption } from "../../types"
import { chooseOne, shuffle, simplifyFraction } from "../utils"

const CONCEPT = "fraction_equivalence"
const TEMPLATE_KEY = "fraction_equivalence"

type Fraction = {
  numerator: number
  denominator: number
}

function fractionValueKey(f: Fraction): string {
  const s = simplifyFraction(f.numerator, f.denominator)
  return `${s.numerator}/${s.denominator}`
}

function textFraction(f: Fraction): string {
  return `${f.numerator}/${f.denominator}`
}

function mixedPartsFromImproper(f: Fraction): {
  whole?: number
  numerator: number
  denominator: number
} {
  const whole = Math.floor(f.numerator / f.denominator)
  const remainder = f.numerator % f.denominator

  if (whole === 0) {
    return {
      numerator: f.numerator,
      denominator: f.denominator
    }
  }

  if (remainder === 0) {
    return {
      whole,
      numerator: 0,
      denominator: f.denominator
    }
  }

  return {
    whole,
    numerator: remainder,
    denominator: f.denominator
  }
}

function formatTargetLabel(f: Fraction): string {
  const simplified = simplifyFraction(f.numerator, f.denominator)
  const improper = simplified.numerator >= simplified.denominator

  if (!improper) {
    return textFraction(simplified)
  }

  const parts = mixedPartsFromImproper(simplified)
  if (parts.whole === undefined || parts.numerator === 0) {
    return String(parts.whole ?? 0)
  }

  return `${parts.whole} ${parts.numerator}/${parts.denominator}`
}

function asFractionOption(f: Fraction): QuestionOption {
  return {
    kind: "fraction",
    numerator: f.numerator,
    denominator: f.denominator
  }
}

function asMixedFractionOption(f: Fraction): QuestionOption {
  const parts = mixedPartsFromImproper(f)

  if (parts.whole === undefined || parts.numerator === 0) {
    return {
      kind: "text",
      text: String(parts.whole ?? 0)
    }
  }

  return {
    kind: "fraction",
    whole: parts.whole,
    numerator: parts.numerator,
    denominator: parts.denominator
  }
}

function optionKey(option: QuestionOption): string {
  if (typeof option === "string") return `string:${option}`

  if ("kind" in option) {
    if (option.kind === "text") return `text:${option.text}`
    if (option.kind === "fraction") {
      return `fraction:${option.whole ?? ""}:${option.numerator}/${option.denominator}`
    }
  }

  return `label:${option.label}`
}

function buildQuestion(
  options: QuestionOption[],
  correctValue: QuestionOption,
  explanation: string,
  difficulty: Difficulty
): Question {
  const shuffled = shuffle(options)
  const correctIndex = shuffled.findIndex(x => optionKey(x) === optionKey(correctValue))

  return {
    prompt: "Which does NOT belong?",
    options: shuffled,
    correctIndex,
    concept: CONCEPT,
    difficulty,
    explanation,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true
  }
}

function regularEquivalentQuestion(
  base: Fraction,
  scales: number[],
  intruder: Fraction,
  difficulty: Difficulty
): Question {
  const matchingFractions = scales.map(scale => ({
    numerator: base.numerator * scale,
    denominator: base.denominator * scale
  }))

  const matchingOptions = matchingFractions.map(asFractionOption)
  const intruderOption = asFractionOption(intruder)
  const matchingLabels = matchingFractions.map(textFraction)
  const intruderLabel = textFraction(intruder)
  const targetLabel = formatTargetLabel(base)

  const explanation =
    `${matchingLabels[0]}, ${matchingLabels[1]}, and ${matchingLabels[2]} are equivalent fractions.   They all represent ${targetLabel}.   ${intruderLabel} is not equivalent.`

  return buildQuestion([...matchingOptions, intruderOption], intruderOption, explanation, difficulty)
}

function mixedImproperQuestion(base: Fraction, intruder: Fraction, difficulty: Difficulty): Question {
  const scaled = {
    numerator: base.numerator * 2,
    denominator: base.denominator * 2
  }

  const matchingOptions: QuestionOption[] = [
    asFractionOption(base),
    asFractionOption(scaled),
    asMixedFractionOption(base)
  ]

  const intruderOption = asFractionOption(intruder)

  const matchingLabels = [
    textFraction(base),
    textFraction(scaled),
    formatTargetLabel(base)
  ]

  const intruderLabel = textFraction(intruder)
  const targetLabel = formatTargetLabel(base)

  const explanation =
    `${matchingLabels[0]}, ${matchingLabels[1]}, and ${matchingLabels[2]} are equivalent fractions.   They all represent ${targetLabel}.   ${intruderLabel} is not equivalent.`

  return buildQuestion([...matchingOptions, intruderOption], intruderOption, explanation, difficulty)
}

function generateSimpleEquivalentQuestion(difficulty: Difficulty): Question {
  const base = chooseOne<Fraction>([
    { numerator: 1, denominator: 2 },
    { numerator: 1, denominator: 3 },
    { numerator: 2, denominator: 3 },
    { numerator: 3, denominator: 4 }
  ])

  const intruderChoices: Record<string, Fraction[]> = {
    "1/2": [
      { numerator: 2, denominator: 3 },
      { numerator: 3, denominator: 4 },
      { numerator: 1, denominator: 3 }
    ],
    "1/3": [
      { numerator: 1, denominator: 2 },
      { numerator: 2, denominator: 3 },
      { numerator: 3, denominator: 4 }
    ],
    "2/3": [
      { numerator: 1, denominator: 2 },
      { numerator: 3, denominator: 4 },
      { numerator: 1, denominator: 3 }
    ],
    "3/4": [
      { numerator: 1, denominator: 2 },
      { numerator: 2, denominator: 3 },
      { numerator: 1, denominator: 4 }
    ]
  }

  const intruder = chooseOne(intruderChoices[fractionValueKey(base)])

  return regularEquivalentQuestion(base, [1, 2, 3], intruder, difficulty)
}

function generateIntermediateEquivalentQuestion(difficulty: Difficulty): Question {
  const base = chooseOne<Fraction>([
    { numerator: 2, denominator: 3 },
    { numerator: 3, denominator: 4 },
    { numerator: 3, denominator: 5 },
    { numerator: 4, denominator: 5 }
  ])

  const intruderChoices: Record<string, Fraction[]> = {
    "2/3": [
      { numerator: 3, denominator: 5 },
      { numerator: 4, denominator: 5 },
      { numerator: 1, denominator: 2 }
    ],
    "3/4": [
      { numerator: 2, denominator: 3 },
      { numerator: 4, denominator: 5 },
      { numerator: 3, denominator: 5 }
    ],
    "3/5": [
      { numerator: 2, denominator: 3 },
      { numerator: 3, denominator: 4 },
      { numerator: 4, denominator: 5 }
    ],
    "4/5": [
      { numerator: 3, denominator: 4 },
      { numerator: 3, denominator: 5 },
      { numerator: 2, denominator: 3 }
    ]
  }

  const intruder = chooseOne(intruderChoices[fractionValueKey(base)])

  return regularEquivalentQuestion(base, [1, 2, 3], intruder, difficulty)
}

function generateAdvancedEquivalentQuestion(difficulty: Difficulty): Question {
  const base = chooseOne<Fraction>([
    { numerator: 2, denominator: 5 },
    { numerator: 3, denominator: 5 },
    { numerator: 3, denominator: 8 },
    { numerator: 5, denominator: 8 },
    { numerator: 5, denominator: 6 }
  ])

  const intruderChoices: Record<string, Fraction[]> = {
    "2/5": [
      { numerator: 1, denominator: 2 },
      { numerator: 3, denominator: 5 },
      { numerator: 3, denominator: 8 }
    ],
    "3/5": [
      { numerator: 2, denominator: 5 },
      { numerator: 5, denominator: 8 },
      { numerator: 5, denominator: 6 }
    ],
    "3/8": [
      { numerator: 2, denominator: 5 },
      { numerator: 1, denominator: 2 },
      { numerator: 3, denominator: 5 }
    ],
    "5/8": [
      { numerator: 3, denominator: 5 },
      { numerator: 5, denominator: 6 },
      { numerator: 1, denominator: 2 }
    ],
    "5/6": [
      { numerator: 3, denominator: 4 },
      { numerator: 5, denominator: 8 },
      { numerator: 3, denominator: 5 }
    ]
  }

  const intruder = chooseOne(intruderChoices[fractionValueKey(base)])

  return regularEquivalentQuestion(base, [1, 2, 3], intruder, difficulty)
}

function generateMixedImproperEquivalentQuestion(difficulty: Difficulty): Question {
  const base = chooseOne<Fraction>([
    { numerator: 3, denominator: 2 },
    { numerator: 5, denominator: 2 },
    { numerator: 7, denominator: 3 },
    { numerator: 7, denominator: 4 }
  ])

  const intruderChoices: Record<string, Fraction[]> = {
    "3/2": [
      { numerator: 5, denominator: 3 },
      { numerator: 7, denominator: 4 },
      { numerator: 5, denominator: 4 }
    ],
    "5/2": [
      { numerator: 7, denominator: 3 },
      { numerator: 9, denominator: 4 },
      { numerator: 3, denominator: 2 }
    ],
    "7/3": [
      { numerator: 5, denominator: 2 },
      { numerator: 8, denominator: 3 },
      { numerator: 7, denominator: 4 }
    ],
    "7/4": [
      { numerator: 5, denominator: 3 },
      { numerator: 3, denominator: 2 },
      { numerator: 9, denominator: 4 }
    ]
  }

  const intruder = chooseOne(intruderChoices[fractionValueKey(base)])

  return mixedImproperQuestion(base, intruder, difficulty)
}

export function generateFractionEquivalenceQuestion(difficulty: Difficulty): Question {
  switch (difficulty) {
    case 1:
      return generateSimpleEquivalentQuestion(1)
    case 2:
      return generateIntermediateEquivalentQuestion(2)
    case 3:
      return generateAdvancedEquivalentQuestion(3)
    case 4:
    default:
      return generateMixedImproperEquivalentQuestion(4)
  }
}