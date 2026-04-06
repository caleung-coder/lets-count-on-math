import { useMemo, useState, useEffect } from "react"
import type { Mode, Question } from "./types"
import html2canvas from "html2canvas"
import {
  cloneAsReview,
  generateGameQuestion,
  generatePracticeQuestion
} from "./generators/questions"

import { getConceptInfo, getDevelopmentalStage } from "./concepts"

import MathOption from "./components/MathOption"
import Fraction from "./components/Fraction"
import TenFrame from "./components/TenFrame"
import DicePattern from "./components/DicePattern"
import AlignedComparisonGroups from "./components/AlignedComparisonGroups"

console.log("APP FILE TEST")

const APP_GRADE = "K"

type ConceptStats = Record<
  string,
  {
    seen: number
    correct: number
  }
>

type TeacherJumpOption = {
  label: string
  templateKey: string
  difficulty: 1 | 2 | 3 | 4
}

const TEACHER_JUMP_OPTIONS: TeacherJumpOption[] = [
  { label: "1. Which does not belong? (core classification)", templateKey: "data_probability_classification", difficulty: 1 },
  { label: "2. How many? (Ten Frame)", templateKey: "ten_frame_quantity", difficulty: 1 },
  { label: "3. How many? (dice face)", templateKey: "counting_objects", difficulty: 1 },
  { label: "4. What position is A? (first, second, third, fourth)", templateKey: "ordinal_position", difficulty: 1 },
  { label: "5. Which group has more?", templateKey: "which_group_has_more", difficulty: 1 },
  { label: "6. Which pattern is the same? (pattern blocks)", templateKey: "visual_pattern_recognition", difficulty: 1 },
  { label: "7. How many “blank”? (from two different item types)", templateKey: "scattered_counting_objects", difficulty: 1 },
  { label: "8. Probability prediction language (certain, unlikely, likely, impossible)", templateKey: "probability_likelihood", difficulty: 1 },
  { label: "9. Which pair does not make 5?", templateKey: "ways_to_make_5", difficulty: 1 },
  { label: "10. Which group has less?", templateKey: "more_fewer_objects", difficulty: 1 },
  { label: "11. Which does not belong? (geometry classification)", templateKey: "geometry_classification", difficulty: 1 },
  { label: "12. How many items altogether (total of 2 different item types)", templateKey: "counting_objects_total", difficulty: 1 },
  { label: "13. How many? (pattern block shapes)", templateKey: "pattern_block_counting", difficulty: 1 },
  { label: "14. Which pair does not make 10?", templateKey: "ways_to_make_10", difficulty: 1 },
  { label: "15. Dimensional language (widest, narrowest, tallest, shortest)", templateKey: "measurement_comparison_visual", difficulty: 1 },
  { label: "16. Which group has the most?", templateKey: "which_group_has_most_rows", difficulty: 1 },
  { label: "17. How many more A than B? (difference between groups)", templateKey: "how_many_more_fewer_objects", difficulty: 1 },
  { label: "18. Which does not belong? (number sequences comparison)", templateKey: "sequence_patterns", difficulty: 1 },
  { label: "19. What comes next? (pattern sequence prediction)", templateKey: "visual_pattern_next", difficulty: 1 },
  { label: "20. How many are A? (categorizing, then counting like items)", templateKey: "how_many_are_category", difficulty: 1 }
]

function articleFor(wordRaw: string): "a" | "an" {
  const word = (wordRaw ?? "").trim()
  if (!word) return "a"

  const w = word.toLowerCase()

  const silentH = ["hour", "honest", "honor", "honour", "heir", "herb"]
  if (silentH.some(x => w.startsWith(x))) return "an"

  const youSoundPrefixes = ["uni", "use", "user", "urol", "euro", "eul", "one", "once"]
  if (youSoundPrefixes.some(p => w.startsWith(p))) return "a"

  const looksAllCaps = /^[A-Z]{2,}$/.test(word)
  if (looksAllCaps) {
    const first = word[0]
    const anLetters = new Set(["A", "E", "F", "H", "I", "L", "M", "N", "O", "R", "S", "X"])
    return anLetters.has(first) ? "an" : "a"
  }

  const first = w[0]
  if ("aeiou".includes(first)) return "an"
  return "a"
}

function polishExplanation(raw: string | undefined | null): string {
  if (!raw) return ""

  let s = String(raw)
  s = s.replace(/\s+/g, " ").trim()

  const singularize: Record<string, string> = {
    animals: "animal",
    birds: "bird",
    vehicles: "vehicle",
    foods: "food",
    letters: "letter",
    numbers: "number"
  }

  s = s.replace(/\bOne is (a|an)\s+([A-Za-z]+)\b/g, (_m, _article: string, noun: string) => {
    const lower = noun.toLowerCase()
    const fixedNoun = singularize[lower] ?? noun
    const art = articleFor(fixedNoun)
    return `One is ${art} ${fixedNoun}`
  })

  s = s.replace(/\b(a|an)\s+([A-Za-z]+)\b/g, (_m, _article: string, word: string) => {
    const art = articleFor(word)
    return `${art} ${word}`
  })

  s = s.replace(/\ba animals\b/gi, "an animal")
  s = s.replace(/\ban animals\b/gi, "an animal")

  if (!/[.!?]$/.test(s)) s += "."

  return s
}

function generateHardCappedGameQuestion(questionNumber: number): Question {
  return generateGameQuestion(questionNumber, APP_GRADE as any)
}


function safeCountsForScore(question: Question): boolean {
  return question.countsForScore !== false
}

function protectDecimals(text: string): { protectedText: string; decimals: string[] } {
  const decimals: string[] = []

  const protectedText = text.replace(/\d+\.\d+/g, match => {
    const token = `§DEC${decimals.length}§`
    decimals.push(match)
    return token
  })

  return { protectedText, decimals }
}

function restoreDecimals(text: string, decimals: string[]): string {
  return text.replace(/§DEC(\d+)§/g, (match, indexText: string) => {
    const index = Number(indexText)
    return decimals[index] ?? match
  })
}

function explanationSentences(text: string): string[] {
  if (!text) return []

  const { protectedText, decimals } = protectDecimals(text)
  const matches = protectedText.match(/[^.!?]+[.!?]/g)

  if (!matches) {
    return [restoreDecimals(protectedText.trim(), decimals)].filter(Boolean)
  }

  return matches
    .map(sentence => restoreDecimals(sentence.trim(), decimals))
    .filter(Boolean)
}

function renderMathInText(text: string) {
  const withStyledSemicolons = text.replace(/;/g, "  ;  ")
  const { protectedText, decimals } = protectDecimals(withStyledSemicolons)
  const mixedParts = protectedText.split(/(\d+\s+\d+\/\d+)/g)

  return mixedParts.map((mixedPart, mixedIndex) => {
    const restoredMixedPart = restoreDecimals(mixedPart, decimals)
    const mixedMatch = restoredMixedPart.match(/^(\d+)\s+(\d+)\/(\d+)$/)

    if (mixedMatch) {
      const whole = Number(mixedMatch[1])
      const numerator = Number(mixedMatch[2])
      const denominator = Number(mixedMatch[3])

      return (
        <span
          key={`mixed-${mixedIndex}`}
          style={{
            display: "inline-flex",
            verticalAlign: "middle",
            margin: "0 2px"
          }}
        >
          <Fraction whole={whole} numerator={numerator} denominator={denominator} />
        </span>
      )
    }

    const parts = mixedPart.split(/(\d+\/\d+|;)/g)

    return parts.map((part, index) => {
      const restoredPart = restoreDecimals(part, decimals)

      if (restoredPart === ";") {
        return (
          <span
            key={`semi-${mixedIndex}-${index}`}
            style={{ fontWeight: 700, padding: "0 6px" }}
          >
            ;
          </span>
        )
      }

      const match = restoredPart.match(/^(\d+)\/(\d+)$/)

      if (match) {
        const numerator = Number(match[1])
        const denominator = Number(match[2])

        return (
          <span
            key={`frac-${mixedIndex}-${index}`}
            style={{
              display: "inline-flex",
              verticalAlign: "middle",
              margin: "0 2px"
            }}
          >
            <Fraction numerator={numerator} denominator={denominator} />
          </span>
        )
      }

      return <span key={`text-${mixedIndex}-${index}`}>{restoredPart}</span>
    })
  })
}

function optionFontSize(option: unknown): string {
  if (typeof option !== "string") return "32px"

  const text = option.trim()

  if (text.length >= 13) return "15px"
  if (text.length >= 11) return "16px"
  if (text.length >= 9) return "17px"

  return "32px"
}

function benchmarkInstructionFor(question: Question | null | undefined): string {
  if (!question) return ""

  switch (question.templateKey) {
    case "fractions_benchmark_one":
      return "Compare the fractions to 1."

    case "fractions_benchmark_half":
      return "Compare the fractions to 1/2."

    case "integers_benchmark_zero":
      return "Compare the integers to 0."

    case "ratios_benchmark_1_to_2":
      return "Compare the ratios to 1 : 2."

    case "ratios_benchmark_1_to_3":
      return "Compare the ratios to 1 : 3."

    case "ratios_benchmark_2_to_3":
      return "Compare the ratios to 2 : 3."

    case "ratios_benchmark_3_to_2":
      return "Compare the ratios to 3 : 2."

    case "rates_benchmark_pay": {
      const explanation = String(question.explanation ?? "")
      const match = explanation.match(/\$(\d+(?:\.\d+)?)\s+per hour/i)

      return match
        ? `Compare the pay rates to $${match[1]} per hour.`
        : "Compare the pay rates."
    }

    case "rates_benchmark_speed": {
      const explanation = String(question.explanation ?? "")
      const match = explanation.match(/(\d+(?:\.\d+)?)\s+km per hour/i)

      return match
        ? `Compare the speeds to ${match[1]} km per hour.`
        : "Compare the speeds."
    }

    case "proportional_relationships":
      return "Compare the relationships."

    case "sequence_patterns":
      return "Consider the sequences."

    case "number_properties": {
      const explanation = String(question.explanation ?? "")
      const factorMatch = explanation.match(/factors of (\d+)/i)

      return factorMatch
        ? `Consider the number ${factorMatch[1]}.`
        : ""
    }

    default:
      return ""
  }
}

function renderCountingGroupsVisual(visual: any) {
  const topGroup = `${visual.targetEmoji} `.repeat(visual.targetCount).trim()
  const bottomGroup = `${visual.distractorEmoji} `.repeat(visual.distractorCount).trim()

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 6
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "flex-start"
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, color: "#444" }}>
          {visual.topLabel ?? ""}
        </div>

        <div style={{ fontSize: 42, lineHeight: 1.2, minHeight: 46 }}>
          {topGroup}
        </div>

        <div style={{ fontSize: 16, fontWeight: 600, color: "#444", marginTop: 4 }}>
          {visual.bottomLabel ?? ""}
        </div>

        <div style={{ fontSize: 42, lineHeight: 1.2, minHeight: 46 }}>
          {bottomGroup}
        </div>
      </div>
    </div>
  )
}

function renderScatteredCountingVisual(visual: any) {
  const width = typeof visual?.width === "number" ? visual.width : 260
  const height = typeof visual?.height === "number" ? visual.height : 160
  const items = Array.isArray(visual?.items) ? visual.items : []

  if (items.length === 0) {
    return null
  }

  return (
    <div
      style={{
        width,
        height,
        margin: "10px auto",
        position: "relative",
        fontSize: 36
      }}
    >
      {items.map(
        (
          item: { emoji: string; x: number; y: number },
          i: number
        ) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y
            }}
          >
            {item.emoji}
          </span>
        )
      )}
    </div>
  )
}

function renderScatteredObjectsVisual(visual: any, answered: boolean) {
  const rawItems = Array.isArray(visual?.items)
    ? visual.items
    : Array.isArray(visual?.groups?.[0]?.items)
      ? visual.groups[0].items
      : []

  const items = rawItems
    .map((item: any) => {
      if (typeof item === "string") {
        return {
          emoji: item,
          isTarget: false
        }
      }

      if (item && typeof item.emoji === "string") {
        return {
          emoji: item.emoji,
          isTarget: Boolean(item.isTarget)
        }
      }

      return null
    })
    .filter(Boolean)

  if (items.length === 0) return null

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 72px)",
        gridAutoRows: "72px",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        marginTop: 12,
        marginBottom: 10,
        fontSize: 42
      }}
    >
      {items.slice(0, 10).map((item: any, i: number) => {
        const highlight = answered && item.isTarget
        const dim = answered && !item.isTarget

        return (
          <span
            key={`${item.emoji}-${i}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              width: 60,
              height: 60,
              borderRadius: 12,
              backgroundColor: highlight ? "#FFF3A3" : "transparent",
              boxShadow: highlight ? "inset 0 0 0 2px #D4B200" : "none",
              opacity: dim ? 0.45 : 1,
              transition: "all 0.2s ease"
            }}
          >
            {item.emoji}
          </span>
        )
      })}
    </div>
  )
}

function patternBlockFill(shape: string): string {
  switch (shape) {
    case "triangle":
    case "▲":
      return "#43A047"
    case "square":
    case "■":
      return "#F57C00"
    case "hexagon":
    case "⬢":
      return "#FDD835"
    case "trapezoid":
    case "⏢":
      return "#E53935"
    case "rhombus":
    case "◆":
      return "#1E88E5"
    default:
      return "#333333"
  }
}

function patternBlockShapeName(symbol: string): string {
  switch (symbol) {
    case "▲":
      return "triangle"
    case "■":
      return "square"
    case "⬢":
      return "hexagon"
    case "⏢":
      return "trapezoid"
    case "◆":
      return "rhombus"
    default:
      return "square"
  }
}

function renderPatternBlockSvg(shapeOrSymbol: string, side: number) {
  const shape = ["triangle", "square", "hexagon", "trapezoid", "rhombus"].includes(shapeOrSymbol)
    ? shapeOrSymbol
    : patternBlockShapeName(shapeOrSymbol)

  const fill = patternBlockFill(shapeOrSymbol)
  const stroke = "#222"
  const strokeWidth = 0.7
  const triHeight = (Math.sqrt(3) / 2) * side

  if (shape === "triangle") {
    const width = side
    const height = triHeight

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <polygon
          points={`${width / 2},0 ${width},${height} 0,${height}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  if (shape === "rhombus") {
    const width = side * 1.5
    const height = triHeight

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <polygon
          points={`
            0,0
            ${side},0
            ${width},${height}
            ${side / 2},${height}
          `}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

    if (shape === "trapezoid") {
    const width = side * 2
    const height = triHeight

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <polygon
          points={`
            ${side / 2},0
            ${side * 1.5},0
            ${width},${height}
            0,${height}
          `}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  if (shape === "hexagon") {
    const width = side * 2
    const height = triHeight * 2

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <polygon
          points={`
            ${side / 2},0
            ${side * 1.5},0
            ${width},${triHeight}
            ${side * 1.5},${height}
            ${side / 2},${height}
            0,${triHeight}
          `}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  if (shape === "square") {
    const size = side * 0.9

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          width={size}
          height={size}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  return null
}

function renderComparisonRowsVisual(visual: any) {
  if (!visual?.groups) return null

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 42
      }}
    >
      {visual.groups.map((g: any, i: number) => (
        <div key={i}>
          {Array.from({ length: g.count }).map((_, j) => (
            <span key={j}>{g.emoji} </span>
          ))}
        </div>
      ))}
    </div>
  )
}
function renderComparisonRowsVisualGrid(visual: any) {
  if (!visual?.groups) return null

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, auto)",
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
        marginBottom: 12,
        fontSize: 42
      }}
    >
      {visual.groups.map((g: any, i: number) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: 120,
            minHeight: 60
          }}
        >
          {Array.from({ length: g.count }).map((_, j) => (
            <span key={j}>{g.emoji} </span>
          ))}
        </div>
      ))}
    </div>
  )
}
function renderPatternStrip(items: string[], compact = false, withBlank = false) {
  const side = compact ? 16 : 22
  const blankSize = compact ? 24 : 32

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: compact ? 4 : 8,
        flexWrap: "nowrap",
        maxWidth: "100%"
      }}
    >
      {items.map((symbol, i) => (
        <span
          key={`${symbol}-${i}`}
          style={{
            display: "inline-flex",
            alignItems: "flex-end",
            justifyContent: "center",
            flex: "0 0 auto"
          }}
        >
          {renderPatternBlockSvg(symbol, side)}
        </span>
      ))}
      {withBlank && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: blankSize,
            height: blankSize,
            border: "2px dashed #666",
            borderRadius: 0,
            fontSize: compact ? 16 : 22,
            color: "#666",
            lineHeight: 1,
            flex: "0 0 auto",
            boxSizing: "border-box",
            marginBottom: compact ? 2 : 4
          }}
        >
          ?
        </span>
      )}
    </div>
  )
}

function renderPatternBlockSingle(symbol: string) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        justifyContent: "center",
        flexShrink: 0
      }}
    >
      {renderPatternBlockSvg(symbol, 18)}
    </span>
  )
}

function renderPatternBlockCountingVisual(visual: any) {
  const side = 26

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginTop: 10,
        marginBottom: 6,
        flexWrap: "wrap",
        alignItems: "flex-end"
      }}
    >
      {Array.from({ length: visual.count }, (_, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "flex-end",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          {renderPatternBlockSvg(visual.symbol, side)}
        </span>
      ))}
    </div>
  )
}

function renderReferenceVisual(question: Question | null, answered: boolean) {
  if (!question) return null

  const visual = (question as any).visual

  if (visual?.type === "ordinal_row" && Array.isArray(visual.items)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 12,
          marginBottom: 10,
          fontSize: 28
        }}
      >
        {visual.showLR && (
          <span
            style={{
              marginRight: 72,
              fontWeight: 600,
              fontSize: 26
            }}
          >
            L
          </span>
        )}

        <div
          style={{
            display: "flex",
            gap: 22
          }}
        >
          {visual.items.map((item: string, i: number) => (
            <span key={i}>{item}</span>
          ))}
        </div>

        {visual.showLR && (
          <span
            style={{
              marginLeft: 72,
              fontWeight: 600,
              fontSize: 26
            }}
          >
            R
          </span>
        )}
      </div>
    )
  }

if (visual?.type === "comparison_rows") {
  // ONLY use grid for "most" question
  if (question?.templateKey === "which_group_has_most_rows") {
    return renderComparisonRowsVisualGrid(visual)
  }

  return renderComparisonRowsVisual(visual)
}
  if (visual?.type === "ten_frame") {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 6 }}>
        <TenFrame count={visual.count} emoji={visual.emoji ?? undefined} />
      </div>
    )
  }

  if (visual?.type === "dice_pattern") {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 6 }}>
        <DicePattern emoji={visual.emoji} count={visual.count} />
      </div>
    )
  }

  if (visual?.type === "aligned_comparison_groups") {
    return (
      <AlignedComparisonGroups
        topEmoji={visual.topEmoji}
        topCount={visual.topCount}
        bottomEmoji={visual.bottomEmoji}
        bottomCount={visual.bottomCount}
      />
    )
  }

  if (visual?.type === "counting_groups") {
    return renderCountingGroupsVisual(visual)
  }

  if (visual?.type === "scattered_counting") {
    return renderScatteredCountingVisual(visual)
  }

  if (visual?.type === "scattered_objects" || visual?.type === "object_groups") {
    return renderScatteredObjectsVisual(visual, answered)
  }

  if (visual?.type === "pattern_strip" && Array.isArray(visual.items)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 6 }}>
        {renderPatternStrip(visual.items, false, false)}
      </div>
    )
  }

  if (visual?.type === "pattern_strip_missing" && Array.isArray(visual.items)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginBottom: 6 }}>
        {renderPatternStrip(visual.items, false, true)}
      </div>
    )
  }

  if (visual?.type === "pattern_block_counting") {
    return renderPatternBlockCountingVisual(visual)
  }

  return null
}

function renderOptionContent(question: Question | null, option: unknown, index: number) {
  const visualChoices = (question as any)?.visualChoices

  if (option === "equal") {
    return (
      <div style={{ textAlign: "center", fontSize: 18 }}>
        <div>Equal</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>=</div>
      </div>
    )
  }

  if (option === "not_sure") {
    return <div style={{ fontSize: 18 }}>Not sure</div>
  }

  if (Array.isArray(visualChoices)) {
    const visual = visualChoices[index]

    if (visual?.scaleX && visual?.scaleY) {
      return (
        <span
          style={{
            display: "inline-block",
            transform: `scale(${visual.scaleX}, ${visual.scaleY})`
          }}
        >
          {String(option)}
        </span>
      )
    }

    if (visual?.type === "pattern_strip" && Array.isArray(visual.items)) {
      return renderPatternStrip(visual.items, true, false)
    }

    if (visual?.type === "pattern_block_single" && typeof visual.symbol === "string") {
      return renderPatternBlockSingle(visual.symbol)
    }

    if (visual?.type === "ten_frame") {
      return <TenFrame count={visual.count} emoji={visual.emoji ?? undefined} compact />
    }
  }

  return <MathOption option={option} />
}

async function handleShareResults(studentName: string) {
  try {

    const element = document.body

    const canvas = await html2canvas(element)

    canvas.toBlob(async (blob: Blob | null) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const safeName = (studentName || "Student").replace(/\s+/g, "_")
      const timestamp = new Date().toISOString().slice(0,16).replace("T","_").replace(":","-")
      a.download = `${safeName}_${timestamp}.png`
      a.click()
      URL.revokeObjectURL(url)

    })
  } catch (err) {
    console.error("Share failed", err)
  }
}

export default function App() {
  const [mode, setMode] = useState<Mode>("game")
  const [teacherMode, setTeacherMode] = useState(false)
  const [_conceptStats, setConceptStats] = useState<ConceptStats>({})
  const [teacherJumpValue, setTeacherJumpValue] = useState("")
  const [sessionTimestamp] = useState(() => {
  const now = new Date()
  return now.toLocaleString()
})

  const [questionNumber, setQuestionNumber] = useState(1)
  const [gameRoundComplete, setGameRoundComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  const [gameQuestion, setGameQuestion] = useState<Question>(() =>
    generateHardCappedGameQuestion(1)
  )
  const [gameSelected, setGameSelected] = useState<number | null>(null)
  const [gameAnswered, setGameAnswered] = useState(false)
  const [gameAttempts, setGameAttempts] = useState(0)

  const [reviewQueue, setReviewQueue] = useState<Question[]>([])
  const [reviewMode, setReviewMode] = useState(false)

  const [practiceQuestion, setPracticeQuestion] = useState<Question | null>(null)
  const [practiceSelected, setPracticeSelected] = useState<number | null>(null)
  const [practiceAnswered, setPracticeAnswered] = useState(false)
  const [practiceAttempts, setPracticeAttempts] = useState(0)

  const [practiceTemplate, setPracticeTemplate] = useState<{
    templateKey: string
    difficulty: 1 | 2 | 3 | 4
  } | null>(null)

  const [practiceStats, setPracticeStats] = useState({
    sessionsStarted: 0,
    questionsAnswered: 0
  })
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem("studentName") || ""
  })
  useEffect(() => {
    localStorage.setItem("studentName", studentName)
  }, [studentName])
useEffect(() => {
  setStudentResults([])
}, [studentName])
  const [studentResults, setStudentResults] = useState<any[]>(() => {
  const saved = localStorage.getItem("studentResults")
  return saved ? JSON.parse(saved) : []
})

useEffect(() => {
  localStorage.setItem("studentResults", JSON.stringify(studentResults))
}, [studentResults])

function speak(text: string) {
  if (!("speechSynthesis" in window)) return

  const synth = window.speechSynthesis

  // IMPORTANT: wait for voices to be ready
  const loadAndSpeak = () => {
    const voices = synth.getVoices()

    const samantha = voices.find(v => v.name === "Samantha")

    const utterance = new SpeechSynthesisUtterance(text)

    if (samantha) {
      utterance.voice = samantha
    }

    utterance.rate = 0.5

    synth.cancel()
    synth.speak(utterance)
  }

  // If voices already loaded → speak immediately
  if (synth.getVoices().length > 0) {
    loadAndSpeak()
  } else {
    // Otherwise wait for them
    synth.onvoiceschanged = loadAndSpeak
  }
}
  const currentQuestion = mode === "game" ? gameQuestion : practiceQuestion ?? gameQuestion
  const options = useMemo(() => currentQuestion?.options ?? [], [currentQuestion])
  const promptText = currentQuestion?.prompt ?? "Loading..."
  
  const benchmarkInstruction = benchmarkInstructionFor(currentQuestion)

  const selected = mode === "game" ? gameSelected : practiceSelected
  const answered = mode === "game" ? gameAnswered : practiceAnswered
  const attempts = mode === "game" ? gameAttempts : practiceAttempts

  const canAdvanceGame = gameAnswered && !gameRoundComplete
  const canAdvancePractice = practiceAnswered

  const explanationText = useMemo(
    () => polishExplanation(currentQuestion?.explanation),
    [currentQuestion?.explanation]
  )
  const explanationLines = useMemo(
    () => explanationSentences(explanationText),
    [explanationText]
  )

  const conceptKey = currentQuestion?.concept ?? ""
  const conceptInfo = useMemo(() => getConceptInfo(conceptKey), [conceptKey])
  const developmentalStage = useMemo(
    () => getDevelopmentalStage(conceptKey, currentQuestion?.difficulty ?? 1),
    [conceptKey, currentQuestion?.difficulty]
  )

  function recordConceptResult(question: Question, isCorrect: boolean) {
    if (!isCorrect) return
    const key = question.concept ?? "unknown"
    setConceptStats(prev => {
      const current = prev[key] ?? { seen: 0, correct: 0 }
      return {
        ...prev,
        [key]: {
          seen: current.seen + 1,
          correct: current.correct + (isCorrect ? 1 : 0)
        }
      }
    })
  }


  function resetGameUI() {
    setGameSelected(null)
    setGameAnswered(false)
    setGameAttempts(0)
  }

  function resetPracticeUI() {
    setPracticeSelected(null)
    setPracticeAnswered(false)
    setPracticeAttempts(0)
  }

  function startNewRound() {
    setMode("game")
    setScore(0)
    setTotal(0)
    setQuestionNumber(1)
    setGameRoundComplete(false)
    setReviewQueue([])
    setReviewMode(false)
    setGameQuestion(generateHardCappedGameQuestion(1))
    resetGameUI()
    setPracticeTemplate(null)
    setPracticeQuestion(null)
    resetPracticeUI()
    setTeacherJumpValue("")
  }

  function launchPracticeTemplate(templateKey: string, difficulty: 1 | 2 | 3 | 4 = 1) {
    setMode("practice")
    setPracticeTemplate({ templateKey, difficulty })
    setPracticeStats(prev => ({ ...prev, sessionsStarted: prev.sessionsStarted + 1 }))
    setPracticeQuestion(generatePracticeQuestion(templateKey, difficulty, APP_GRADE as any))
    resetPracticeUI()
  }

  function nextGameQuestion() {
    if (!canAdvanceGame) return

    if (reviewMode) {
      if (reviewQueue.length === 0) {
        setReviewMode(false)
        return
      }

      const [next, ...rest] = reviewQueue
      setReviewQueue(rest)
      if (rest.length === 0) setReviewMode(false)

      if (next) {
        setGameQuestion(next)
        resetGameUI()
      }
      return
    }

    const nextNum = questionNumber + 1
    if (nextNum > 20) {
      setGameRoundComplete(true)
      return
    }

    setQuestionNumber(nextNum)
    setGameQuestion(generateHardCappedGameQuestion(nextNum))
    resetGameUI()
  }

  function startReviewMissed() {
    if (!gameAnswered) return
    if (reviewQueue.length === 0) return
    if (reviewMode) return

    setMode("game")
    setReviewMode(true)

    const [first, ...rest] = reviewQueue
    setReviewQueue(rest)

    if (first) {
      setGameQuestion(first)
      resetGameUI()
    } else {
      setReviewMode(false)
    }
  }

  function nextPracticeQuestion() {
    if (mode !== "practice") return
    if (!canAdvancePractice) return
    if (!practiceTemplate) return

    const { templateKey, difficulty } = practiceTemplate
    setPracticeQuestion(generatePracticeQuestion(templateKey, difficulty, APP_GRADE as any))
    resetPracticeUI()
  }

  function handleTeacherJumpChange(value: string) {
    setTeacherJumpValue(value)

    const selectedOption = TEACHER_JUMP_OPTIONS.find(option => option.templateKey === value)
    if (!selectedOption) return

    launchPracticeTemplate(selectedOption.templateKey, selectedOption.difficulty)
  }

  function handlePick(index: number) {
    if (answered) return
    if (mode === "game" && gameRoundComplete) return
    if (!currentQuestion) return

    const setSel = mode === "game" ? setGameSelected : setPracticeSelected
    const setAns = mode === "game" ? setGameAnswered : setPracticeAnswered
    const setAtt = mode === "game" ? setGameAttempts : setPracticeAttempts

    const newAttempts = attempts + 1
    setAtt(newAttempts)
    setSel(index)

    const isCorrect = index === currentQuestion.correctIndex
// ✅ ALWAYS log the click (game + practice)
setStudentResults((prev) => [
  ...prev,
  {
    name: studentName || "Unknown",
    questionNumber: questionNumber,
    concept: currentQuestion?.templateKey ?? "unknown",
    correct: isCorrect,
    attempts: 1,
    mode: mode === "game" ? "game" : "practice",
    source: mode, 
    timestamp: Date.now()
  }
])
    if (isCorrect) {
      setAns(true)
      recordConceptResult(currentQuestion, true)

      if (mode === "game" && safeCountsForScore(currentQuestion)) {
  setScore(prev => (prev < 20 ? prev + 1 : prev))


  setTotal(prev => (prev < 20 ? prev + 1 : prev))
} else if (mode === "practice") {
  // do nothing (handled by click logging above)
}  return
    }

    if (newAttempts === 2) {
      setAns(true)
      recordConceptResult(currentQuestion, false)


      if (mode === "game" && safeCountsForScore(currentQuestion)) {
        setTotal(prev => (prev < 20 ? prev + 1 : prev))
        setReviewQueue(prev => [...prev, cloneAsReview(currentQuestion)])
} else if (mode === "practice") {
  // do nothing (handled by click logging above)
}
      }
  }

  function buttonBg(index: number) {
    if (!answered && selected === index) return "#FFD54F"
    if (answered && index === currentQuestion.correctIndex) return "#81C784"
    if (answered && selected === index && index !== currentQuestion.correctIndex) return "#E57373"
    return "#f0f0f0"
  }

  const showTryAgain = selected !== null && !answered && attempts === 1
  const showCorrect = answered && selected === currentQuestion.correctIndex
  const showWrongDone = answered && selected !== currentQuestion.correctIndex

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        paddingTop: 40,
        position: "relative"
      }}
    >
      <button
        onClick={() => setTeacherMode(prev => !prev)}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          fontSize: 11,
          padding: "6px 10px",
          borderRadius: 10,
          cursor: "pointer",
          opacity: teacherMode ? 1 : 0.55,
          backgroundColor: "#ffffff",
          border: "1px solid #999",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
        }}
        aria-label="Toggle teacher mode"
        title="Teacher Mode"
      >
        {teacherMode ? "Teacher ON" : "Teacher"}
      </button>

      <button
        onClick={startNewRound}
        style={{
          position: "fixed",
          bottom: 10,
          right: 10,
          zIndex: 10,
          fontSize: 11,
          padding: "6px 10px",
          borderRadius: 10,
          cursor: "pointer",
          backgroundColor: "#ffffff",
          border: "1px solid #999",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
        }}
        title="Start New Round"
      >
        New Round
      </button>

      <div style={{ width: "min(940px, 96vw)", textAlign: "center" }}>
<img
  src="/logohorizontal.svg"
  alt="Let's Count On Math"
  style={{
    width: "min(550px, 90vw)",
    marginBottom: 0
  }}
/>
        <div
          style={{
            marginTop: 6,
            marginBottom: 34,
            fontSize: 24,
            fontWeight: 600,
            color: "#4a5568"
          }}
        >
          Foundational Counting Skills
        </div>
<div style={{ marginTop: 10 }}>
  <input
    value={studentName}
    onChange={(e) => setStudentName(e.target.value)}
    placeholder="Enter student name"
    style={{
      padding: "8px 12px",
      fontSize: 16,
      borderRadius: 8,
      border: "1px solid #ccc",
      textAlign: "center"
    }}
  />
</div>
        {teacherMode && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 14, fontWeight: 600, marginRight: 8 }}>
              Jump to question type:
            </label>
            <select
              value={teacherJumpValue}
              onChange={e => handleTeacherJumpChange(e.target.value)}
              style={{
                fontSize: 14,
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid #999",
                maxWidth: "min(520px, 90vw)"
              }}
            >
              <option value="">Choose one…</option>
              {TEACHER_JUMP_OPTIONS.map(option => (
                <option key={option.templateKey} value={option.templateKey}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

)}

        {gameRoundComplete ? (
          <div style={{ marginTop: 24 }}>
            <h2>You scored {score} out of 20</h2>
            <button
              onClick={() => startNewRound()}
              style={{ padding: "12px 20px", fontSize: 18, cursor: "pointer", borderRadius: 12 }}
            >
              Start New Round
            </button>
<div style={{ marginTop: 20, paddingLeft: 120 }}>
  <div style={{ fontWeight: 600, marginBottom: 12 }}>
    Student Results — {studentName || "Unknown"} — {sessionTimestamp}
  </div>

  {TEACHER_JUMP_OPTIONS.map((q, i) => {
const results = studentResults.filter(
  r =>
    r.name === (studentName || "Unknown") &&
    (
      (r.mode === "game" && r.questionNumber === i + 1) ||
      (r.mode === "practice" && r.concept === q.templateKey)
    )
)
// Separate Game vs Practice
const gameResults = results.filter(r => r.mode === "game")
const practiceResults = results.filter(r => r.mode === "practice")

// Game stats
const gameCorrect = gameResults.filter(r => r.correct).length
const gameClicks = gameResults.length

// Practice stats
const practiceCorrect = practiceResults.filter(r => r.correct).length
const practiceClicks = practiceResults.length
return (
<div
  key={i}
  style={{
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    alignItems: "start",
    justifyItems: "start",
    fontSize: 14,
    marginBottom: 6
  }}
>
<span style={{ fontFamily: "monospace" }}>
  G: {gameCorrect}/{gameClicks} &nbsp; P: {practiceCorrect}/{practiceClicks}
</span>
<span>
  {q.label}
</span>
      </div>
    )
  })}
</div>
<div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
Key: G = Game &nbsp;&nbsp; P = Practice &nbsp;&nbsp; (# correct / # clicks) &nbsp;&nbsp; • &nbsp;&nbsp; Each question allows up to 2 clicks</div>
<button
  onClick={() => handleShareResults(studentName)}
  style={{
    marginTop: 20,
    padding: "14px 20px",
    fontSize: 18,
    borderRadius: 12,
    cursor: "pointer",
    backgroundColor: "#1976D2",
    color: "white",
    border: "none"
  }}
>
  📤 Share Results
</button>
            {teacherMode && (
              <div style={{ marginTop: 18 }}>
                <div
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 12,
                    padding: 14,
                    background: "#fafafa",
                    textAlign: "left"
                  }}
                >
                  <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
                    Teacher Dashboard
                  </p>

                  <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0 0" }}>
                    Round score: {score} / {total}
                  </p>

                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {renderReferenceVisual(currentQuestion, answered)}

<div
  style={{
    marginTop: 10,
    fontSize: 22,
    fontFamily: "Comic Sans MS, Comic Sans, Arial",
    minHeight: 32,
    display: "flex",
    justifyContent: "center",
    width: "100%",
    maxWidth: 700,
    margin: "10px auto",
    alignItems: "center",
    gap: 30
  }}
>
<span>{promptText.replace(/\n/g, " ")}</span>

  <button
    onClick={() =>
      speak((currentQuestion?.prompt ?? "").replace(/\n/g, ". "))
    }
    style={{
      fontSize: 18,
      borderRadius: 8,
      cursor: "pointer",
      padding: "4px 8px"
    }}
  >
    🔊
  </button>
</div>

            <p style={{ marginTop: 0, opacity: 0.8 }}>
              {mode === "game" ? (
                <>
                  Question: {Math.min(questionNumber, 20)} / 20 &nbsp;•&nbsp; Score: {score} / {total}
                  {reviewMode && <>&nbsp;•&nbsp; Reviewing missed</>}
                </>
              ) : (
                <>Practice mode</>
              )}
            </p>

            {mode === "practice" && (
              <p style={{ fontSize: 12, opacity: 0.6, marginTop: 0 }}>
                Practice: {practiceStats.sessionsStarted} sessions, {practiceStats.questionsAnswered} answers
              </p>
            )}

            {mode === "game" && (
              <button
                onClick={startReviewMissed}
                disabled={!gameAnswered || reviewQueue.length === 0 || reviewMode}
                style={{
                  marginTop: 6,
                  padding: "10px 16px",
                  fontSize: 16,
                  cursor: !gameAnswered || reviewQueue.length === 0 || reviewMode ? "not-allowed" : "pointer",
                  opacity: !gameAnswered || reviewQueue.length === 0 || reviewMode ? 0.5 : 1,
                  borderRadius: 12
                }}
              >
                Review Missed {reviewQueue.length > 0 ? `(${reviewQueue.length})` : ""}
              </button>
            )}

            {benchmarkInstruction && (
              <p
                style={{
                  marginTop: mode === "game" ? 14 : 10,
                  marginBottom: 6,
                  fontSize: 18,
                  fontWeight: 600
                }}
              >
                {benchmarkInstruction}
              </p>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(160px, 190px))",
                gap: 18,
                justifyContent: "center",
                marginTop: benchmarkInstruction ? 10 : 24
              }}
            >
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handlePick(i)}
                  style={{
                    width: "100%",
                    minHeight: 132,
                    padding: "14px 12px",
                    borderRadius: 16,
                    border: "2px solid #333",
                    cursor: answered ? "default" : "pointer",
                    backgroundColor: buttonBg(i),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    userSelect: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <div
                    style={{
                      maxWidth: "100%",
                      minHeight: 84,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      lineHeight: 1.15,
                      overflow: "visible",
                      whiteSpace: "normal",
                      fontSize: optionFontSize(opt)
                    }}
                  >
                    {renderOptionContent(currentQuestion, opt, i)}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 14, minHeight: 80 }}>
              {showTryAgain && (
                <p style={{ color: "#F57C00", fontWeight: "bold", margin: 0 }}>
                  Try one more time.
                </p>
              )}

              {showCorrect && (
                <div style={{ color: "#2E7D32", fontWeight: "bold", margin: 0 }}>
                  <p style={{ margin: 0 }}>Correct. Well done.</p>
                  {explanationLines.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {explanationLines.map((line, index) => {
                        const isLast = index === explanationLines.length - 1
                        return (
                          <p
                            key={index}
                            style={{
                              margin: "4px 0 0 0",
                              color: isLast && explanationLines.length > 1 ? "#1565C0" : "#2E7D32"
                            }}
                          >
                            {renderMathInText(line)}
                          </p>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {showWrongDone && (
                <div style={{ color: "#C62828", fontWeight: "bold", margin: 0 }}>
                  <p style={{ margin: 0 }}>Not quite.</p>
                  {explanationLines.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {explanationLines.map((line, index) => {
                        const isLast = index === explanationLines.length - 1
                        return (
                          <p
                            key={index}
                            style={{
                              margin: "4px 0 0 0",
                              color: isLast && explanationLines.length > 1 ? "#1565C0" : "#C62828"
                            }}
                          >
                            {renderMathInText(line)}
                          </p>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {teacherMode && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
                    Concept: {conceptInfo.label}
                  </p>

                  <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0 0" }}>
                    Assessment lens: What are we counting?
                  </p>

                  <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0 0" }}>
                    What are we counting here? {conceptInfo.counting}
                  </p>

                  <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0 0" }}>
                    Mathematical structure: {conceptInfo.structure}
                  </p>

                  <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0 0" }}>
                    Developmental stage: Difficulty {currentQuestion?.difficulty ?? 1} — {developmentalStage}
                  </p>


                  {answered && explanationLines.length > 0 && (
                    <div style={{ marginTop: 6 }}>
                      <p style={{ fontSize: 13, color: "#666", margin: 0 }}>Explanation:</p>
                      {explanationLines.map((line, index) => (
                        <p key={index} style={{ fontSize: 13, color: "#666", margin: "4px 0 0 0" }}>
                          {renderMathInText(line)}
                        </p>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

            {answered && mode === "game" && (
              <button
                onClick={() => {
                  const templateKey = currentQuestion?.templateKey
                  const difficulty = currentQuestion?.difficulty ?? 1

                  if (!templateKey) return

                  launchPracticeTemplate(templateKey, difficulty)
                }}
                style={{
                  marginTop: 10,
                  padding: "10px 16px",
                  fontSize: 16,
                  cursor: currentQuestion?.templateKey ? "pointer" : "not-allowed",
                  borderRadius: 12
                }}
              >
                More like this
              </button>
            )}

<div style={{ marginTop: 18 }}>
  {mode === "practice" ? (
    <>
      <button
        onClick={nextPracticeQuestion}
        disabled={!canAdvancePractice}
        style={{
          padding: "10px 20px",
          fontSize: 18,
          marginRight: 10,
          borderRadius: 12,
          cursor: canAdvancePractice ? "pointer" : "not-allowed",
          opacity: canAdvancePractice ? 1 : 0.5
        }}
      >
        Next Practice →
      </button>

      <button
        onClick={() => {
          setMode("game")
          setPracticeTemplate(null)
          setPracticeQuestion(null)
          resetPracticeUI()
        }}
        style={{ padding: "10px 20px", fontSize: 18, borderRadius: 12 }}
      >
        Back to the game
      </button>
    </>
  ) : (
    <button
      onClick={nextGameQuestion}
      disabled={!canAdvanceGame}
      style={{
        padding: "10px 20px",
        fontSize: 18,
        borderRadius: 12,
        cursor: canAdvanceGame ? "pointer" : "not-allowed",
        opacity: canAdvanceGame ? 1 : 0.5
      }}
    >
      Next Question →
    </button>
  )}
</div>

          </>
        )}
      </div>
    </div>
  )
}