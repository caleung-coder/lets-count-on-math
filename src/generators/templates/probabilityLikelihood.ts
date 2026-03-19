import type { Question, VisualItem } from "../../types"

const CONCEPT = "probability_likelihood"
const TEMPLATE_KEY = "probability_likelihood"

function toVisualItems(items: string[]): VisualItem[] {
  return items.map(emoji => ({
    emoji
  }))
}

function buildQuestion(
  items: string[],
  correct: string,
  explanation: string
): Question {
  const options = ["more likely", "less likely", "equally likely", "not sure"]

  let correctIndex = 0

  if (correct === "more") correctIndex = 0
  if (correct === "less") correctIndex = 1
  if (correct === "equal") correctIndex = 2
  if (correct === "unknown") correctIndex = 3

  return {
    prompt: `These emoji toys are in a bag and you cannot see them.
Which is more likely?`,
    options,
    correctIndex,
    explanation,
    concept: CONCEPT,
    difficulty: 1,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "scattered_objects",
      items: toVisualItems(items)
    }
  }
}

export function generateProbabilityLikelihoodQuestion(): Question {
  const scenarios = [
    {
      items: ["🐶", "🐶", "🐶", "🐱"],
      correct: "more",
      explanation: "There are more dogs than cats, so dogs are more likely."
    },
    {
      items: ["🍎", "🍌", "🍌", "🍌"],
      correct: "less",
      explanation: "There are fewer apples than bananas, so apples are less likely."
    },
    {
      items: ["⚽", "🏀"],
      correct: "equal",
      explanation: "There are the same number of each, so they are equally likely."
    },
    {
      items: ["🚗", "🚗", "🚌"],
      correct: "unknown",
      explanation: "You might think cars are more likely, but we are not certain how they are picked."
    }
  ]

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]

  return buildQuestion(
    scenario.items,
    scenario.correct,
    scenario.explanation
  )
}