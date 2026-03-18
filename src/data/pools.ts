export const EMOJI = {
  fruits: ["🍎", "🍌", "🍇", "🍐", "🍓", "🍊"],
  animals: ["🐶", "🐱", "🐰", "🐻", "🐼", "🦊"],
  birds: ["🐦", "🦆", "🦉", "🦜", "🐧"],
  vehicles: ["🚗", "🚌", "🚲", "✈️", "🚁", "🚜"],
  clothes: ["👕", "🧦", "👟", "🧢", "🧥", "👖"],
  sports: ["⚽️", "🏀", "🏈", "🎾", "🏒", "🏐"],
  foods: ["🍕", "🥪", "🍪", "🥕", "🧀", "🍞"],
  shapesColor: ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"]
} as const

// IMPORTANT: removed "I" and "O" from vowels (confusable with "1" and "0")
export const LETTERS = {
  vowels: ["A", "E", "U"],
  consonants: ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T"]
} as const

// IMPORTANT: numbers exclude 0 (confusable with "O")
export const SAFE_DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const

export type EmojiCategory = keyof typeof EMOJI