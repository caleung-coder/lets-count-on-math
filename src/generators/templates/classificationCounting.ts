import type { Difficulty, Question } from "../../types"

const TEMPLATE_KEY = "classification_counting"
const CONCEPT = "classification_counting"

const CATEGORIES = [
  {
    name: "animals",
    items: ["🐶", "🐱", "🐻", "🐰", "🐸"]
  },
  {
    name: "foods",
    items: ["🍎", "🍌", "🍇", "🍓", "🍕"]
  },
  {
    name: "clothes",
    items: ["👕", "👖", "👗", "🧢", "🧥"]
  },
  {
    name: "vehicles",
    items: ["🚗", "🚲", "🚕", "🚙", "🛴"]
  }
]

type CategoryName = (typeof CATEGORIES)[number]["name"]

type ClassifiedItem = {
  emoji: string
  category: CategoryName
  isTarget: boolean
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function generateClassificationCountingQuestion(
  difficulty: Difficulty
): Question {
  const targetCategory = CATEGORIES[rand(0, CATEGORIES.length - 1)]

  let distractorCategory = CATEGORIES[rand(0, CATEGORIES.length - 1)]
  while (distractorCategory === targetCategory) {
    distractorCategory = CATEGORIES[rand(0, CATEGORIES.length - 1)]
  }

  const targetCount = rand(1, 4)
  const distractorCount = 6 - targetCount

  const items: ClassifiedItem[] = []

  for (let i = 0; i < targetCount; i++) {
    items.push({
      emoji: targetCategory.items[rand(0, targetCategory.items.length - 1)],
      category: targetCategory.name,
      isTarget: true
    })
  }

  for (let i = 0; i < distractorCount; i++) {
    items.push({
      emoji: distractorCategory.items[rand(0, distractorCategory.items.length - 1)],
      category: distractorCategory.name,
      isTarget: false
    })
  }

  const shuffled = shuffle(items)

  const options = [0, 1, 2, 3, 4]
  const correctIndex = options.indexOf(targetCount)

  let explanation = ""

  if (targetCount === 1) {
    explanation = `There is 1 ${targetCategory.name.slice(0, -1)}.`
  } else {
    explanation = `There are ${targetCount} ${targetCategory.name}.`
  }

  return {
    prompt: `How many are ${targetCategory.name}?`,
    options: options.map(String),
    correctIndex,
    explanation,
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "object_groups",
      targetCategory: targetCategory.name,
      groups: [
        {
          emoji: "",
          items: shuffled
        }
      ]
    }
  } as Question
}