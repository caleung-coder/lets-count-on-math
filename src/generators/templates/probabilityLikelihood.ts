import type { Question, VisualItem } from "../../types"

const CONCEPT = "probability_likelihood"
const TEMPLATE_KEY = "probability_likelihood"

type Pair = {
  a: string
  b: string
  labelA: string
  labelB: string
}

const PAIRS: Pair[] = [
  { a: "🚗", b: "🚌", labelA: "car", labelB: "bus" },
  { a: "🐶", b: "🐻", labelA: "dog", labelB: "bear" },
  { a: "⚽", b: "🏀", labelA: "soccer ball", labelB: "basketball" },
  { a: "🍎", b: "🍏", labelA: "red apple", labelB: "green apple" }
]

type CompareScenario = {
  kind: "compare"
  countA: number
  countB: number
}

type WordScenario = {
  kind: "word"
  countA: number
  countB: number
  askFor: "a" | "b" | "other"
}

function toVisualItems(items: string[]): VisualItem[] {
  return items.map(emoji => ({ emoji }))
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function pluralize(label: string): string {
  if (label.endsWith("s")) return label
  return `${label}s`
}

function buildCompareExplanation(
  countA: number,
  countB: number,
  pair: Pair
): string {
  if (countA === countB) {
    return `There are ${countA} ${pluralize(pair.labelA)} and ${countB} ${pluralize(pair.labelB)}. They are equally likely.`
  }

  if (countA > countB) {
    return `There are ${countA} ${pluralize(pair.labelA)} and ${countB} ${pluralize(pair.labelB)}. ${pair.labelA[0].toUpperCase() + pair.labelA.slice(1)} is more likely.`
  }

  return `There are ${countB} ${pluralize(pair.labelB)} and ${countA} ${pluralize(pair.labelA)}. ${pair.labelB[0].toUpperCase() + pair.labelB.slice(1)} is more likely.`
}

function buildWordExplanation(
  count: number,
  total: number,
  label: string,
  result: "certain" | "likely" | "unlikely" | "impossible"
): string {
  if (result === "certain") {
    return `All ${total} are ${pluralize(label)}. It will always happen.`
  }

  if (result === "impossible") {
    return `There are 0 ${pluralize(label)}. It is impossible.`
  }

  if (result === "likely") {
    return `${count} out of ${total} are ${pluralize(label)}. That is likely.`
  }

  return `${count} out of ${total} are ${pluralize(label)}. That is unlikely.`
}

function buildItems(pair: Pair, countA: number, countB: number): string[] {
  return shuffle([
    ...Array(countA).fill(pair.a),
    ...Array(countB).fill(pair.b)
  ])
}

function generateCompareQuestion(pair: Pair): Question {
  const scenarios: CompareScenario[] = [
    { kind: "compare", countA: 8, countB: 2 },
    { kind: "compare", countA: 7, countB: 3 },
    { kind: "compare", countA: 6, countB: 4 },
    { kind: "compare", countA: 5, countB: 5 }
  ]

  const scenario = randomItem(scenarios)
  const items = buildItems(pair, scenario.countA, scenario.countB)

  const options = [pair.a, pair.b, "equally likely", "not sure"]

  let correctIndex = 2
  if (scenario.countA > scenario.countB) correctIndex = 0
  if (scenario.countB > scenario.countA) correctIndex = 1

  return {
    prompt: `These emoji toys are in a bag. You cannot see inside.
Which is more likely?`,
    options,
    correctIndex,
    explanation: buildCompareExplanation(scenario.countA, scenario.countB, pair),
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

function generateWordQuestion(pair: Pair): Question {
  const scenarios: WordScenario[] = [
    { kind: "word", countA: 10, countB: 0, askFor: "a" },
    { kind: "word", countA: 10, countB: 0, askFor: "b" },
    { kind: "word", countA: 8, countB: 2, askFor: "a" },
    { kind: "word", countA: 8, countB: 2, askFor: "b" }
  ]

  const scenario = randomItem(scenarios)
  const items = buildItems(pair, scenario.countA, scenario.countB)

  let targetLabel = pair.labelA
  let targetCount = scenario.countA
  let correct: "certain" | "likely" | "unlikely" | "impossible" = "likely"

  if (scenario.askFor === "b") {
    targetLabel = pair.labelB
    targetCount = scenario.countB
  } else if (scenario.askFor === "other") {
    targetLabel = "other kind"
    targetCount = 0
  }

  if (targetCount === 10) correct = "certain"
  else if (targetCount === 0) correct = "impossible"
  else if (targetCount >= 6) correct = "likely"
  else correct = "unlikely"

  const options = ["certain", "likely", "unlikely", "impossible"]
  const correctIndex = options.indexOf(correct)

  return {
    prompt: `These emoji toys are in a bag. You cannot see inside.
What is the chance of picking a ${targetLabel}?`,
    options,
    correctIndex,
    explanation: buildWordExplanation(targetCount, 10, targetLabel, correct),
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
  const pair = randomItem(PAIRS)
  const subtype = Math.random() < 0.5 ? "compare" : "word"

  if (subtype === "compare") {
    return generateCompareQuestion(pair)
  }

  return generateWordQuestion(pair)
}