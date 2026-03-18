import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "measurement_classification"
const TEMPLATE_KEY = "measurement_classification"

function unitName(u: string): string {
  const names: Record<string, string> = {
    mm: "millimetres",
    cm: "centimetres",
    m: "metres",
    km: "kilometres",
    mg: "milligrams",
    g: "grams",
    kg: "kilograms",
    t: "tonnes",
    mL: "millilitres",
    L: "litres",
    kL: "kilolitres",
    s: "seconds",
    min: "minutes",
    h: "hours",
    day: "days"
  }

  return names[u] ?? u
}

function unitMeasure(u: string): string {
  const map: Record<string, string> = {
    mm: "length",
    cm: "length",
    m: "length",
    km: "length",
    mg: "mass",
    g: "mass",
    kg: "mass",
    t: "mass",
    mL: "capacity",
    L: "capacity",
    kL: "capacity",
    s: "time",
    min: "time",
    h: "time",
    day: "time"
  }

  return map[u] ?? "a different type of measurement"
}

function label(u: string): string {
  return `${u} (${unitName(u)})`
}

function buildQuestion(
  options: string[],
  correctValue: string,
  explanation: string,
  difficulty: Difficulty
): Question {

  const shuffled = shuffle(options)
  const correctIndex = shuffled.findIndex(x => x === correctValue)

  return {
    prompt: "Which does NOT belong?",
    options: shuffled,
    correctIndex,
    concept: CONCEPT,
    difficulty,
    explanation,
    templateKey: TEMPLATE_KEY,
    kind: "text",
    countsForScore: true
  }
}

/* LENGTH */

function generateLengthUnitsQuestion(difficulty: Difficulty): Question {

  const matching = chooseOne([
    ["cm", "m", "km"],
    ["mm", "cm", "m"]
  ])

  const intruder = chooseOne(["g", "kg", "L", "min"])

  const explanation =
    `${label(matching[0])}, ${label(matching[1])}, and ${label(matching[2])} are units used to measure length.   ${label(intruder)} measures ${unitMeasure(intruder)}.`

  return buildQuestion([...matching, intruder], intruder, explanation, difficulty)
}

/* MASS */

function generateMassUnitsQuestion(difficulty: Difficulty): Question {

  const matching = chooseOne([
    ["g", "kg", "t"],
    ["mg", "g", "kg"]
  ])

  const intruder = chooseOne(["cm", "m", "L", "h"])

  const explanation =
    `${label(matching[0])}, ${label(matching[1])}, and ${label(matching[2])} are units used to measure mass.   ${label(intruder)} measures ${unitMeasure(intruder)}.`

  return buildQuestion([...matching, intruder], intruder, explanation, difficulty)
}

/* CAPACITY */

function generateCapacityUnitsQuestion(difficulty: Difficulty): Question {

  const matching = chooseOne([
    ["mL", "L", "kL"]
  ])

  const intruder = chooseOne(["kg", "cm", "min", "g"])

  const explanation =
    `${label(matching[0])}, ${label(matching[1])}, and ${label(matching[2])} are units used to measure capacity.   ${label(intruder)} measures ${unitMeasure(intruder)}.`

  return buildQuestion([...matching, intruder], intruder, explanation, difficulty)
}

/* TIME */

function generateTimeUnitsQuestion(difficulty: Difficulty): Question {

  const matching = chooseOne([
    ["s", "min", "h"],
    ["min", "h", "day"]
  ])

  const intruder = chooseOne(["cm", "kg", "L", "g"])

  const explanation =
    `${label(matching[0])}, ${label(matching[1])}, and ${label(matching[2])} are units used to measure time.   ${label(intruder)} measures ${unitMeasure(intruder)}.`

  return buildQuestion([...matching, intruder], intruder, explanation, difficulty)
}

/* PERIMETER / LENGTH */

function generatePerimeterMeasureQuestion(difficulty: Difficulty): Question {

  const matching = chooseOne([
    ["cm", "m", "mm"],
    ["m", "km", "cm"]
  ])

  const intruder = chooseOne(["L", "kg", "min"])

  const explanation =
    `${label(matching[0])}, ${label(matching[1])}, and ${label(matching[2])} can be used to measure perimeter or length.   ${label(intruder)} measures ${unitMeasure(intruder)}.`

  return buildQuestion([...matching, intruder], intruder, explanation, difficulty)
}

export function generateMeasurementClassificationQuestion(
  difficulty: Difficulty
): Question {

  switch (difficulty) {

    case 1:
      return chooseOne([
        generateLengthUnitsQuestion(1),
        generateTimeUnitsQuestion(1)
      ])

    case 2:
      return chooseOne([
        generateLengthUnitsQuestion(2),
        generateMassUnitsQuestion(2),
        generateTimeUnitsQuestion(2)
      ])

    case 3:
      return chooseOne([
        generateMassUnitsQuestion(3),
        generateCapacityUnitsQuestion(3),
        generatePerimeterMeasureQuestion(3)
      ])

    case 4:
    default:
      return chooseOne([
        generateCapacityUnitsQuestion(4),
        generatePerimeterMeasureQuestion(4),
        generateTimeUnitsQuestion(4)
      ])
  }
}