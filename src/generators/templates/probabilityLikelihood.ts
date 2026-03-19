import type { Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "probability_likelihood"
const TEMPLATE_KEY = "probability_likelihood"

type AnimalToy = {
  emoji: string
  name: string
}

const ANIMALS: AnimalToy[] = [
  { emoji: "🐱", name: "cat" },
  { emoji: "🐶", name: "dog" },
  { emoji: "🐰", name: "rabbit" },
  { emoji: "🐻", name: "bear" },
  { emoji: "🐵", name: "monkey" },
  { emoji: "🐸", name: "frog" }
]

function buildTenFrameItems(animal: AnimalToy, count: number): string[] {
  return Array.from({ length: count }, () => animal.emoji)
}

function buildMostLikelyQuestion(): Question {
  const animals = shuffle([...ANIMALS])
  const likely = animals[0]
  const other = animals[1]

  const items = shuffle([
    ...buildTenFrameItems(likely, 9),
    ...buildTenFrameItems(other, 1)
  ])

  const options = [likely.emoji, other.emoji, "Same chance", "Not sure"]
  const shuffledOptions = shuffle(options)
  const correctIndex = shuffledOptions.findIndex(o => o === likely.emoji)

  return {
    prompt: `These emoji toys are in a bag and you cannot see them.

Which one are you most LIKELY to pick?`,
    options: shuffledOptions,
    correctIndex,
    explanation: `There are more ${likely.name}s than ${other.name}s. You are more likely to pick a ${likely.name}.`,
    concept: CONCEPT,
    difficulty: 1,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "scattered_objects",
      items
    }
  } as Question
}

function buildUnlikelyQuestion(): Question {
  const animals = shuffle([...ANIMALS])
  const many = animals[0]
  const rare = animals[1]

  const items = shuffle([
    ...buildTenFrameItems(many, 9),
    ...buildTenFrameItems(rare, 1)
  ])

  const options = [many.emoji, rare.emoji, "Same chance", "Not sure"]
  const shuffledOptions = shuffle(options)
  const correctIndex = shuffledOptions.findIndex(o => o === rare.emoji)

  return {
    prompt: `These emoji toys are in a bag and you cannot see them.

Which one are you UNLIKELY to pick?`,
    options: shuffledOptions,
    correctIndex,
    explanation: `There is only one ${rare.name} and many ${many.name}s. You are unlikely to pick a ${rare.name}.`,
    concept: CONCEPT,
    difficulty: 1,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "scattered_objects",
      items
    }
  } as Question
}

function buildImpossibleQuestion(): Question {
  const animals = shuffle([...ANIMALS])
  const first = animals[0]
  const second = animals[1]
  const missing = animals[2]

  const items = shuffle([
    ...buildTenFrameItems(first, 5),
    ...buildTenFrameItems(second, 5)
  ])

  const options = ["Impossible", "Unlikely", "Likely", "Certain"]

  return {
    prompt: `These emoji toys are in a bag and you cannot see them.

What is the chance of picking a ${missing.name}?`,
    options,
    correctIndex: 0,
    explanation: `There are no ${missing.name}s in the bag. Picking a ${missing.name} is impossible.`,
    concept: CONCEPT,
    difficulty: 1,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "scattered_objects",
      items
    }
  } as Question
}

function buildAlwaysQuestion(): Question {
  const animal = chooseOne(ANIMALS)
  const items = buildTenFrameItems(animal, 10)

  const options = ["Impossible", "Unlikely", "Likely", "Certain"]

  return {
    prompt: `These emoji toys are in a bag and you cannot see them.

What is the chance of picking a ${animal.name}?`,
    options,
    correctIndex: 3,
    explanation: `All of the emoji toys are ${animal.name}s. Picking a ${animal.name} is certain. That means it will always happen.`,
    concept: CONCEPT,
    difficulty: 1,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true,
    visual: {
      type: "scattered_objects",
      items
    }
  } as Question
}

export function generateProbabilityLikelihoodQuestion(): Question {
  const builders = [
    buildMostLikelyQuestion,
    buildUnlikelyQuestion,
    buildImpossibleQuestion,
    buildAlwaysQuestion
  ]

  return chooseOne(builders)()
}