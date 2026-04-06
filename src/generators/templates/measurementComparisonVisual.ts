import type { Question } from "../../types"

type PromptType = "tallest" | "shortest" | "widest" | "narrowest"

type VisualChoice = {
  scaleX: number
  scaleY: number
}

type PromptConfig = {
  type: PromptType
  text: string
}

const PROMPTS: PromptConfig[] = [
  { type: "tallest", text: "Which one is the tallest?" },
  { type: "shortest", text: "Look at the height of the objects. Which one is the shortest?" },
  { type: "widest", text: "Which one is the widest?" },
  { type: "narrowest", text: "Which one is the narrowest?" }
]

const EMOJIS = ["🐻", "🐸", "🍎", "🚗"]

function chooseOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function generateMeasurementComparisonVisualQuestion(): Question {
  const prompt = chooseOne(PROMPTS)
  const emoji = chooseOne(EMOJIS)

const baseChoices = [
  { scaleX: 1, scaleY: 2.2, tag: "tallest" },
  { scaleX: 1, scaleY: 0.45, tag: "shortest" },
  { scaleX: 2.2, scaleY: 1, tag: "widest" },
  { scaleX: 0.45, scaleY: 1, tag: "narrowest" }
]

  const visualChoices = shuffle(baseChoices)
  const correctIndex = visualChoices.findIndex(choice => choice.tag === prompt.type)

  return {
    prompt: prompt.text,
    options: [emoji, emoji, emoji, emoji],
    correctIndex,
    explanation: `This one is the ${prompt.type}.`,
    concept: "measurement_comparison_visual",
    templateKey: "measurement_comparison_visual",
    difficulty: 1,
    kind: "text",
    countsForScore: true,
    visualChoices
  } as Question
}