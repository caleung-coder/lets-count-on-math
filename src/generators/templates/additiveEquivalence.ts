import type { Difficulty, Question } from "../../types"
import { randInt, shuffle } from "../utils"

const CONCEPT = "additive_equivalence"
const TEMPLATE_KEY = "additive_equivalence"

function makeAddExpression(total: number, allowZero: boolean, maxPart: number): string {
  const minA = allowZero ? 0 : 1
  const a = randInt(minA, Math.min(maxPart, total - 1))
  const b = total - a
  return `${a} + ${b}`
}

function buildUniqueExpressions(
  total: number,
  count: number,
  allowZero: boolean,
  maxPart: number
): string[] {
  const expressions = new Set<string>()

  while (expressions.size < count) {
    expressions.add(makeAddExpression(total, allowZero, maxPart))
  }

  return [...expressions]
}

function buildQuestion(
  matching: string[],
  intruder: string,
  targetTotal: number,
  intruderTotal: number,
  difficulty: Difficulty
): Question {
  const options = shuffle([...matching, intruder])
  const correctIndex = options.findIndex(x => x === intruder)

  const explanation = `${matching[0]}, ${matching[1]}, and ${matching[2]} all equal ${targetTotal}.  ${intruder} equals ${intruderTotal}.`

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

export function generateAdditiveEquivalenceQuestion(difficulty: Difficulty): Question {
  const targetTotal =
    difficulty === 1 ? randInt(5, 10)
    : difficulty === 2 ? randInt(8, 14)
    : difficulty === 3 ? randInt(10, 18)
    : randInt(12, 22)

  const intruderOffset =
    difficulty === 1 ? chooseOffset([1, 2])
    : difficulty === 2 ? chooseOffset([1, 2])
    : difficulty === 3 ? chooseOffset([1, 2, -1])
    : chooseOffset([1, -1, 2, -2])

  const intruderTotal = targetTotal + intruderOffset
  const allowZero = difficulty <= 2
  const maxPart = difficulty <= 2 ? targetTotal : Math.max(targetTotal - 1, 8)

  const matching = buildUniqueExpressions(targetTotal, 3, allowZero, maxPart)
  const intruder = buildUniqueExpressions(intruderTotal, 1, allowZero, maxPart + 2)[0]

  return buildQuestion(matching, intruder, targetTotal, intruderTotal, difficulty)
}

function chooseOffset(options: number[]): number {
  return options[randInt(0, options.length - 1)]
}