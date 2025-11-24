"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Download, Loader2, TrendingUp, FileText } from "lucide-react"
import type { HistoryEntry } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function HistoryPanel() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/history")
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      }
    } catch (error) {
      console.error("[v0] Failed to load history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadAllHistory = async () => {
    try {
      const response = await fetch("/api/history/download")
      if (response.ok) {
        const data = await response.json()
        const dataStr = JSON.stringify(data, null, 2)
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
        const exportFileDefaultName = `transcript-history-${new Date().toISOString().split("T")[0]}.json`

        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportFileDefaultName)
        linkElement.click()
      }
    } catch (error) {
      console.error("[v0] Failed to download history:", error)
    }
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-chart-3/20 text-chart-3 border-chart-3/30"
    if (score >= 60) return "bg-chart-4/20 text-chart-4 border-chart-4/30"
    return "bg-chart-5/20 text-chart-5 border-chart-5/30"
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No History Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Score your first transcript to see your analysis history here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Scoring History</CardTitle>
              <CardDescription>View and download past transcript analyses</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={downloadAllHistory}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getScoreBadgeColor(entry.overall_score)}>{entry.overall_score}/100</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(entry.timestamp).toLocaleDateString()}{" "}
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {entry.transcript_text?.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{entry.word_count} words</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {Math.round(entry.wpm)} WPM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Analysis Details</DialogTitle>
            <DialogDescription>{selectedEntry && new Date(selectedEntry.timestamp).toLocaleString()}</DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{selectedEntry.overall_score}</div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Transcript</h4>
                  <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted">
                    {selectedEntry.transcript_text}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Criteria Scores</h4>
                  <div className="space-y-2">
                    {selectedEntry.criteria.map((criterion, index) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                        <span className="text-sm">{criterion.name}</span>
                        <span className="text-sm font-bold">
                          {criterion.score}/{criterion.max_score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
