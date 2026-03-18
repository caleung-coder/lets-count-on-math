import type { Difficulty } from "./types"

export type DevelopmentalStage =
  | "Recognition"
  | "Comparison"
  | "Classification"
  | "Reasoning"

export type ConceptInfo = {
  label: string
  counting: string
  structure: string
  stageByDifficulty?: Partial<Record<Difficulty, DevelopmentalStage>>
}

const defaultStageByDifficulty: Record<Difficulty, DevelopmentalStage> = {
  1: "Recognition",
  2: "Comparison",
  3: "Classification",
  4: "Reasoning"
}

export const CONCEPTS: Record<string, ConceptInfo> = {
  which_one_doesnt_belong: {
    label: "Which One Doesn't Belong?",
    counting: "Shared attributes and the object that does not fit the group.",
    structure:
      "Objects can be grouped by a common attribute, category, or function, and one object can be identified as not belonging."
  },
  attribute_classification: {
    label: "Attribute Classification",
    counting: "Types of objects.",
    structure: "Objects can be grouped by shared attributes."
  },

  counting_objects: {
    label: "Counting Objects",
    counting: "Like items in a set.",
    structure: "Subitizing with like items in a die face pattern."
  },

  ordinal_position: {
    label: "Ordinal Position",
    counting: "Position in an ordered sequence.",
    structure: "Using ordinal placement language (first, second, third, etc.)."
  },

  which_group_has_more: {
    label: "Which Group Has More?",
    counting: "Items in two separate groups.",
    structure: "Comparing groups to determine which has more."
  },

  symbol_classification: {
    label: "Symbol Classification",
    counting: "Types of symbols.",
    structure: "Symbols can be grouped by shared features."
  },
  shape_classification: {
    label: "Shape Classification",
    counting: "Types of shapes and their properties.",
    structure: "Shapes can be grouped by sides, angles, and family relationships."
  },
  measurement_classification: {
    label: "Measurement Classification",
    counting: "What attribute is being measured and which units belong to it.",
    structure:
      "Units can be grouped by the type of measurement they describe, such as length, mass, capacity, or time."
  },
  data_probability_classification: {
    label: "Data and Probability Classification",
    counting: "Ways to describe chance.",
    structure: "Chance words can be grouped by how they describe probability."
  },

  probability_likelihood: {
    label: "Probability Likelihood",
    counting: "The number of desired outcome possibilities.",
    structure: "Using appropriate probability language (likely, unlikely, certain, impossible) based on a given set of items."
  },

  composing_5: {
    label: "Composing 5",
    counting: "Number pairs that add to 5.",
    structure: "Recognition of combinations that make 5."
  },

  which_group_has_less: {
    label: "Which Group Has Less?",
    counting: "Quantity of items in two different groups.",
    structure: "Comparing the groups to determine which has less."
  },

  counting_objects_total: {
    label: "Counting Objects Total",
    counting: "Number of total objects.",
    structure: 'Understanding that "altogether" means the total of everything.'
  },

  pattern_block_counting: {
    label: "Pattern Block Counting",
    counting: "The number of pattern blocks.",
    structure: "Counting like geometric shapes."
  },

  composing_10: {
   label: "Composing 10",
    counting: "Number pairs that add to 10.",
    structure: "Recognition of combinations that make 10."
  },

  ten_frame_quantity: {
    label: "Ten Frame Quantity",
    counting: "Like items in a ten-frame.",
    structure: "Counting like items in a 5+5 (ten-frame) structure."
  },

  compare_quantities: {
    label: "Compare Quantities",
    counting: "Quantity of items in multiple groups.",
    structure: "Comparing groups to determine which has the most."
  },
  
  number_sequences: {
    label: "Number Sequences",
    counting: "The step (amount of increase) between numbers in each sequence.",
    structure: "Comparing sequences based on their counting rule to identify which is different."
  },

  comparison_difference: {
    label: "Comparison Difference",
    counting: "The difference between two groups (what is left over).",
    structure: "Subtractive comparison between two groups to find the difference."
  },

  // ✅ Added for Q6
  visual_pattern_recognition: {
    label: "Visual Pattern Recognition",
    counting: "The repeating unit in a visual pattern.",
    structure:
      "A visual pattern repeats in the same order. We can identify the repeating part (the unit)."
  },

  visual_pattern_next: {
    label: "Visual Pattern Extension",
    counting: "The repeating unit and the position in the pattern.",
    structure: "Extending a repeating pattern by continuing the same unit in the same order."
  },

  number_properties: {
    label: "Number Properties",
    counting: "Numbers and their factor relationships.",
    structure:
      "Classification of numbers (odd/even, multiples, prime vs. composite, square numbers, factors)."
  },

  sequence_patterns: {
    label: "Sequence Patterns",
    counting: "How many and what kind of elements are in the sequence's core unit.",
    structure: "A repeating pattern made from a core unit (pattern block) that continues in the same order."
  },

  additive_equivalence: {
    label: "Additive Equivalence",
    counting: "Totals represented by expressions.",
    structure: "Different expressions can represent the same total."
  },
  operation_type: {
    label: "Operation Type",
    counting: "Types of operations.",
    structure: "Expressions can be grouped by the operation they use."
  },
  fraction_equivalence: {
    label: "Fraction Equivalence",
    counting: "Parts of the same whole.",
    structure: "Different fractions can represent the same quantity."
  },
  fraction_magnitude: {
    label: "Fraction Magnitude",
    counting: "Sizes of fractions compared to each other or to one-half.",
    structure: "Fractions can be grouped by size, benchmark, numerator, or denominator."
  },
  fractions_benchmark: {
    label: "Fraction Benchmark Comparison",
    counting: "How fractions compare to one-half.",
    structure:
      "Fractions can be grouped by whether they are less than, equal to, or greater than 1/2."
  },
  fraction_relationships: {
    label: "Fraction Relationships",
    counting: "Relative size of parts of a whole.",
    structure: "Relationships between numerator and denominator."
  },
  fraction_decimal_percent: {
    label: "Fraction, Decimal, and Percent Equivalence",
    counting: "Different forms that can represent the same quantity.",
    structure: "Fractions, decimals, and percents can be grouped when they represent the same value."
  },
  rational_number_forms: {
    label: "Rational Number Forms",
    counting: "Total parts of a whole.",
    structure: "Mixed numbers and improper fractions can represent the same quantity."
  },
  algebraic_expressions: {
    label: "Algebraic Expressions",
    counting: "Types of expressions.",
    structure: "Expressions can be grouped by algebraic form."
  },
  function_families: {
    label: "Function Families",
    counting: "Types of functions.",
    structure: "Functions can be grouped into families with shared structure."
  }
}

const fallbackConcept: ConceptInfo = {
  label: "Unknown concept",
  counting: "The quantity based on properties that makes the items belong together.",
  structure: "Classifying and grouping for counting mathematical objects."
}

export function getConceptInfo(concept: string): ConceptInfo {
  return CONCEPTS[concept] ?? {
    ...fallbackConcept,
    label: concept || fallbackConcept.label
  }
}

export function getDevelopmentalStage(
  concept: string,
  difficulty: Difficulty
): DevelopmentalStage {
  const info = getConceptInfo(concept)
  return info.stageByDifficulty?.[difficulty] ?? defaultStageByDifficulty[difficulty]
}