import type { Difficulty, Question } from "../../types"
import { chooseOne, shuffle } from "../utils"

const CONCEPT = "shape_classification"
const TEMPLATE_KEY = "geometry_classification"

type GeometryVariant = {
  options: string[]
  intruder: string
  explanation: string
}

const RIGHT_TRIANGLE = "◺ Right triangle"
const ISOSCELES_TRIANGLE = "△ Isosceles triangle"
const SCALENE_TRIANGLE = "◿ Scalene triangle"

const SQUARE = "□ Square"
const RECTANGLE = "▭ Rectangle"
const RHOMBUS = "◇ Rhombus"
const PARALLELOGRAM = "▱ Parallelogram"
const SMALL_CIRCLE = "○ Small circle"
const BIG_CIRCLE = "◯ Big circle"
const ELLIPSE = "⬭ Ellipse"
const PENTAGON = "⬠ Pentagon"
const HEXAGON = "⬡ Hexagon"

function buildQuestion(
  variant: GeometryVariant,
  difficulty: Difficulty
): Question {
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

function triangleSet(): [string, string, string] {
  return [RIGHT_TRIANGLE, ISOSCELES_TRIANGLE, SCALENE_TRIANGLE]
}

function curvedShapeSet(): [string, string, string] {
  return [SMALL_CIRCLE, BIG_CIRCLE, ELLIPSE]
}

function generateBasicPolygonQuestion(difficulty: Difficulty): Question {
  const [t1] = triangleSet()

  const variant = chooseOne<GeometryVariant>([
    {
      options: [SQUARE, RECTANGLE, RHOMBUS, SMALL_CIRCLE],
      intruder: SMALL_CIRCLE,
      explanation:
        "Square; rectangle; and rhombus are polygons. They are closed shapes made of straight sides. A circle is curved."
    },
    {
      options: [t1, PARALLELOGRAM, RHOMBUS, ELLIPSE],
      intruder: ELLIPSE,
      explanation:
        "Triangle; parallelogram; and rhombus are polygons. They are closed shapes made of straight sides. An ellipse is curved."
    },
    {
      options: [SQUARE, RECTANGLE, PARALLELOGRAM, BIG_CIRCLE],
      intruder: BIG_CIRCLE,
      explanation:
        "Square; rectangle; and parallelogram are polygons. They are closed shapes made of straight sides. A circle is curved."
    }
  ])

  return buildQuestion(variant, difficulty)
}

function generateQuadrilateralQuestion(difficulty: Difficulty): Question {
  const [t1] = triangleSet()

  const variant = chooseOne<GeometryVariant>([
    {
      options: [SQUARE, RECTANGLE, PARALLELOGRAM, t1],
      intruder: t1,
      explanation:
        "Square; rectangle; and parallelogram are quadrilaterals. They each have 4 sides. A triangle has 3 sides."
    },
    {
      options: [RHOMBUS, SQUARE, PARALLELOGRAM, HEXAGON],
      intruder: HEXAGON,
      explanation:
        "Rhombus; square; and parallelogram are quadrilaterals. They each have 4 sides. A hexagon has 6 sides."
    },
    {
      options: [RHOMBUS, RECTANGLE, PARALLELOGRAM, t1],
      intruder: t1,
      explanation:
        "Rhombus; rectangle; and parallelogram are quadrilaterals. They each have 4 sides. A triangle has 3 sides."
    },
    {
      options: [SQUARE, RECTANGLE, RHOMBUS, PENTAGON],
      intruder: PENTAGON,
      explanation:
        "Square; rectangle; and rhombus are quadrilaterals. They each have 4 sides. A pentagon has 5 sides."
    }
  ])

  return buildQuestion(variant, difficulty)
}

function generateTriangleQuestion(difficulty: Difficulty): Question {
  const [t1, t2, t3] = triangleSet()

  const variant = chooseOne<GeometryVariant>([
    {
      options: [t1, t2, t3, SQUARE],
      intruder: SQUARE,
      explanation:
        "The three triangles each have 3 sides. A square has 4 sides."
    },
    {
      options: [t1, t2, t3, PARALLELOGRAM],
      intruder: PARALLELOGRAM,
      explanation:
        "The three triangles each have 3 sides. A parallelogram has 4 sides."
    },
    {
      options: [t1, t2, t3, HEXAGON],
      intruder: HEXAGON,
      explanation:
        "The three triangles each have 3 sides. A hexagon has 6 sides."
    }
  ])

  return buildQuestion(variant, difficulty)
}

function generateStraightSidesQuestion(difficulty: Difficulty): Question {
  const [t1] = triangleSet()

  const variant = chooseOne<GeometryVariant>([
    {
      options: [t1, SQUARE, RECTANGLE, SMALL_CIRCLE],
      intruder: SMALL_CIRCLE,
      explanation:
        "Triangle; square; and rectangle are closed shapes made of straight sides. A circle is curved."
    },
    {
      options: [RHOMBUS, PARALLELOGRAM, SQUARE, ELLIPSE],
      intruder: ELLIPSE,
      explanation:
        "Rhombus; parallelogram; and square are closed shapes made of straight sides. An ellipse is curved."
    },
    {
      options: [RIGHT_TRIANGLE, RECTANGLE, PENTAGON, BIG_CIRCLE],
      intruder: BIG_CIRCLE,
      explanation:
        "Triangle; rectangle; and pentagon are closed shapes made of straight sides. A circle is curved."
    }
  ])

  return buildQuestion(variant, difficulty)
}

function generateCurvedShapeQuestion(difficulty: Difficulty): Question {
  const [smallCircle, bigCircle, ellipse] = curvedShapeSet()
  const [t1] = triangleSet()

  const variant = chooseOne<GeometryVariant>([
    {
      options: [ellipse, t1, smallCircle, bigCircle],
      intruder: t1,
      explanation:
        "Ellipse; small circle; and big circle are curved shapes. A triangle is made of straight sides."
    },
    {
      options: [smallCircle, bigCircle, ellipse, RECTANGLE],
      intruder: RECTANGLE,
      explanation:
        "The small circle; big circle; and ellipse are curved shapes. A rectangle is made of straight sides."
    },
    {
      options: [ellipse, smallCircle, bigCircle, RHOMBUS],
      intruder: RHOMBUS,
      explanation:
        "Ellipse; small circle; and big circle are curved shapes. A rhombus is made of straight sides."
    }
  ])

  return buildQuestion(variant, difficulty)
}

function generatePolygonFamilyQuestion(difficulty: Difficulty): Question {
  const [t1] = triangleSet()

  const variant = chooseOne<GeometryVariant>([
    {
      options: [PENTAGON, "⬠ Pentagon", "⬠ Pentagon", RECTANGLE],
      intruder: RECTANGLE,
      explanation:
        "The three pentagons each have 5 sides. A rectangle has 4 sides."
    },
    {
      options: [HEXAGON, "⬡ Hexagon", "⬡ Hexagon", t1],
      intruder: t1,
      explanation:
        "The three hexagons each have 6 sides. A triangle has 3 sides."
    },
    {
      options: [HEXAGON, "⬡ Hexagon", "⬡ Hexagon", PARALLELOGRAM],
      intruder: PARALLELOGRAM,
      explanation:
        "The three hexagons each have 6 sides. A parallelogram has 4 sides."
    }
  ])

  return buildQuestion(variant, difficulty)
}

export function generateGeometryClassificationQuestion(
  difficulty: Difficulty
): Question {
  switch (difficulty) {
    case 1:
      return chooseOne([
        generateStraightSidesQuestion(1),
        generateBasicPolygonQuestion(1),
        generateQuadrilateralQuestion(1),
        generateTriangleQuestion(1),
        generateCurvedShapeQuestion(1)
      ])

    case 2:
      return chooseOne([
        generateStraightSidesQuestion(2),
        generateBasicPolygonQuestion(2),
        generateQuadrilateralQuestion(2),
        generateTriangleQuestion(2),
        generatePolygonFamilyQuestion(2),
        generateCurvedShapeQuestion(2)
      ])

    case 3:
      return chooseOne([
        generateBasicPolygonQuestion(3),
        generateQuadrilateralQuestion(3),
        generateTriangleQuestion(3),
        generatePolygonFamilyQuestion(3),
        generateCurvedShapeQuestion(3)
      ])

    case 4:
    default:
      return chooseOne([
        generateBasicPolygonQuestion(4),
        generateQuadrilateralQuestion(4),
        generateTriangleQuestion(4),
        generatePolygonFamilyQuestion(4),
        generateCurvedShapeQuestion(4)
      ])
  }
}