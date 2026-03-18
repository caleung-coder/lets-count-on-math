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
}