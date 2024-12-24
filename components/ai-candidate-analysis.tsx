"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Candidate } from "./interview-management"

interface AICandidateAnalysisProps {
  candidate: Candidate
}

export function AICandidateAnalysis({ candidate }: AICandidateAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const analyzeCandidate = async () => {
    setIsLoading(true)
    // In a real application, this would be an API call to your AI service
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
    setAnalysis(`AI Analysis for ${candidate.name}:
    - Compatibility Score: 85%
    - Strengths: Strong technical skills, good communication
    - Areas for Improvement: Leadership experience
    - Recommended Interview Focus: System design and team collaboration scenarios`)
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Candidate Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {analysis ? (
          <pre className="whitespace-pre-wrap">{analysis}</pre>
        ) : (
          <Button onClick={analyzeCandidate} disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze Candidate"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

