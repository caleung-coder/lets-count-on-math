import type { Difficulty, Question, QuestionOption } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "fraction_decimal_percent"
const TEMPLATE_KEY = "fraction_decimal_percent"

type EquivalentFamily = {
  label: string
  fraction: {
    numerator: number
    denominator: number
  }
  decimal: string
  percent: string
  intruders: Array<
    | string
    | {
        numerator: number
        denominator: number
      }
  >
}

const FAMILIES: EquivalentFamily[] = [
  {
    label: "one-half",
    fraction: { numerator: 1, denominator: 2 },
    decimal: "0.5",
    percent: "50%",
    intruders: [
      { numerator: 1, denominator: 4 },
      "0.25",
      "25%",
      { numerator: 3, denominator: 4 },
      "0.75",
      "75%"
    ]
  },
  {
    label: "one-fourth",
    fraction: { numerator: 1, denominator: 4 },
    decimal: "0.25",
    percent: "25%",
    intruders: [
      { numerator: 1, denominator: 2 },
      "0.5",
      "50%",
      { numerator: 3, denominator: 4 },
      "0.75",
      "75%"
    ]
  },
  {
    label: "three-fourths",
    fraction: { numerator: 3, denominator: 4 },
    decimal: "0.75",
    percent: "75%",
    intruders: [
      { numerator: 1, denominator: 2 },
      "0.5",
      "50%",
      { numerator: 1, denominator: 4 },
      "0.25",
      "25%"
    ]
  },
  {
    label: "one-tenth",
    fraction: { numerator: 1, denominator: 10 },
    decimal: "0.1",
    percent: "10%",
    intruders: [
      { numerator: 1, denominator: 2 },
      "0.5",
      "50%",
      { numerator: 1, denominator: 4 },
      "0.25",
      "25%"
    ]
  }
]

function fractionOption(numerator: number, denominator: number): QuestionOption {
  return {
    kind: "fraction",
    numerator,
    denominator
  }
}

function optionKey(option: QuestionOption): string {
  if (typeof option === "string") return `string:${option}`

  if ("kind" in option) {
    if (option.kind === "fraction") {
      return `fraction:${option.whole ?? ""}:${option.numerator}/${option.denominator}`
    }

    if (option.kind === "text") {
      return `text:${option.text}`
    }
  }

  return `label:${option.label}`
}

function fractionText(numerator: number, denominator: number): string {
  return `${numerator}/${denominator}`
}

function asOption(
  value:
    | string
    | {
        numerator: number
        denominator: number
      }
): QuestionOption {
  if (typeof value === "string") return value

  return fractionOption(value.numerator, value.denominator)
}

function asText(
  value:
    | string
    | {
        numerator: number
        denominator: number
      }
): string {
  if (typeof value === "string") return value

  return fractionText(value.numerator, value.denominator)
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

function generateBasicEquivalenceQuestion(difficulty: Difficulty): Question {
  const family = chooseOne(FAMILIES)
  const intruder = chooseOne(family.intruders)

  const matchingOptions: QuestionOption[] = [
    fractionOption(family.fraction.numerator, family.fraction.denominator),
    family.decimal,
    family.percent
  ]

  const intruderOption = asOption(intruder)

  const explanation =
    `${fractionText(family.fraction.numerator, family.fraction.denominator)}, ${family.decimal}, and ${family.percent} are equivalent.   They all represent ${family.label}.   ${asText(intruder)} does not.`

  return buildQuestion([...matchingOptions, intruderOption], intruderOption, explanation, difficulty)
}

function generateFractionHeavyQuestion(difficulty: Difficulty): Question {
  const family = chooseOne([
    {
      label: "one-half",
      matching: [
        { numerator: 1, denominator: 2 },
        "0.5",
        "50%"
      ],
      intruders: [
        { numerator: 2, denominator: 3 },
        "0.25",
        "25%",
        { numerator: 3, denominator: 4 }
      ]
    },
    {
      label: "three-fourths",
      matching: [
        { numerator: 3, denominator: 4 },
        "0.75",
        "75%"
      ],
      intruders: [
        { numerator: 1, denominator: 2 },
        "0.5",
        "50%",
        { numerator: 1, denominator: 4 }
      ]
    }
  ])

  const intruder = chooseOne(family.intruders)
  const matchingOptions = family.matching.map(asOption)
  const intruderOption = asOption(intruder)

  const explanation =
    `${asText(family.matching[0])}, ${asText(family.matching[1])}, and ${asText(family.matching[2])} are equivalent.   They all represent ${family.label}.   ${asText(intruder)} does not.`

  return buildQuestion([...matchingOptions, intruderOption], intruderOption, explanation, difficulty)
}

function generatePercentHeavyQuestion(difficulty: Difficulty): Question {
  const family = chooseOne([
    {
      label: "one-fourth",
      matching: [
        "25%",
        "0.25",
        { numerator: 1, denominator: 4 }
      ],
      intruders: [
        "50%",
        "0.5",
        { numerator: 1, denominator: 2 },
        "75%"
      ]
    },
    {
      label: "one-tenth",
      matching: [
        "10%",
        "0.1",
        { numerator: 1, denominator: 10 }
      ],
      intruders: [
        "25%",
        "0.25",
        { numerator: 1, denominator: 4 },
        "50%"
      ]
    }
  ])

  const intruder = chooseOne(family.intruders)
  const matchingOptions = family.matching.map(asOption)
  const intruderOption = asOption(intruder)

  const explanation =
    `${asText(family.matching[0])}, ${asText(family.matching[1])}, and ${asText(family.matching[2])} are equivalent.   They all represent ${family.label}.   ${asText(intruder)} does not.`

  return buildQuestion([...matchingOptions, intruderOption], intruderOption, explanation, difficulty)
}

export function generateFractionDecimalPercentQuestion(
  difficulty: Difficulty
): Question {
  switch (difficulty) {
    case 1:
      return generateBasicEquivalenceQuestion(1)

    case 2:
      return Math.random() < 0.5
        ? generateBasicEquivalenceQuestion(2)
        : generateFractionHeavyQuestion(2)

    case 3:
      return Math.random() < 0.5
        ? generateFractionHeavyQuestion(3)
        : generatePercentHeavyQuestion(3)

    case 4:
    default:
      return Math.random() < 0.5
        ? generatePercentHeavyQuestion(4)
        : generateBasicEquivalenceQuestion(4)
  }
}