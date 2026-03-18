import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "visual_pattern_next"
const TEMPLATE_KEY = "visual_pattern_next"

type SymbolToken = "▲" | "■" | "⬢" | "⏢" | "◆"

type Variant = {
  stem: SymbolToken[]
  answer: SymbolToken
  distractors: SymbolToken[]
  explanation: string
}

function buildQuestion(variant: Variant, difficulty: Difficulty): Question {
  const choices = shuffle([variant.answer, ...variant.distractors])
  const correctIndex = choices.findIndex(choice => choice === variant.answer)

  return {
    prompt: "What comes next?",
    options: ["A", "B", "C", "D"],
    correctIndex,
    explanation: variant.explanation,
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "pattern_strip_missing",
      items: variant.stem
    },
    visualChoices: choices.map(symbol => ({
      type: "pattern_block_single",
      symbol
    }))
  } as Question
}

function variantsForDifficulty(difficulty: Difficulty): Variant[] {
  const ab: Variant[] = [
    {
      stem: ["▲", "■", "▲", "■"],
      answer: "▲",
      distractors: ["■", "◆", "⬢"],
      explanation:
        "The pattern is triangle, square, triangle, square, so the next shape is triangle."
    },
    {
      stem: ["◆", "⏢", "◆", "⏢"],
      answer: "◆",
      distractors: ["⏢", "▲", "■"],
      explanation:
        "The pattern is rhombus, trapezoid, rhombus, trapezoid, so the next shape is rhombus."
    },
    {
      stem: ["⬢", "▲", "⬢", "▲"],
      answer: "⬢",
      distractors: ["▲", "◆", "■"],
      explanation:
        "The pattern is hexagon, triangle, hexagon, triangle, so the next shape is hexagon."
    }
  ]

  const aab: Variant[] = [
    {
      stem: ["▲", "▲", "■", "▲", "▲"],
      answer: "■",
      distractors: ["▲", "◆", "⬢"],
      explanation:
        "The pattern is triangle, triangle, square, then it repeats. So the next shape is square."
    },
    {
      stem: ["◆", "◆", "⏢", "◆", "◆"],
      answer: "⏢",
      distractors: ["◆", "▲", "■"],
      explanation:
        "The pattern is rhombus, rhombus, trapezoid, then it repeats. So the next shape is trapezoid."
    },
    {
      stem: ["⬢", "⬢", "▲", "⬢", "⬢"],
      answer: "▲",
      distractors: ["⬢", "◆", "■"],
      explanation:
        "The pattern is hexagon, hexagon, triangle, then it repeats. So the next shape is triangle."
    }
  ]

  const abb: Variant[] = [
    {
      stem: ["▲", "■", "■", "▲", "■"],
      answer: "■",
      distractors: ["▲", "◆", "⬢"],
      explanation:
        "The pattern is triangle, square, square, then it repeats. So the next shape is square."
    },
    {
      stem: ["◆", "⏢", "⏢", "◆", "⏢"],
      answer: "⏢",
      distractors: ["◆", "▲", "■"],
      explanation:
        "The pattern is rhombus, trapezoid, trapezoid, then it repeats. So the next shape is trapezoid."
    },
    {
      stem: ["⬢", "▲", "▲", "⬢", "▲"],
      answer: "▲",
      distractors: ["⬢", "◆", "■"],
      explanation:
        "The pattern is hexagon, triangle, triangle, then it repeats. So the next shape is triangle."
    }
  ]

  const aabb: Variant[] = [
    {
      stem: ["▲", "▲", "■", "■", "▲", "▲", "■"],
      answer: "■",
      distractors: ["▲", "◆", "⬢"],
      explanation:
        "The pattern is triangle, triangle, square, square, then it repeats. So the next shape is square."
    },
    {
      stem: ["◆", "◆", "⏢", "⏢", "◆", "◆", "⏢"],
      answer: "⏢",
      distractors: ["◆", "▲", "■"],
      explanation:
        "The pattern is rhombus, rhombus, trapezoid, trapezoid, then it repeats. So the next shape is trapezoid."
    },
    {
      stem: ["⬢", "⬢", "▲", "▲", "⬢", "⬢", "▲"],
      answer: "▲",
      distractors: ["⬢", "◆", "■"],
      explanation:
        "The pattern is hexagon, hexagon, triangle, triangle, then it repeats. So the next shape is triangle."
    }
  ]

  const longerRepeat: Variant[] = [
    {
      stem: ["▲", "▲", "■", "▲", "▲", "■", "▲", "▲"],
      answer: "■",
      distractors: ["▲", "◆", "⬢"],
      explanation:
        "The pattern is triangle, triangle, square, and it repeats again and again. So the next shape is square."
    },
    {
      stem: ["◆", "◆", "⏢", "◆", "◆", "⏢", "◆", "◆"],
      answer: "⏢",
      distractors: ["◆", "▲", "■"],
      explanation:
        "The pattern is rhombus, rhombus, trapezoid, and it repeats again and again. So the next shape is trapezoid."
    },
    {
      stem: ["▲", "■", "■", "▲", "■", "■", "▲", "■"],
      answer: "■",
      distractors: ["▲", "◆", "⬢"],
      explanation:
        "The pattern is triangle, square, square, and it repeats again and again. So the next shape is square."
    }
  ]

  if (difficulty === 1) {
    return [...ab, ...aab, ...abb]
  }

  if (difficulty === 2) {
    return [...ab, ...aab, ...abb, ...aabb]
  }

  return [...ab, ...aab, ...abb, ...aabb, ...longerRepeat]
}

export function generateVisualPatternNextQuestion(
  difficulty: Difficulty
): Question {
  return buildQuestion(chooseOne(variantsForDifficulty(difficulty)), difficulty)
}