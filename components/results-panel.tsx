"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Download, TrendingUp, BookOpen, Zap, MessageCircle, CheckCircle2 } from "lucide-react"
import type { ScoreResponse } from "@/lib/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ResultsPanelProps {
  results: ScoreResponse
}

const criterionIcons: Record<string, any> = {
  "Content & Structure": BookOpen,
  "Speech Rate": TrendingUp,
  "Language & Grammar": CheckCircle2,
  Clarity: Zap,
  Engagement: MessageCircle,
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `transcript-score-${results.id}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-chart-3"
    if (percentage >= 60) return "text-chart-4"
    return "text-chart-5"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Detailed breakdown of transcript scoring</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={downloadResults}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
            <div className="text-6xl font-bold text-primary">{results.overall_score}</div>
            <p className="text-sm text-muted-foreground">out of 100 points</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 rounded-lg bg-card">
              <p className="text-muted-foreground mb-1">Words</p>
              <p className="text-2xl font-bold">{results.word_count}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-card">
              <p className="text-muted-foreground mb-1">WPM</p>
              <p className="text-2xl font-bold">{Math.round(results.wpm)}</p>
            </div>
          </div>
        </div>

        {/* Criteria Breakdown */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Criteria Breakdown</h3>
          <Accordion type="single" collapsible className="w-full">
            {results.criteria.map((criterion, index) => {
              const Icon = criterionIcons[criterion.name] || BookOpen
              const percentage = (criterion.score / criterion.max_score) * 100

              return (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{criterion.name}</p>
                          <p className={`text-lg font-bold ${getScoreColor(criterion.score, criterion.max_score)}`}>
                            {criterion.score}/{criterion.max_score}
                          </p>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-13 pr-4 space-y-2">
                      {Object.entries(criterion.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm py-1">
                          <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                          <span className="font-medium">
                            {typeof value === "number" ? value.toFixed(2) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>

        {/* Evidence Section */}
        {results.evidence && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Evidence & Analysis</h3>
            <div className="grid gap-3">
              {results.evidence.keywords_found && results.evidence.keywords_found.length > 0 && (
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm font-medium mb-2">Keywords Found</p>
                  <div className="flex flex-wrap gap-2">
                    {results.evidence.keywords_found.map((keyword, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {results.evidence.grammar_errors_count !== undefined && (
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm font-medium mb-1">Grammar Analysis</p>
                  <p className="text-2xl font-bold">
                    {results.evidence.grammar_errors_count}
                    <span className="text-sm font-normal text-muted-foreground ml-2">errors detected</span>
                  </p>
                </div>
              )}

              {results.evidence.distinct_tokens !== undefined && (
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm font-medium mb-1">Vocabulary Richness</p>
                  <p className="text-sm text-muted-foreground">
                    {results.evidence.distinct_tokens} distinct words out of {results.evidence.total_tokens} total
                    <span className="block mt-1 font-medium text-foreground">
                      TTR:{" "}
                      {((results.evidence.distinct_tokens / (results.evidence.total_tokens || 1)) * 100).toFixed(1)}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
