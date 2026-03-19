export type Mode = "game" | "practice"

export type TextOption =
  | string
  | {
      label: string
    }
  | {
      kind: "text"
      text: string
    }

export type FractionOption = {
  kind: "fraction"
  numerator: number
  denominator: number
  whole?: number
}

export type QuestionOption = TextOption | FractionOption

export type QuestionKind = "emoji" | "text"

export type Difficulty = 1 | 2 | 3 | 4

export type VisualItem = {
  emoji: string
  category?: string
  isTarget?: boolean
}

export type PositionedVisualItem = {
  emoji: string
  isTarget?: boolean
  x: number
  y: number
}

export type ClassifiedItem = {
  emoji: string
  category?: string
  isTarget?: boolean
}

export type SymbolToken =
  | string
  | {
      emoji?: string
      text?: string
      kind?: string
    }

export type VisualChoice =
  | string
  | {
      emoji?: string
      text?: string
      kind?: string
    }
  | SymbolToken[]

export type Visual =
  | {
      type: "scattered_objects"
      items: VisualItem[]
    }
  | {
      type: "aligned_comparison_groups"
      topEmoji: string
      topCount: number
      bottomEmoji: string
      bottomCount: number
    }
  | {
      type: "object_groups"
      targetCategory: string
      groups: {
        emoji: string
        items: ClassifiedItem[]
      }[]
    }
  | {
      type: "counting_groups"
      targetEmoji: string
      targetCount: number
      distractorEmoji: string
      distractorCount: number
      targetFirst: boolean
    }
  | {
      type: "ordinal_row"
      items: string[]
      showLR: boolean
    }
  | {
      type: "pattern_block_counting"
      symbol: string
      count: number
    }
  | {
      type: "scattered_counting"
      items: PositionedVisualItem[]
      width: number
      height: number
    }
  | {
      type: "ten_frame"
      count: number
      emoji: string | null
    }
  | {
      type: "pattern_strip"
      items: SymbolToken[]
    }
  | {
      type: "pattern_strip_missing"
      items: SymbolToken[]
    }
  | {
      type: "comparison_rows"
      groups: {
        emoji: string
        count: number
      }[]
    }

export type Question = {
  prompt: string
  options: QuestionOption[]
  correctIndex: number
  explanation?: string
  concept?: string
  templateKey?: string
  difficulty: Difficulty
  kind: QuestionKind
  countsForScore?: boolean
  visual?: Visual
  visualChoices?: VisualChoice[]
}