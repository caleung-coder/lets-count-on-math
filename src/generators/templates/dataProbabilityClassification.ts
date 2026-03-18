import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "which_one_doesnt_belong"
const TEMPLATE_KEY = "data_probability_classification"

type Variant = {
  options: string[]
  intruder: string
  explanation: string
}

function buildQuestion(variant: Variant, difficulty: Difficulty): Question {
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

function generateKindergartenCategoryQuestion(difficulty: Difficulty): Question {
  const variant = chooseOne<Variant>([
    {
      options: ["🍎 Apple", "🍌 Banana", "👕 Shirt", "🍕 Pizza slice"],
      intruder: "👕 Shirt",
      explanation:
        "Apple; banana; and pizza slice are foods. A shirt is a piece of clothing."
    },
    {
      options: ["👕 Shirt", "🧢 Cap", "👟 Shoe", "🍎 Apple"],
      intruder: "🍎 Apple",
      explanation:
        "Shirt; cap; and shoe are clothing items. An apple is a food."
    },
    {
      options: ["🚗 Car", "🚌 Bus", "🚲 Bicycle", "⚽ Soccer ball"],
      intruder: "⚽ Soccer ball",
      explanation:
        "Car; bus; and bicycle are vehicles. A soccer ball is sports equipment."
    },
    {
      options: ["⚽ Soccer ball", "🏀 Basketball", "🎾 Tennis ball", "🚗 Car"],
      intruder: "🚗 Car",
      explanation:
        "Soccer ball; basketball; and tennis ball are sports equipment. A car is a vehicle."
    },
    {
      options: ["🐦 Bird", "🦅 Eagle", "🕊️ Dove", "✈️ Airplane"],
      intruder: "✈️ Airplane",
      explanation:
        "Bird; eagle; and dove are birds. An airplane is not a bird."
    },
    {
      options: ["✈️ Airplane", "🚁 Helicopter", "🛩️ Small plane", "🐦 Bird"],
      intruder: "🐦 Bird",
      explanation:
        "Airplane; helicopter; and small plane are aircraft. A bird is not an aircraft."
    },
    {
      options: ["🍎 Apple", "🍌 Banana", "🍪 Cookie", "👟 Shoe"],
      intruder: "👟 Shoe",
      explanation:
        "Apple; banana; and cookie are foods. A shoe is clothing."
    },
    {
      options: ["👖 Pants", "👕 Shirt", "🧥 Jacket", "🍕 Pizza slice"],
      intruder: "🍕 Pizza slice",
      explanation:
        "Pants; shirt; and jacket are clothing items. A pizza slice is food."
    }
  ])

  return buildQuestion(variant, difficulty)
}

function generateProbabilityLanguageQuestion(difficulty: Difficulty): Question {
  const variant = chooseOne<Variant>([
    {
      options: ["Certain", "Likely", "Impossible", "Banana"],
      intruder: "Banana",
      explanation:
        "Certain; likely; and impossible are probability words. Banana is not a probability word."
    },
    {
      options: ["Unlikely", "Likely", "Certain", "Shirt"],
      intruder: "Shirt",
      explanation:
        "Unlikely; likely; and certain are probability words. Shirt is not a probability word."
    },
    {
      options: ["Certain", "Impossible", "Maybe", "Bus"],
      intruder: "Bus",
      explanation:
        "Certain; impossible; and maybe are words used to talk about chance. Bus is not."
    }
  ])

  return buildQuestion(variant, difficulty)
}

function generateSortingQuestion(difficulty: Difficulty): Question {
  const variant = chooseOne<Variant>([
    {
      options: ["🐱 Cat", "🐶 Dog", "🐰 Rabbit", "🧢 Cap"],
      intruder: "🧢 Cap",
      explanation:
        "Cat; dog; and rabbit are animals. A cap is clothing."
    },
    {
      options: ["🍎 Apple", "🍌 Banana", "🍕 Pizza slice", "🚌 Bus"],
      intruder: "🚌 Bus",
      explanation:
        "Apple; banana; and pizza slice are foods. A bus is a vehicle."
    },
    {
      options: ["🚗 Car", "🚌 Bus", "🚲 Bicycle", "👕 Shirt"],
      intruder: "👕 Shirt",
      explanation:
        "Car; bus; and bicycle are vehicles. A shirt is clothing."
    }
  ])

  return buildQuestion(variant, difficulty)
}

export function generateDataProbabilityClassificationQuestion(
  difficulty: Difficulty
): Question {
  switch (difficulty) {
    case 1:
      return generateKindergartenCategoryQuestion(1)

    case 2:
      return chooseOne([
        generateKindergartenCategoryQuestion(2),
        generateSortingQuestion(2),
        generateProbabilityLanguageQuestion(2)
      ])

    case 3:
      return chooseOne([
        generateSortingQuestion(3),
        generateProbabilityLanguageQuestion(3)
      ])

    case 4:
    default:
      return chooseOne([
        generateSortingQuestion(4),
        generateProbabilityLanguageQuestion(4)
      ])
  }
}