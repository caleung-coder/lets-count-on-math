import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "proportional_relationships"
const TEMPLATE_KEY = "proportional_relationships"

type RelationshipVariant = {
  options: string[]
  intruder: string
  explanation: string
}

function buildQuestion(
  variant: RelationshipVariant,
  difficulty: Difficulty
): Question {
  const options = shuffle(variant.options)
  const correctIndex = options.findIndex(option => option === variant.intruder)

  return {
    prompt: "Which does NOT belong?",
    options,
    correctIndex,
    explanation: variant.explanation,
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true
  }
}

function generateTimesTwoQuestion(difficulty: Difficulty): Question {
  const variant = chooseOne<RelationshipVariant>([
    {
      options: ["2 → 4", "3 → 6", "5 → 10", "4 → 9"],
      intruder: "4 → 9",
      explanation:
        "2 → 4, 3 → 6, and 5 → 10 follow the same multiplicative rule (×2).\n4 → 9 does not."
    },
    {
      options: ["4 → 8", "6 → 12", "7 → 14", "8 → 15"],
      intruder: "8 → 15",
      explanation:
        "4 → 8, 6 → 12, and 7 → 14 follow the same multiplicative rule (×2).\n8 → 15 does not."
    }
  ])

  return buildQuestion(variant, difficulty)
}

function generateTimesThreeQuestion(difficulty: Difficulty): Question {
  const variant = chooseOne<RelationshipVariant>([
    {
      options: ["3 → 9", "4 → 12", "5 → 15", "6 → 16"],
      intruder: "6 → 16",
      explanation:
        "3 → 9, 4 → 12, and 5 → 15 follow the same multiplicative rule (×3).\n6 → 16 does not."
    },
    {
      options: ["2 → 6", "6 → 18", "7 → 21", "8 → 20"],
      intruder: "8 → 20",
      explanation:
        "2 → 6, 6 → 18, and 7 → 21 follow the same multiplicative rule (×3).\n8 → 20 does not."
    }
  ])

  return buildQuestion(variant, difficulty)
}

export function generateProportionalRelationshipComparisonQuestion(
  difficulty: Difficulty
): Question {
  switch (difficulty) {
    case 1:
      return generateTimesTwoQuestion(1)

    case 2:
      return chooseOne([
        generateTimesTwoQuestion(2),
        generateTimesThreeQuestion(2)
      ])

    case 3:
      return chooseOne([
        generateTimesTwoQuestion(3),
        generateTimesThreeQuestion(3)
      ])

    case 4:
    default:
      return chooseOne([
        generateTimesTwoQuestion(4),
        generateTimesThreeQuestion(4)
      ])
  }
}