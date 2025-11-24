import type { ScoreResponse, ScoringOptions, CriterionScore } from "./types"
import { v4 as uuidv4 } from "uuid"

// Filler words list from rubric
const FILLER_WORDS = [
  "um",
  "uh",
  "like",
  "you know",
  "so",
  "actually",
  "basically",
  "right",
  "i mean",
  "well",
  "kinda",
  "sort of",
  "okay",
  "hmm",
  "ah",
]

// Mandatory keywords
const MANDATORY_KEYWORDS = [
  { phrase: "my name is", points: 4 },
  { phrase: "years old", points: 4 },
  { phrase: "class", points: 4 },
  { phrase: "school", points: 4 },
]

// Good-to-have keywords
const GOOD_TO_HAVE_KEYWORDS = [
  { phrase: "hobby", points: 2 },
  { phrase: "enjoy", points: 2 },
  { phrase: "like to", points: 2 },
  { phrase: "family", points: 2 },
  { phrase: "free time", points: 2 },
]

export async function scoreTranscript(transcriptText: string, options: ScoringOptions): Promise<ScoreResponse> {
  const id = uuidv4()
  const timestamp = new Date().toISOString()

  // Basic text processing
  const tokens = transcriptText.toLowerCase().split(/\s+/)
  const totalWords = tokens.length
  const duration = options.transcript_duration_seconds || 30
  const wpm = (totalWords / duration) * 60

  // Calculate distinct tokens for vocabulary richness
  const distinctTokens = new Set(tokens.filter((t) => t.length > 0)).size
  const ttr = distinctTokens / totalWords

  // Score Content & Structure
  const contentScore = scoreContentAndStructure(transcriptText.toLowerCase())

  // Score Speech Rate
  const speechRateScore = scoreSpeechRate(wpm)

  // Score Language & Grammar
  const grammarScore = scoreLanguageAndGrammar(transcriptText, ttr)

  // Score Clarity
  const clarityScore = scoreClarity(transcriptText, totalWords)

  // Score Engagement
  const engagementScore = scoreEngagement(transcriptText)

  const criteria: CriterionScore[] = [contentScore, speechRateScore, grammarScore, clarityScore, engagementScore]

  const overallScore = criteria.reduce((sum, c) => sum + c.score, 0)

  // Collect evidence
  const keywordsFound: string[] = []
  for (const kw of [...MANDATORY_KEYWORDS, ...GOOD_TO_HAVE_KEYWORDS]) {
    if (transcriptText.toLowerCase().includes(kw.phrase)) {
      keywordsFound.push(kw.phrase)
    }
  }

  const fillerWordsFound = tokens.filter((token) =>
    FILLER_WORDS.some((filler) => (filler.split(" ").length === 1 ? token === filler : false)),
  )

  return {
    id,
    timestamp,
    overall_score: Math.round(overallScore),
    word_count: totalWords,
    wpm: Number.parseFloat(wpm.toFixed(2)),
    criteria,
    evidence: {
      keywords_found: keywordsFound,
      grammar_errors_count: grammarScore.details.estimated_errors,
      distinct_tokens: distinctTokens,
      total_tokens: totalWords,
      filler_words_list: fillerWordsFound,
    },
    transcript_text: transcriptText,
  }
}

function scoreContentAndStructure(text: string): CriterionScore {
  // Salutation scoring
  let salutationScore = 0
  if (text.includes("excited to introduce") || text.includes("feeling great")) {
    salutationScore = 5
  } else if (text.includes("hello") || text.includes("hi") || text.includes("greetings")) {
    salutationScore = 4
  } else if (text.match(/good (morning|afternoon|evening)/)) {
    salutationScore = 2
  }

  // Keyword presence
  let mandatoryPoints = 0
  for (const kw of MANDATORY_KEYWORDS) {
    if (text.includes(kw.phrase)) {
      mandatoryPoints += kw.points
    }
  }

  let goodToHavePoints = 0
  for (const kw of GOOD_TO_HAVE_KEYWORDS) {
    if (text.includes(kw.phrase)) {
      goodToHavePoints += kw.points
    }
  }

  // Flow scoring (simplified - check if key elements appear in order)
  const hasName = text.includes("name")
  const hasAge = text.includes("old") || text.includes("age")
  const hasSchool = text.includes("school") || text.includes("class")
  const flowScore = hasName && hasAge && hasSchool ? 5 : 0

  const totalScore = salutationScore + mandatoryPoints + goodToHavePoints + flowScore
  const cappedScore = Math.min(totalScore, 40)

  return {
    name: "Content & Structure",
    score: cappedScore,
    max_score: 40,
    details: {
      salutation_level: salutationScore,
      must_have_points: mandatoryPoints,
      good_to_have_points: goodToHavePoints,
      flow_score: flowScore,
    },
  }
}

function scoreSpeechRate(wpm: number): CriterionScore {
  let score = 2
  let bucket = "Too slow"

  if (wpm >= 161) {
    score = 2
    bucket = "Too fast"
  } else if (wpm >= 141 && wpm <= 160) {
    score = 6
    bucket = "Fast"
  } else if (wpm >= 111 && wpm <= 140) {
    score = 10
    bucket = "Ideal"
  } else if (wpm >= 81 && wpm <= 110) {
    score = 6
    bucket = "Moderate"
  } else if (wpm <= 80) {
    score = 2
    bucket = "Slow"
  }

  return {
    name: "Speech Rate",
    score,
    max_score: 10,
    details: {
      wpm: Number.parseFloat(wpm.toFixed(2)),
      wpm_bucket: bucket,
    },
  }
}

function scoreLanguageAndGrammar(text: string, ttr: number): CriterionScore {
  // Simplified grammar scoring (estimate errors based on text patterns)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const estimatedErrors = Math.floor(sentences.length * 0.1) // Rough estimate
  const errorsPerHundred = (estimatedErrors / text.split(/\s+/).length) * 100
  const grammarNormalized = Math.max(0, 1 - errorsPerHundred / 10)

  let grammarBandScore = 2
  if (grammarNormalized >= 0.9) grammarBandScore = 10
  else if (grammarNormalized >= 0.7) grammarBandScore = 8
  else if (grammarNormalized >= 0.5) grammarBandScore = 6
  else if (grammarNormalized >= 0.3) grammarBandScore = 4

  // TTR scoring
  let vocabScore = 2
  if (ttr >= 0.9) vocabScore = 10
  else if (ttr >= 0.7) vocabScore = 8
  else if (ttr >= 0.5) vocabScore = 6
  else if (ttr >= 0.3) vocabScore = 4

  return {
    name: "Language & Grammar",
    score: grammarBandScore + vocabScore,
    max_score: 20,
    details: {
      grammar_score_band: grammarBandScore,
      vocab_score_band: vocabScore,
      ttr: Number.parseFloat(ttr.toFixed(3)),
      estimated_errors: estimatedErrors,
    },
  }
}

function scoreClarity(text: string, totalWords: number): CriterionScore {
  const tokens = text.toLowerCase().split(/\s+/)
  let fillerCount = 0

  for (const token of tokens) {
    if (FILLER_WORDS.includes(token)) {
      fillerCount++
    }
  }

  const fillerRate = (fillerCount / totalWords) * 100

  let score = 3
  if (fillerRate <= 3) score = 15
  else if (fillerRate <= 6) score = 12
  else if (fillerRate <= 9) score = 9
  else if (fillerRate <= 12) score = 6

  return {
    name: "Clarity",
    score,
    max_score: 15,
    details: {
      filler_rate: Number.parseFloat(fillerRate.toFixed(2)),
      filler_count: fillerCount,
    },
  }
}

function scoreEngagement(text: string): CriterionScore {
  // Simplified sentiment analysis using positive/negative word counts
  const positiveWords = ["excited", "great", "happy", "enjoy", "love", "wonderful", "excellent", "good", "like", "best"]
  const negativeWords = ["bad", "hate", "terrible", "awful", "worst", "dislike", "poor"]

  const tokens = text.toLowerCase().split(/\s+/)
  const positiveCount = tokens.filter((t) => positiveWords.includes(t)).length
  const negativeCount = tokens.filter((t) => negativeWords.includes(t)).length

  const totalSentimentWords = positiveCount + negativeCount
  const posProbability = totalSentimentWords > 0 ? positiveCount / totalSentimentWords : 0.5

  let score = 3
  if (posProbability >= 0.9) score = 15
  else if (posProbability >= 0.7) score = 12
  else if (posProbability >= 0.5) score = 9
  else if (posProbability >= 0.3) score = 6

  return {
    name: "Engagement",
    score,
    max_score: 15,
    details: {
      sentiment_positivity: Number.parseFloat(posProbability.toFixed(3)),
      positive_words_found: positiveCount,
    },
  }
}
