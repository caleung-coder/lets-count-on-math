import type { Difficulty, Question } from "../../types"

const TEMPLATE_KEY = "sequence_patterns"
const CONCEPT = "number_sequences"

type PatternSpec = {
  step: number
  label: string
}

const COMMON_PATTERNS: PatternSpec[] = [
  { step: 1, label: "counting on by 1" },
  { step: 2, label: "counting on by 2" },
  { step: 5, label: "counting on by 5" },
  { step: 10, label: "counting on by 10" }
]

const DISTRACTOR_PATTERNS: PatternSpec[] = [
  { step: 1, label: "counting on by 1" },
  { step: 2, label: "counting on by 2" },
  { step: 3, label: "counting on by 3" },
  { step: 4, label: "counting on by 4" },
  { step: 5, label: "counting on by 5" },
  { step: 10, label: "counting on by 10" }
]

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function makeSequence(start: number, step: number, length: number): number[] {
  return Array.from({ length }, (_, i) => start + i * step)
}

function formatSequence(sequence: number[]): string {
  return sequence.join(", ")
}

function makeStartForStep(step: number, difficulty: Difficulty): number {
  if (difficulty === 1) {
    return randomInt(0, 10)
  }

  if (difficulty === 2) {
    if (step === 10) return randomInt(0, 4) * 10
    if (step === 5) return randomInt(0, 10) * 5
    return randomInt(0, 20)
  }

  if (difficulty === 3) {
    if (step === 10) return randomInt(0, 8) * 10
    if (step === 5) return randomInt(0, 16) * 5
    return randomInt(0, 40)
  }

  if (step === 10) return randomInt(0, 12) * 10
  if (step === 5) return randomInt(0, 20) * 5
  return randomInt(0, 60)
}

function sequenceLengthForDifficulty(difficulty: Difficulty): number {
  if (difficulty === 1) return 4
  if (difficulty === 2) return 4
  if (difficulty === 3) return 5
  return 5
}

function findDifferentPattern(
  commonStep: number,
  commonLabel: string,
  distractorStep: number,
  distractorLabel: string
): string {
  return `Three sequences show ${commonLabel}. One sequence shows ${distractorLabel}.`
}

export function generateSequencePatternsQuestion(
  difficulty: Difficulty
): Question {
  const commonPattern =
    COMMON_PATTERNS[randomInt(0, COMMON_PATTERNS.length - 1)]

  let distractorPattern =
    DISTRACTOR_PATTERNS[randomInt(0, DISTRACTOR_PATTERNS.length - 1)]

  while (distractorPattern.step === commonPattern.step) {
    distractorPattern =
      DISTRACTOR_PATTERNS[randomInt(0, DISTRACTOR_PATTERNS.length - 1)]
  }

  const length = sequenceLengthForDifficulty(difficulty)

  const commonStarts = new Set<number>()
  while (commonStarts.size < 3) {
    commonStarts.add(makeStartForStep(commonPattern.step, difficulty))
  }

  let distractorStart = makeStartForStep(distractorPattern.step, difficulty)
  while (commonStarts.has(distractorStart)) {
    distractorStart = makeStartForStep(distractorPattern.step, difficulty)
  }

  const commonOptions = [...commonStarts].map(start =>
    formatSequence(makeSequence(start, commonPattern.step, length))
  )

  const distractorOption = formatSequence(
    makeSequence(distractorStart, distractorPattern.step, length)
  )

  const options = shuffle([...commonOptions, distractorOption])
  const correctIndex = options.findIndex(option => option === distractorOption)

  return {
    prompt: "Which one does not belong?",
    options,
    correctIndex,
    explanation: findDifferentPattern(
      commonPattern.step,
      commonPattern.label,
      distractorPattern.step,
      distractorPattern.label
    ),
    concept: CONCEPT,
    difficulty,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true
  } as Question
}