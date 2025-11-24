export interface ScoringOptions {
  run_nlp: boolean
  transcript_duration_seconds?: number
  user_id?: string
}

export interface CriterionScore {
  name: string
  score: number
  max_score: number
  details: Record<string, any>
}

export interface ScoreResponse {
  overall_score: number
  word_count: number
  wpm: number
  criteria: CriterionScore[]
  evidence: {
    keywords_found?: string[]
    grammar_errors_count?: number
    distinct_tokens?: number
    total_tokens?: number
    filler_words_list?: string[]
    sentiment_score?: number
  }
  timestamp: string
  id: string
  transcript_text?: string
}

export interface HistoryEntry extends ScoreResponse {
  transcript_text: string
}
