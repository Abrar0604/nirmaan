import { type NextRequest, NextResponse } from "next/server"
import { getHistory } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const history = await getHistory(limit)

    return NextResponse.json(history)
  } catch (error) {
    console.error("[v0] History fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
