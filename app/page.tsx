"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TranscriptInputPanel } from "@/components/transcript-input-panel"
import { ScoringOptionsPanel } from "@/components/scoring-options-panel"
import { ResultsPanel } from "@/components/results-panel"
import { HistoryPanel } from "@/components/history-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ScoreResponse, ScoringOptions } from "@/lib/types"

export default function Home() {
  const [isScoring, setIsScoring] = useState(false)
  const [results, setResults] = useState<ScoreResponse | null>(null)
  const [options, setOptions] = useState<ScoringOptions>({
    run_nlp: true,
    transcript_duration_seconds: 30,
  })

  const handleSubmit = async (transcriptText: string) => {
    setIsScoring(true)
    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript_text: transcriptText, options }),
      })

      if (!response.ok) throw new Error("Scoring failed")

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("[v0] Scoring error:", error)
      alert("Failed to score transcript. Please try again.")
    } finally {
      setIsScoring(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">AI Transcript Scorer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Analyze speech transcripts with advanced NLP scoring across multiple criteria including content, grammar,
            clarity, and engagement
          </p>
        </div>

        <Tabs defaultValue="score" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="score">Score Transcript</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="score" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TranscriptInputPanel onSubmit={handleSubmit} isLoading={isScoring} />
                {results && <ResultsPanel results={results} />}
              </div>

              <div>
                <ScoringOptionsPanel options={options} onOptionsChange={setOptions} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <HistoryPanel />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
