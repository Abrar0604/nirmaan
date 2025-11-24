"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Sparkles, Loader2 } from "lucide-react"

const SAMPLE_TRANSCRIPT = `Hello, I am excited to introduce myself. My name is Aarti and I am 14 years old. I study in 9th grade at Delhi Public School. I really enjoy reading books and playing badminton. In my free time, I like to paint and spend time with my family. I feel great to be here today and share a little bit about myself. Thank you for listening.`

interface TranscriptInputPanelProps {
  onSubmit: (text: string) => void
  isLoading?: boolean
}

export function TranscriptInputPanel({ onSubmit, isLoading }: TranscriptInputPanelProps) {
  const [text, setText] = useState("")
  const [charCount, setCharCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTextChange = (value: string) => {
    setText(value)
    setCharCount(value.length)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        handleTextChange(content)
      }
      reader.readAsText(file)
    } else {
      alert("Please upload a .txt file")
    }
  }

  const handleSubmit = () => {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length
    if (wordCount < 10) {
      alert("Please enter at least 10 words")
      return
    }
    onSubmit(text)
  }

  const loadSample = () => {
    handleTextChange(SAMPLE_TRANSCRIPT)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transcript Input</CardTitle>
        <CardDescription>Paste your transcript text, upload a .txt file, or use a sample</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Paste transcript here or upload .txt file..."
          className="min-h-64 resize-y font-mono text-sm"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{charCount} characters</span>
          <span>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSubmit} disabled={isLoading || !text.trim()} className="flex-1 sm:flex-none">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scoring...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Score Transcript
              </>
            )}
          </Button>

          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
            <Upload className="w-4 h-4 mr-2" />
            Upload .txt
          </Button>

          <Button variant="secondary" onClick={loadSample} disabled={isLoading}>
            Load Sample
          </Button>
        </div>

        <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
      </CardContent>
    </Card>
  )
}
