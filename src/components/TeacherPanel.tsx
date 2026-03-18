import { getConceptInfo, getDevelopmentalStage } from "../concepts"

type TeacherPanelProps = {
  concept: string
  difficulty: 1 | 2 | 3 | 4
  answered: boolean
  explanationText: string
}

export default function TeacherPanel({
  concept,
  difficulty,
  answered,
  explanationText
}: TeacherPanelProps) {
  const conceptInfo = getConceptInfo(concept)
  const developmentalStage = getDevelopmentalStage(concept, difficulty)

  return (
    <div style={{ marginTop: 8 }}>
      <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
        Concept: {conceptInfo.label}
      </p>

      <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0 0" }}>
        What are we counting here? {conceptInfo.counting}
      </p>

      <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0 0" }}>
        Mathematical structure: {conceptInfo.structure}
      </p>

      <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0 0" }}>
        Developmental stage: Difficulty {difficulty} — {developmentalStage}
      </p>

      {answered && (
        <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0 0" }}>
          Explanation: {explanationText}
        </p>
      )}
    </div>
  )
}