/**
 * Utility functions for testing the scoring system
 */

import type { ScoreResponse } from "./types"

export interface TestCase {
  name: string
  transcript: string
  duration: number
  expectedScoreRange: [number, number]
  description: string
}

export const testCases: TestCase[] = [
  {
    name: "Excellent Transcript",
    transcript:
      "Hello, I am excited to introduce myself. My name is Aarti and I am 14 years old. I study in 9th grade at Delhi Public School. I really enjoy reading books and playing badminton. In my free time, I like to paint and spend time with my family. I feel great to be here today and share a little bit about myself. Thank you for listening.",
    duration: 35,
    expectedScoreRange: [75, 95],
    description: "Should score high due to good salutation, all keywords, and positive sentiment",
  },
  {
    name: "Poor Clarity",
    transcript:
      "Um, well, my name is, like, Priya and, uh, I am 15 years old. I go to, you know, Green Valley School. I like, um, reading and, uh, painting. That is basically it.",
    duration: 20,
    expectedScoreRange: [40, 65],
    description: "Should lose points for excessive filler words",
  },
  {
    name: "Minimal Content",
    transcript: "My name is Amit. I am 12 years old. I study in class 7. I like sports.",
    duration: 10,
    expectedScoreRange: [35, 60],
    description: "Should score lower due to missing keywords and brief content",
  },
]

export function validateScoreResponse(response: ScoreResponse): string[] {
  const errors: string[] = []

  // Check required fields
  if (typeof response.overall_score !== "number") {
    errors.push("Missing or invalid overall_score")
  }

  if (response.overall_score < 0 || response.overall_score > 100) {
    errors.push("overall_score out of range (0-100)")
  }

  if (!Array.isArray(response.criteria) || response.criteria.length === 0) {
    errors.push("Missing or empty criteria array")
  }

  // Validate criteria
  const expectedCriteria = ["Content & Structure", "Speech Rate", "Language & Grammar", "Clarity", "Engagement"]

  const criteriaNames = response.criteria.map((c) => c.name)
  for (const expected of expectedCriteria) {
    if (!criteriaNames.includes(expected)) {
      errors.push(`Missing criterion: ${expected}`)
    }
  }

  // Check criteria scores sum correctly
  const totalScore = response.criteria.reduce((sum, c) => sum + c.score, 0)
  const roundedTotal = Math.round(totalScore)
  if (Math.abs(roundedTotal - response.overall_score) > 1) {
    errors.push(`Criteria sum (${roundedTotal}) doesn't match overall_score (${response.overall_score})`)
  }

  // Validate max scores
  const maxScores: Record<string, number> = {
    "Content & Structure": 40,
    "Speech Rate": 10,
    "Language & Grammar": 20,
    Clarity: 15,
    Engagement: 15,
  }

  for (const criterion of response.criteria) {
    if (criterion.max_score !== maxScores[criterion.name]) {
      errors.push(
        `Invalid max_score for ${criterion.name}: expected ${maxScores[criterion.name]}, got ${criterion.max_score}`,
      )
    }

    if (criterion.score > criterion.max_score) {
      errors.push(`${criterion.name} score exceeds max_score`)
    }
  }

  return errors
}

export function printTestResults(testName: string, response: ScoreResponse, expectedRange: [number, number]) {
  console.log(`\n${"=".repeat(60)}`)
  console.log(`Test: ${testName}`)
  console.log("=".repeat(60))

  console.log(`\nOverall Score: ${response.overall_score}/100`)
  console.log(`Expected Range: ${expectedRange[0]}-${expectedRange[1]}`)

  const inRange = response.overall_score >= expectedRange[0] && response.overall_score <= expectedRange[1]
  console.log(`Status: ${inRange ? "✓ PASS" : "✗ FAIL"}`)

  console.log("\nCriteria Breakdown:")
  for (const criterion of response.criteria) {
    console.log(`  ${criterion.name}: ${criterion.score}/${criterion.max_score}`)
  }

  console.log("\nEvidence:")
  if (response.evidence.keywords_found) {
    console.log(`  Keywords: ${response.evidence.keywords_found.join(", ")}`)
  }
  if (response.evidence.grammar_errors_count !== undefined) {
    console.log(`  Grammar Errors: ${response.evidence.grammar_errors_count}`)
  }
  if (response.evidence.distinct_tokens) {
    console.log(`  Vocabulary: ${response.evidence.distinct_tokens} distinct / ${response.evidence.total_tokens} total`)
  }

  const validationErrors = validateScoreResponse(response)
  if (validationErrors.length > 0) {
    console.log("\n⚠ Validation Errors:")
    validationErrors.forEach((error) => console.log(`  - ${error}`))
  }
}
