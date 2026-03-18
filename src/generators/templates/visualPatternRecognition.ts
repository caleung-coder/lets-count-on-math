import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "sequence_patterns"
const TEMPLATE_KEY = "visual_pattern_recognition"

type SymbolToken = "▲" | "■" | "⬢" | "⏢" | "◆"

type Variant = {
  reference: SymbolToken[]
  correct: SymbolToken[]
  distractors: SymbolToken[][]
  explanation: string
}

function samePatternQuestion(variant: Variant, difficulty: Difficulty): Question {
  const choices = shuffle([variant.correct, ...variant.distractors])

  const correctIndex = choices.findIndex(
    choice => JSON.stringify(choice) === JSON.stringify(variant.correct)
  )

  return {
    prompt: "Which pattern is the same?",
    options: ["A", "B", "C", "D"],
    correctIndex,
    explanation: variant.explanation,
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "pattern_strip",
      items: variant.reference
    },
    visualChoices: choices.map(items => ({
      type: "pattern_strip",
      items
    }))
  } as Question
}

function buildPatternVariants(): Variant[] {
  return [
    {
      reference: ["▲", "■", "▲", "■"],
      correct: ["▲", "■", "▲", "■"],
      distractors: [
        ["▲", "▲", "■", "■"],
        ["▲", "■", "■", "▲"],
        ["■", "■", "▲", "▲"]
      ],
      explanation:
        "The pattern is triangle, square, triangle, square. That is an AB pattern."
    },
    {
      reference: ["◆", "⏢", "◆", "⏢"],
      correct: ["◆", "⏢", "◆", "⏢"],
      distractors: [
        ["◆", "◆", "⏢", "⏢"],
        ["◆", "⏢", "⏢", "◆"],
        ["⏢", "⏢", "◆", "◆"]
      ],
      explanation:
        "The pattern is rhombus, trapezoid, rhombus, trapezoid. That is an AB pattern."
    },
    {
      reference: ["▲", "▲", "■", "■"],
      correct: ["▲", "▲", "■", "■"],
      distractors: [
        ["▲", "■", "▲", "■"],
        ["▲", "▲", "▲", "■"],
        ["■", "■", "▲", "▲"]
      ],
      explanation:
        "The pattern is triangle, triangle, square, square. That is an AABB pattern."
    },
    {
      reference: ["◆", "◆", "⏢", "⏢"],
      correct: ["◆", "◆", "⏢", "⏢"],
      distractors: [
        ["◆", "⏢", "◆", "⏢"],
        ["◆", "◆", "◆", "⏢"],
        ["⏢", "⏢", "◆", "◆"]
      ],
      explanation:
        "The pattern is rhombus, rhombus, trapezoid, trapezoid. That is an AABB pattern."
    },
    {
      reference: ["▲", "▲", "■", "▲", "▲", "■"],
      correct: ["▲", "▲", "■", "▲", "▲", "■"],
      distractors: [
        ["▲", "■", "■", "▲", "■", "■"],
        ["▲", "▲", "■", "■", "▲", "▲"],
        ["■", "▲", "▲", "■", "▲", "▲"]
      ],
      explanation:
        "The pattern is triangle, triangle, square, then it repeats. That is an AAB pattern."
    },
    {
      reference: ["◆", "◆", "⏢", "◆", "◆", "⏢"],
      correct: ["◆", "◆", "⏢", "◆", "◆", "⏢"],
      distractors: [
        ["◆", "⏢", "⏢", "◆", "⏢", "⏢"],
        ["◆", "◆", "⏢", "⏢", "◆", "◆"],
        ["⏢", "◆", "◆", "⏢", "◆", "◆"]
      ],
      explanation:
        "The pattern is rhombus, rhombus, trapezoid, then it repeats. That is an AAB pattern."
    },
    {
      reference: ["▲", "■", "■", "▲", "■", "■"],
      correct: ["▲", "■", "■", "▲", "■", "■"],
      distractors: [
        ["▲", "▲", "■", "▲", "▲", "■"],
        ["▲", "■", "■", "■", "▲", "■"],
        ["■", "■", "▲", "■", "■", "▲"]
      ],
      explanation:
        "The pattern is triangle, square, square, then it repeats. That is an ABB pattern."
    },
    {
      reference: ["◆", "⏢", "⏢", "◆", "⏢", "⏢"],
      correct: ["◆", "⏢", "⏢", "◆", "⏢", "⏢"],
      distractors: [
        ["◆", "◆", "⏢", "◆", "◆", "⏢"],
        ["◆", "⏢", "⏢", "⏢", "◆", "⏢"],
        ["⏢", "⏢", "◆", "⏢", "⏢", "◆"]
      ],
      explanation:
        "The pattern is rhombus, trapezoid, trapezoid, then it repeats. That is an ABB pattern."
    },
    {
      reference: ["▲", "▲", "■", "▲", "▲", "■", "▲", "▲", "■"],
      correct: ["▲", "▲", "■", "▲", "▲", "■", "▲", "▲", "■"],
      distractors: [
        ["▲", "■", "▲", "▲", "■", "▲", "▲", "■", "▲"],
        ["▲", "▲", "■", "■", "▲", "▲", "■", "■", "▲"],
        ["■", "▲", "▲", "■", "▲", "▲", "■", "▲", "▲"]
      ],
      explanation:
        "The pattern is triangle, triangle, square, and it repeats again and again."
    },
    {
      reference: ["◆", "◆", "⏢", "◆", "◆", "⏢", "◆", "◆", "⏢"],
      correct: ["◆", "◆", "⏢", "◆", "◆", "⏢", "◆", "◆", "⏢"],
      distractors: [
        ["◆", "⏢", "◆", "◆", "⏢", "◆", "◆", "⏢", "◆"],
        ["◆", "◆", "⏢", "⏢", "◆", "◆", "⏢", "⏢", "◆"],
        ["⏢", "◆", "◆", "⏢", "◆", "◆", "⏢", "◆", "◆"]
      ],
      explanation:
        "The pattern is rhombus, rhombus, trapezoid, and it repeats again and again."
    }
  ]
}

export function generateVisualPatternRecognitionQuestion(
  difficulty: Difficulty
): Question {
  const variants = buildPatternVariants()

  if (difficulty === 1) {
    return samePatternQuestion(
      chooseOne(
        variants.filter(v => v.reference.length <= 6)
      ),
      difficulty
    )
  }

  return samePatternQuestion(chooseOne(variants), difficulty)
}