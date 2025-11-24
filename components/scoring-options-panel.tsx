"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Settings2 } from "lucide-react"
import type { ScoringOptions } from "@/lib/types"

interface ScoringOptionsPanelProps {
  options: ScoringOptions
  onOptionsChange: (options: ScoringOptions) => void
}

export function ScoringOptionsPanel({ options, onOptionsChange }: ScoringOptionsPanelProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-muted-foreground" />
          <CardTitle>Scoring Options</CardTitle>
        </div>
        <CardDescription>Configure analysis parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="nlp-toggle" className="text-sm font-medium">
                NLP Analysis
              </Label>
              <p className="text-xs text-muted-foreground">Use advanced NLP models for scoring</p>
            </div>
            <Switch
              id="nlp-toggle"
              checked={options.run_nlp}
              onCheckedChange={(checked) => onOptionsChange({ ...options, run_nlp: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Transcript Duration (seconds)
            </Label>
            <p className="text-xs text-muted-foreground mb-2">Used to calculate words per minute</p>
            <Input
              id="duration"
              type="number"
              min="1"
              value={options.transcript_duration_seconds || 30}
              onChange={(e) =>
                onOptionsChange({
                  ...options,
                  transcript_duration_seconds: Number.parseInt(e.target.value) || 30,
                })
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-3 text-xs text-muted-foreground">
          <h4 className="font-semibold text-foreground">Scoring Criteria:</h4>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>Content & Structure (40 pts)</li>
            <li>Speech Rate (10 pts)</li>
            <li>Language & Grammar (20 pts)</li>
            <li>Clarity (15 pts)</li>
            <li>Engagement (15 pts)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
