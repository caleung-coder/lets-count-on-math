import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "number_properties"
const TEMPLATE_KEY = "number_properties"

function buildQuestion(
  options: number[],
  correctValue: number,
  explanation: string,
  difficulty: Difficulty
): Question {
  const asStrings = shuffle(options.map(String))
  const correctIndex = asStrings.findIndex(value => Number(value) === correctValue)

  return {
    prompt: "Which does NOT belong?",
    options: asStrings,
    correctIndex,
    concept: CONCEPT,
    difficulty,
    explanation,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true
  }
}

function isPrime(n: number): boolean {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}

function isComposite(n: number): boolean {
  return n > 1 && !isPrime(n)
}

function isEven(n: number): boolean {
  return n % 2 === 0
}

function allPrime(values: number[]): boolean {
  return values.every(isPrime)
}

function allComposite(values: number[]): boolean {
  return values.every(isComposite)
}

function allEven(values: number[]): boolean {
  return values.every(isEven)
}

function allOdd(values: number[]): boolean {
  return values.every(value => !isEven(value))
}

function hasAmbiguousPrimeCompositeVsOddEven(
  matching: number[],
  intruder: number
): boolean {
  if (matching.length !== 3) return false

  const primeCompositePattern =
    (allPrime(matching) && isComposite(intruder)) ||
    (allComposite(matching) && isPrime(intruder))

  if (!primeCompositePattern) return false

  const oddEvenAlternative =
    (allOdd(matching) && isEven(intruder)) ||
    (allEven(matching) && !isEven(intruder))

  return oddEvenAlternative
}

function assertNoPrimeCompositeOddEvenAmbiguity(
  matching: number[],
  intruder: number
): void {
  if (hasAmbiguousPrimeCompositeVsOddEven(matching, intruder)) {
    throw new Error(
      `Ambiguous number-properties set: ${matching.join(", ")} | ${intruder}`
    )
  }
}

function generateMultipleQuestion(difficulty: Difficulty): Question {
  const families = [
    {
      base: 3,
      matching: [6, 9, 12],
      intruders: [10, 11, 14, 16]
    },
    {
      base: 4,
      matching: [8, 12, 16],
      intruders: [6, 10, 14, 18]
    },
    {
      base: 5,
      matching: [10, 15, 20],
      intruders: [12, 14, 16, 18]
    }
  ]

  const family = chooseOne(families)
  const intruder = chooseOne(family.intruders)

  const explanation =
    `${family.matching[0]}, ${family.matching[1]}, and ${family.matching[2]} are multiples of ${family.base}.   ${intruder} is not a multiple of ${family.base}.`

  return buildQuestion([...family.matching, intruder], intruder, explanation, difficulty)
}

function generateFactorQuestion(difficulty: Difficulty): Question {
  const difficultyFamilies: Record<Difficulty, Array<{
    base: number
    matching: [number, number, number]
    intruders: number[]
  }>> = {
    1: [
      { base: 6, matching: [1, 2, 3], intruders: [4, 5] },
      { base: 8, matching: [1, 2, 4], intruders: [3, 5, 6] },
      { base: 10, matching: [1, 2, 5], intruders: [3, 4, 6, 7] },
      { base: 12, matching: [1, 2, 3], intruders: [5, 7, 8, 10] }
    ],
    2: [
      { base: 12, matching: [2, 3, 4], intruders: [5, 7, 8, 10] },
      { base: 15, matching: [1, 3, 5], intruders: [2, 4, 6, 8] },
      { base: 16, matching: [1, 2, 4], intruders: [3, 5, 6, 7] },
      { base: 18, matching: [1, 2, 3], intruders: [4, 5, 7, 8] },
      { base: 20, matching: [1, 2, 5], intruders: [3, 6, 7, 9] }
    ],
    3: [
      { base: 18, matching: [2, 3, 9], intruders: [4, 5, 7, 8] },
      { base: 20, matching: [2, 4, 5], intruders: [3, 6, 7, 9] },
      { base: 24, matching: [2, 3, 6], intruders: [5, 7, 8, 10] },
      { base: 27, matching: [1, 3, 9], intruders: [2, 4, 5, 6] },
      { base: 30, matching: [2, 3, 5], intruders: [4, 7, 8, 9] }
    ],
    4: [
      { base: 24, matching: [3, 4, 6], intruders: [5, 7, 8, 10] },
      { base: 28, matching: [1, 2, 7], intruders: [3, 5, 6, 9] },
      { base: 30, matching: [2, 3, 5], intruders: [4, 7, 8, 9] },
      { base: 36, matching: [2, 3, 6], intruders: [5, 7, 8, 10] },
      { base: 40, matching: [2, 4, 5], intruders: [3, 6, 7, 9] }
    ]
  }

  const family = chooseOne(difficultyFamilies[difficulty])
  const intruder = chooseOne(family.intruders)

  const explanation =
    `${family.matching[0]}, ${family.matching[1]}, and ${family.matching[2]} are factors of ${family.base}.   ${intruder} is not a factor of ${family.base}.`

  return buildQuestion([...family.matching, intruder], intruder, explanation, difficulty)
}

function generatePrimeQuestion(difficulty: Difficulty): Question {
  const families = [
    {
      matching: [3, 5, 7],
      intruders: [9, 15, 21, 25]
    },
    {
      matching: [5, 11, 13],
      intruders: [9, 21, 25, 27]
    },
    {
      matching: [7, 11, 17],
      intruders: [9, 15, 21, 27]
    }
  ]

  const family = chooseOne(families)
  const intruder = chooseOne(family.intruders)

  assertNoPrimeCompositeOddEvenAmbiguity(family.matching, intruder)

  const twoNote = family.matching.includes(2)
    ? "   2 is the only even prime number."
    : ""

  const explanation =
    `${family.matching[0]}, ${family.matching[1]}, and ${family.matching[2]} are prime numbers.   ${intruder} is composite.${twoNote}`

  return buildQuestion([...family.matching, intruder], intruder, explanation, difficulty)
}

function generateCompositeQuestion(difficulty: Difficulty): Question {
  const families = [
    {
      matching: [9, 15, 21],
      intruders: [5, 7, 11, 13]
    },
    {
      matching: [25, 27, 33],
      intruders: [7, 11, 13, 17]
    },
    {
      matching: [21, 27, 35],
      intruders: [11, 13, 17, 19]
    }
  ]

  const family = chooseOne(families)
  const intruder = chooseOne(family.intruders)

  assertNoPrimeCompositeOddEvenAmbiguity(family.matching, intruder)

  const explanation =
    `${family.matching[0]}, ${family.matching[1]}, and ${family.matching[2]} are composite numbers.   ${intruder} is prime.`

  return buildQuestion([...family.matching, intruder], intruder, explanation, difficulty)
}

function generateSquareNumberQuestion(difficulty: Difficulty): Question {
  const families = [
    {
      matching: [4, 9, 16],
      intruders: [6, 10, 14, 18]
    },
    {
      matching: [9, 16, 25],
      intruders: [8, 12, 18, 20]
    },
    {
      matching: [16, 25, 36],
      intruders: [14, 20, 24, 30]
    }
  ]

  const family = chooseOne(families)
  const intruder = chooseOne(family.intruders)

  const explanation =
    `${family.matching[0]}, ${family.matching[1]}, and ${family.matching[2]} are square numbers.   ${intruder} is not a square number.`

  return buildQuestion([...family.matching, intruder], intruder, explanation, difficulty)
}

type OddEvenFamily = {
  matching: number[]
  intruders: number[]
  matchingLabel: "odd" | "even"
  intruderLabel: "odd" | "even"
}

function generateOddEvenQuestion(difficulty: Difficulty): Question {
  const families: OddEvenFamily[] = [
    {
      matching: [3, 5, 7],
      intruders: [2, 4, 6, 8],
      matchingLabel: "odd",
      intruderLabel: "even"
    },
    {
      matching: [9, 11, 13],
      intruders: [2, 4, 6, 10],
      matchingLabel: "odd",
      intruderLabel: "even"
    },
    {
      matching: [4, 8, 12],
      intruders: [3, 5, 7, 9],
      matchingLabel: "even",
      intruderLabel: "odd"
    }
  ]

  const family = chooseOne<OddEvenFamily>(families)
  const intruder = chooseOne<number>(family.intruders)

  const explanation =
    `${family.matching[0]}, ${family.matching[1]}, and ${family.matching[2]} are ${family.matchingLabel} numbers.   ${intruder} is ${family.intruderLabel}.`

  return buildQuestion([...family.matching, intruder], intruder, explanation, difficulty)
}

export function generateNumberPropertiesQuestion(
  difficulty: Difficulty
): Question {
  switch (difficulty) {
    case 1:
      return chooseOne([
        generateOddEvenQuestion(1),
        generateMultipleQuestion(1),
        generateFactorQuestion(1)
      ])

    case 2:
      return chooseOne([
        generateMultipleQuestion(2),
        generateFactorQuestion(2),
        generateOddEvenQuestion(2)
      ])

    case 3:
      return chooseOne([
        generatePrimeQuestion(3),
        generateCompositeQuestion(3),
        generateSquareNumberQuestion(3),
        generateFactorQuestion(3)
      ])

    case 4:
    default:
      return chooseOne([
        generatePrimeQuestion(4),
        generateCompositeQuestion(4),
        generateSquareNumberQuestion(4),
        generateFactorQuestion(4),
        generateMultipleQuestion(4)
      ])
  }
}