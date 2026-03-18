import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "ratio_benchmark"

type RatioVariant = {
  benchmark: string
  matching: string[]
  intruder: string
  explanation: string
  templateKey: string
}

function buildQuestion(
  variant: RatioVariant,
  difficulty: Difficulty
): Question {
  const options = shuffle([...variant.matching, variant.intruder])
  const correctIndex = options.findIndex(option => option === variant.intruder)

  return {
    prompt: "Which does NOT belong?",
    options,
    correctIndex,
    explanation: variant.explanation,
    concept: CONCEPT,
    difficulty,
    templateKey: variant.templateKey,
    kind: "text",
    countsForScore: true
  }
}

function benchmarkOneToTwo(difficulty: Difficulty): Question {
  const variant = chooseOne<RatioVariant>([
    {
      benchmark: "1 : 2",
      matching: ["2 : 4", "3 : 6", "4 : 8"],
      intruder: "3 : 7",
      explanation:
        "2 : 4, 3 : 6, and 4 : 8 are equivalent to 1 : 2.   3 : 7 is not.",
      templateKey: "ratios_benchmark_1_to_2"
    },
    {
      benchmark: "1 : 2",
      matching: ["5 : 10", "6 : 12", "7 : 14"],
      intruder: "6 : 11",
      explanation:
        "5 : 10, 6 : 12, and 7 : 14 are equivalent to 1 : 2.   6 : 11 is not.",
      templateKey: "ratios_benchmark_1_to_2"
    }
  ])

  return buildQuestion(variant, difficulty)
}

function benchmarkOneToThree(difficulty: Difficulty): Question {
  const variant = chooseOne<RatioVariant>([
    {
      benchmark: "1 : 3",
      matching: ["2 : 6", "3 : 9", "4 : 12"],
      intruder: "5 : 11",
      explanation:
        "2 : 6, 3 : 9, and 4 : 12 are equivalent to 1 : 3.   5 : 11 is not.",
      templateKey: "ratios_benchmark_1_to_3"
    },
    {
      benchmark: "1 : 3",
      matching: ["5 : 15", "6 : 18", "7 : 21"],
      intruder: "7 : 20",
      explanation:
        "5 : 15, 6 : 18, and 7 : 21 are equivalent to 1 : 3.   7 : 20 is not.",
      templateKey: "ratios_benchmark_1_to_3"
    }
  ])

  return buildQuestion(variant, difficulty)
}

function benchmarkTwoToThree(difficulty: Difficulty): Question {
  const variant = chooseOne<RatioVariant>([
    {
      benchmark: "2 : 3",
      matching: ["4 : 6", "6 : 9", "8 : 12"],
      intruder: "5 : 7",
      explanation:
        "4 : 6, 6 : 9, and 8 : 12 are equivalent to 2 : 3.   5 : 7 is not.",
      templateKey: "ratios_benchmark_2_to_3"
    },
    {
      benchmark: "2 : 3",
      matching: ["10 : 15", "12 : 18", "14 : 21"],
      intruder: "14 : 20",
      explanation:
        "10 : 15, 12 : 18, and 14 : 21 are equivalent to 2 : 3.   14 : 20 is not.",
      templateKey: "ratios_benchmark_2_to_3"
    }
  ])

  return buildQuestion(variant, difficulty)
}

function benchmarkThreeToTwo(difficulty: Difficulty): Question {
  const variant = chooseOne<RatioVariant>([
    {
      benchmark: "3 : 2",
      matching: ["6 : 4", "9 : 6", "12 : 8"],
      intruder: "8 : 6",
      explanation:
        "6 : 4, 9 : 6, and 12 : 8 are equivalent to 3 : 2.   8 : 6 is not.",
      templateKey: "ratios_benchmark_3_to_2"
    },
    {
      benchmark: "3 : 2",
      matching: ["15 : 10", "18 : 12", "21 : 14"],
      intruder: "20 : 14",
      explanation:
        "15 : 10, 18 : 12, and 21 : 14 are equivalent to 3 : 2.   20 : 14 is not.",
      templateKey: "ratios_benchmark_3_to_2"
    }
  ])

  return buildQuestion(variant, difficulty)
}

export function generateRatioBenchmarkComparisonQuestion(
  difficulty: Difficulty,
  templateKey:
    | "ratios_benchmark_1_to_2"
    | "ratios_benchmark_1_to_3"
    | "ratios_benchmark_2_to_3"
    | "ratios_benchmark_3_to_2" = "ratios_benchmark_1_to_2"
): Question {
  switch (templateKey) {
    case "ratios_benchmark_1_to_3":
      return benchmarkOneToThree(difficulty)

    case "ratios_benchmark_2_to_3":
      return benchmarkTwoToThree(difficulty)

    case "ratios_benchmark_3_to_2":
      return benchmarkThreeToTwo(difficulty)

    case "ratios_benchmark_1_to_2":
    default:
      return benchmarkOneToTwo(difficulty)
  }
}