import type { Difficulty, Question } from "../types"
import { generateAdditiveEquivalenceQuestion } from "./templates/additiveEquivalence"
import { generateCountingObjectsQuestion } from "./templates/countingObjects"
import { generateCountingObjectsTotalQuestion } from "./templates/countingObjectsTotal"
import { generateDataProbabilityClassificationQuestion } from "./templates/dataProbabilityClassification"
import { generateGeometryClassificationQuestion } from "./templates/geometryClassification"
import { generateHowManyMoreFewerObjectsQuestion } from "./templates/howManyMoreFewerObjects"
import { generateMeasurementClassificationQuestion } from "./templates/measurementClassification"
import { generateMoreFewerObjectsQuestion } from "./templates/moreFewerObjects"
import { generateOrdinalPositionQuestion } from "./templates/ordinalPosition"
import { generatePatternBlockCountingQuestion } from "./templates/patternBlockCounting"
import { generateProbabilityLikelihoodQuestion } from "./templates/probabilityLikelihood"
import { generateScatteredCountingObjectsQuestion } from "./templates/scatteredCountingObjects"
import { generateSequencePatternsQuestion } from "./templates/sequencePatterns"
import { generateTenFrameQuantityQuestion } from "./templates/tenFrameQuantity"
import { generateTenFrameRecognitionQuestion } from "./templates/tenFrameRecognition"
import { generateVisualPatternNextQuestion } from "./templates/visualPatternNext"
import { generateVisualPatternRecognitionQuestion } from "./templates/visualPatternRecognition"
import { generateWaysToMakeFiveQuestion } from "./templates/waysToMakeFive"
import { generateWaysToMake10Question } from "./templates/waysToMake10"
import { generateWhichGroupHasMoreQuestion } from "./templates/whichGroupHasMore"
import { generateWhichGroupHasMostRowsQuestion } from "./templates/whichGroupMostRows"

export type GradeSelection = "K" | "1" | "2"

type TemplateKey =
  | "additive_equivalence"
  | "geometry_classification"
  | "measurement_classification"
  | "data_probability_classification"
  | "probability_likelihood"
  | "sequence_patterns"
  | "ordinal_position"
  | "ten_frame_quantity"
  | "ten_frame_recognition"
  | "counting_objects"
  | "counting_objects_total"
  | "scattered_counting_objects"
  | "which_group_has_more"
  | "which_group_has_most_rows"
  | "more_fewer_objects"
  | "how_many_more_fewer_objects"
  | "ways_to_make_5"
  | "ways_to_make_10"
  | "pattern_block_counting"
  | "visual_pattern_recognition"
  | "visual_pattern_next"
  | "how_many_are_category"

const CATEGORY_POOLS = {
  animals: ["🐶", "🐱", "🐰", "🐻", "🐸", "🐵"],
  foods: ["🍎", "🍌", "🍇", "🍓", "🍕", "🥕"],
  clothes: ["👕", "👖", "👗", "🧢", "👟", "🧥"],
  vehicles: ["🚗", "🚌", "🚕", "🚜", "🚑"],
  sports: ["⚽", "🏀", "🏈", "🎾", "🏐", "🏓"]
} as const

type CategoryKey = keyof typeof CATEGORY_POOLS

function clampDifficulty(value: number): Difficulty {
  if (value <= 1) return 1
  if (value === 2) return 2
  if (value === 3) return 3
  return 4
}

function maxDifficultyForGrade(grade: GradeSelection): Difficulty {
  switch (grade) {
    case "K":
      return 1
    case "1":
    case "2":
    default:
      return 2
  }
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

function randomCategory(): CategoryKey {
  const keys = Object.keys(CATEGORY_POOLS) as CategoryKey[]
  return randomItem(keys)
}

function buildCategoryCountOptions(correct: number): string[] {
  const options = new Set<number>([correct])

  while (options.size < 4) {
    const candidate = Math.floor(Math.random() * 11)
    if (candidate !== correct) {
      options.add(candidate)
    }
  }

  return shuffle([...options]).map(String)
}

function generateHowManyAreCategoryQuestion(): Question {
  const targetCategory = randomCategory()
  const otherCategories = (Object.keys(CATEGORY_POOLS) as CategoryKey[]).filter(
    key => key !== targetCategory
  )

  const targetCount = 2 + Math.floor(Math.random() * 5) // 2..6
  const otherCount = 10 - targetCount

  const items: Array<{
    emoji: string
    category: CategoryKey
    isTarget: boolean
  }> = []

  for (let i = 0; i < targetCount; i += 1) {
    items.push({
      emoji: randomItem(CATEGORY_POOLS[targetCategory]),
      category: targetCategory,
      isTarget: true
    })
  }

  for (let i = 0; i < otherCount; i += 1) {
    const otherCategory = randomItem(otherCategories)
    items.push({
      emoji: randomItem(CATEGORY_POOLS[otherCategory]),
      category: otherCategory,
      isTarget: false
    })
  }

  const shuffledItems = shuffle(items)
  const options = buildCategoryCountOptions(targetCount)
  const correctIndex = options.findIndex(option => Number(option) === targetCount)

  const categoryLabels: Record<CategoryKey, string> = {
    animals: "animals",
    foods: "foods",
    clothes: "clothes",
    vehicles: "vehicles",
    sports: "sports equipment"
  }

  return {
    prompt: `How many are ${categoryLabels[targetCategory]}?`,
    options,
    correctIndex,
    explanation:
      targetCount === 1
        ? `There is 1 ${categoryLabels[targetCategory].slice(0, -1)}.`
        : `There are ${targetCount} ${categoryLabels[targetCategory]}.`,
    concept: "classification_counting",
    difficulty: 1,
    templateKey: "how_many_are_category",
    kind: "text",
    countsForScore: true,
    visual: {
      type: "scattered_objects",
      items: shuffledItems
    }
  } as Question
}

function allowedTemplatesForGrade(grade: GradeSelection): TemplateKey[] {
  if (grade === "K") {
    return [
      "data_probability_classification", // 1
      "ten_frame_quantity",              // 2
      "counting_objects",                // 3
      "ordinal_position",                // 4
      "which_group_has_more",            // 5
      "visual_pattern_recognition",      // 6
      "scattered_counting_objects",      // 7
      "probability_likelihood",          // 8
      "ways_to_make_5",                  // 9
      "more_fewer_objects",              // 10
      "geometry_classification",         // 11
      "counting_objects_total",          // 12
      "pattern_block_counting",          // 13
      "ways_to_make_10",                 // 14
      "measurement_classification",      // 15
      "which_group_has_most_rows",       // 16
      "how_many_more_fewer_objects",     // 17
      "sequence_patterns",               // 18
      "visual_pattern_next",             // 19
      "how_many_are_category"            // 20
    ]
  }

  if (grade === "1") {
    return [
      "ten_frame_quantity",
      "ten_frame_recognition",
      "counting_objects",
      "counting_objects_total",
      "scattered_counting_objects",
      "which_group_has_more",
      "more_fewer_objects",
      "ordinal_position",
      "ways_to_make_5",
      "pattern_block_counting",
      "geometry_classification",
      "visual_pattern_recognition",
      "visual_pattern_next",
      "data_probability_classification",
      "sequence_patterns",
      "additive_equivalence",
      "measurement_classification",
      "how_many_more_fewer_objects",
      "visual_pattern_next",
      "how_many_are_category"
    ]
  }

  return [
    "ten_frame_quantity",
    "ten_frame_recognition",
    "counting_objects",
    "counting_objects_total",
    "scattered_counting_objects",
    "which_group_has_more",
    "more_fewer_objects",
    "how_many_more_fewer_objects",
    "ordinal_position",
    "ways_to_make_10",
    "pattern_block_counting",
    "visual_pattern_recognition",
    "visual_pattern_next",
    "geometry_classification",
    "data_probability_classification",
    "sequence_patterns",
    "additive_equivalence",
    "measurement_classification",
    "visual_pattern_next",
    "how_many_are_category"
  ]
}

function difficultyForQuestionNumber(
  questionNumber: number,
  grade: GradeSelection
): Difficulty {
  let base: Difficulty

  if (questionNumber <= 7) base = 1
  else if (questionNumber <= 14) base = 2
  else if (questionNumber <= 17) base = 3
  else base = 4

  return Math.min(base, maxDifficultyForGrade(grade)) as Difficulty
}

export function cloneAsReview(question: Question): Question {
  return {
    ...question,
    countsForScore: false
  }
}

export function generateGameQuestion(
  questionNumber: number,
  grade: GradeSelection = "2"
): Question {
  const safeQuestionNumber = Math.min(Math.max(questionNumber, 1), 20)
  const difficulty = difficultyForQuestionNumber(safeQuestionNumber, grade)
  const roundPlan = allowedTemplatesForGrade(grade)
  const templateKey = roundPlan[(safeQuestionNumber - 1) % roundPlan.length]

  return generateQuestionByTemplate(templateKey, difficulty)
}

export function generatePracticeQuestion(
  templateKey: string,
  difficulty: Difficulty,
  grade: GradeSelection = "2"
): Question {
  const safeTemplate = normalizeTemplateKey(templateKey)
  const allowedTemplates = allowedTemplatesForGrade(grade)
  const finalTemplate = allowedTemplates.includes(safeTemplate)
    ? safeTemplate
    : allowedTemplates[0]

  const safeDifficulty = normalizePracticeDifficulty(difficulty, grade)

  return generateQuestionByTemplate(finalTemplate, safeDifficulty)
}

function normalizeTemplateKey(value: string): TemplateKey {
  switch (value) {
    case "additive_equivalence":
      return "additive_equivalence"
    case "geometry_classification":
      return "geometry_classification"
    case "measurement_classification":
      return "measurement_classification"
    case "data_probability_classification":
      return "data_probability_classification"
    case "probability_likelihood":
      return "probability_likelihood"
    case "sequence_patterns":
      return "sequence_patterns"
    case "ordinal_position":
      return "ordinal_position"
    case "ten_frame_quantity":
      return "ten_frame_quantity"
    case "ten_frame_recognition":
      return "ten_frame_recognition"
    case "counting_objects":
      return "counting_objects"
    case "counting_objects_total":
      return "counting_objects_total"
    case "scattered_counting_objects":
      return "scattered_counting_objects"
    case "which_group_has_more":
      return "which_group_has_more"
    case "which_group_has_most_rows":
      return "which_group_has_most_rows"
    case "more_fewer_objects":
      return "more_fewer_objects"
    case "how_many_more_fewer_objects":
      return "how_many_more_fewer_objects"
    case "ways_to_make_5":
      return "ways_to_make_5"
    case "ways_to_make_10":
      return "ways_to_make_10"
    case "pattern_block_counting":
      return "pattern_block_counting"
    case "visual_pattern_recognition":
      return "visual_pattern_recognition"
    case "visual_pattern_next":
      return "visual_pattern_next"
    case "how_many_are_category":
      return "how_many_are_category"
    default:
      return "counting_objects"
  }
}

function normalizePracticeDifficulty(
  difficulty: number,
  grade: GradeSelection
): Difficulty {
  return Math.min(
    clampDifficulty(difficulty),
    maxDifficultyForGrade(grade)
  ) as Difficulty
}

function generateQuestionByTemplate(
  templateKey: TemplateKey,
  difficulty: Difficulty
): Question {
  switch (templateKey) {
    case "ten_frame_quantity":
      return generateTenFrameQuantityQuestion(difficulty)

    case "ten_frame_recognition":
      return generateTenFrameRecognitionQuestion(difficulty)

    case "counting_objects":
      return generateCountingObjectsQuestion(difficulty)

    case "counting_objects_total":
      return generateCountingObjectsTotalQuestion(difficulty)

    case "scattered_counting_objects":
      return generateScatteredCountingObjectsQuestion(difficulty)

    case "which_group_has_more":
      return generateWhichGroupHasMoreQuestion(difficulty)

    case "which_group_has_most_rows":
      return generateWhichGroupHasMostRowsQuestion(difficulty)

    case "more_fewer_objects":
      return generateMoreFewerObjectsQuestion(difficulty)

    case "how_many_more_fewer_objects":
      return generateHowManyMoreFewerObjectsQuestion()

    case "ordinal_position":
      return generateOrdinalPositionQuestion(difficulty)

    case "ways_to_make_5":
      return generateWaysToMakeFiveQuestion(difficulty)

    case "ways_to_make_10":
      return generateWaysToMake10Question()

    case "pattern_block_counting":
      return generatePatternBlockCountingQuestion(difficulty)

    case "visual_pattern_recognition":
      return generateVisualPatternRecognitionQuestion(difficulty)

    case "visual_pattern_next":
      return generateVisualPatternNextQuestion(difficulty)

    case "additive_equivalence":
      return generateAdditiveEquivalenceQuestion(difficulty)

    case "geometry_classification":
      return generateGeometryClassificationQuestion(difficulty)

    case "measurement_classification":
      return generateMeasurementClassificationQuestion(difficulty)

    case "data_probability_classification":
      return generateDataProbabilityClassificationQuestion(difficulty)

    case "probability_likelihood":
      return generateProbabilityLikelihoodQuestion(difficulty)

    case "sequence_patterns":
      return generateSequencePatternsQuestion(difficulty)

    case "how_many_are_category":
      return generateHowManyAreCategoryQuestion()

    default:
      return generateCountingObjectsQuestion(difficulty)
  }
}