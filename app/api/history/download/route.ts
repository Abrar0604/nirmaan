import { NextResponse } from "next/server"
import { getHistory } from "@/lib/storage"

export async function GET() {
  try {
    const history = await getHistory()

    return NextResponse.json(history, {
      headers: {
        "Content-Disposition": `attachment; filename="transcript-history-${new Date().toISOString().split("T")[0]}.json"`,
      },
    })
  } catch (error) {
    console.error("[v0] History download error:", error)
    return NextResponse.json({ error: "Failed to download history" }, { status: 500 })
  }
}
