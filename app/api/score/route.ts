import { type NextRequest, NextResponse } from "next/server"
import { scoreTranscript } from "@/lib/scoring-engine"
import { saveToHistory } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transcript_text, options } = body

    if (!transcript_text || typeof transcript_text !== "string") {
      return NextResponse.json({ error: "Invalid transcript_text" }, { status: 400 })
    }

    const wordCount = transcript_text.trim().split(/\s+/).filter(Boolean).length
    if (wordCount < 10) {
      return NextResponse.json({ error: "Transcript must contain at least 10 words" }, { status: 400 })
    }

    const result = await scoreTranscript(transcript_text, options || {})

    await saveToHistory(result as any)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Scoring error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
