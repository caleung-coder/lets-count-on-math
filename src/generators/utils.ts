export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function chooseOne<T>(items: T[]): T {
  return items[randInt(0, items.length - 1)]
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]

  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)

  while (y !== 0) {
    const t = y
    y = x % y
    x = t
  }

  return x || 1
}

export function simplifyFraction(numerator: number, denominator: number): {
  numerator: number
  denominator: number
} {
  const d = gcd(numerator, denominator)
  return {
    numerator: numerator / d,
    denominator: denominator / d
  }
}

export function formatFraction(numerator: number, denominator: number): string {
  return `${numerator}/${denominator}`
}

export function formatMixedNumber(numerator: number, denominator: number): string {
  const whole = Math.floor(numerator / denominator)
  const remainder = numerator % denominator

  if (remainder === 0) return String(whole)
  if (whole === 0) return `${remainder}/${denominator}`

  return `${whole} ${remainder}/${denominator}`
}

/*
  Normalize feedback text so every sentence ends with
  a period followed by THREE spaces.

  This avoids periods visually appearing as decimal points
  when numbers follow immediately after.
*/
export function normalizeFeedbackSpacing(text: string): string {
  return text.replace(/\.\s*/g, ".   ")
}