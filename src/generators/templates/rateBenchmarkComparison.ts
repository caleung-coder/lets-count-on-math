import type { Difficulty, Question } from "../../types"
import { shuffle } from "../utils"

const CONCEPT = "rate_benchmark"

function buildQuestion(
  options: string[],
  intruder: string,
  explanation: string,
  difficulty: Difficulty,
  templateKey: "rates_benchmark_pay" | "rates_benchmark_speed"
): Question {

  const shuffled = shuffle(options)
  const correctIndex = shuffled.findIndex(o => o === intruder)

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

function generatePayRateQuestion(difficulty: Difficulty): Question {

  const benchmarkRates = [10, 12, 15, 18, 20]
  const hours = [1, 2, 4, 5, 8, 10]

  const rate = benchmarkRates[Math.floor(Math.random() * benchmarkRates.length)]

  // Difficulty 1 always includes 1 hour
  const anchorHours =
    difficulty === 1
      ? [1, 2, 4]
      : shuffle(hours).slice(0, 3)

  const matchingOptions = anchorHours.map(h => `$${rate * h} for ${h} hour${h > 1 ? "s" : ""}`)

  const intruderHour = hours[Math.floor(Math.random() * hours.length)]
  const intruderValue = rate * intruderHour + Math.floor(rate * 0.5) + 1

  const intruder = `$${intruderValue} for ${intruderHour} hour${intruderHour > 1 ? "s" : ""}`

  const options = [...matchingOptions, intruder]

  const explanation =
    `${matchingOptions[0]}, ${matchingOptions[1]}, and ${matchingOptions[2]} are equivalent to $${rate} per hour.   ${intruder} is not.`

  return buildQuestion(options, intruder, explanation, difficulty, "rates_benchmark_pay")
}

function generateSpeedRateQuestion(difficulty: Difficulty): Question {

  const rate = 60

  const options = [
    "60 km in 1 h",
    "120 km in 2 h",
    "180 km in 3 h",
    "150 km in 3 h"
  ]

  const explanation =
    "60 km in 1 h, 120 km in 2 h, and 180 km in 3 h are equivalent to 60 km per hour.   150 km in 3 h is not."

  return buildQuestion(options, "150 km in 3 h", explanation, difficulty, "rates_benchmark_speed")
}

export function generateRateBenchmarkComparisonQuestion(
  difficulty: Difficulty,
  templateKey: "rates_benchmark_pay" | "rates_benchmark_speed" = "rates_benchmark_pay"
): Question {

  if (templateKey === "rates_benchmark_speed") {
    return generateSpeedRateQuestion(difficulty)
  }

  return generatePayRateQuestion(difficulty)
}