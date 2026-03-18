import type { Difficulty, Question } from "../../types"
import { shuffle, chooseOne } from "../utils"

const CONCEPT = "integer_benchmark"

function buildQuestion(
  numbers: number[],
  correct: number,
  explanation: string,
  difficulty: Difficulty
): Question {

  const options = shuffle(numbers.map(n => String(n)))
  const correctIndex = options.findIndex(o => Number(o) === correct)

  return {
    prompt: "Which does NOT belong?",
    options,
    correctIndex,
    explanation,
    concept: CONCEPT,
    difficulty,
    templateKey: "integers_benchmark_zero",
    kind: "text",
    countsForScore: true
  }
}

function lessThanZero(difficulty: Difficulty): Question {

  const matching = chooseOne([
    [-5,-3,-1],
    [-6,-4,-2],
    [-9,-7,-3]
  ])

  const intruder = chooseOne([2,4,7,5])

  const explanation =
`${matching[0]}, ${matching[1]}, and ${matching[2]} are all less than 0.
${intruder} is greater than 0.`

  return buildQuestion([...matching, intruder], intruder, explanation, difficulty)
}

function greaterThanZero(difficulty: Difficulty): Question {

  const matching = chooseOne([
    [2,4,7],
    [1,3,5],
    [6,8,9]
  ])

  const intruder = chooseOne([-1,-3,-5,-7])

  const explanation =
`${matching[0]}, ${matching[1]}, and ${matching[2]} are all greater than 0.
${intruder} is less than 0.`

  return buildQuestion([...matching, intruder], intruder, explanation, difficulty)
}

export function generateIntegerBenchmarkComparisonQuestion(
  difficulty: Difficulty
): Question {

  switch(difficulty){

    case 1:
      return lessThanZero(1)

    case 2:
      return chooseOne([
        lessThanZero(2),
        greaterThanZero(2)
      ])

    case 3:
      return chooseOne([
        lessThanZero(3),
        greaterThanZero(3)
      ])

    case 4:
    default:
      return chooseOne([
        lessThanZero(4),
        greaterThanZero(4)
      ])
  }
}