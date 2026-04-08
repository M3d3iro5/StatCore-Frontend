export type RiskStatus = "OK" | "ATTENTION" | "CRITICAL"

export interface AnalysisData {
  date: string
  erf: number
  depth: number
  length: number
  thickness: number
  status: RiskStatus
}

export interface TemporalPrediction {
  day: number
  mean: number
  max: number
  min: number
}

export interface ExponentialFitPoint {
  depth: number
  length: number
}

export interface ERFHistoryEntry {
  date: string
  erf: number
}

export interface Recommendation {
  type: "warning" | "success" | "info" | "critical"
  message: string
}

export interface DashboardData {
  lastAnalysis: AnalysisData
  temporalPrediction: TemporalPrediction[]
  exponentialFit: ExponentialFitPoint[]
  erfHistory: ERFHistoryEntry[]
  recommendations: Recommendation[]
}
