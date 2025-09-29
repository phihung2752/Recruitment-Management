"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Candidate } from "./interview-management"
import { Loader2 } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

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
    - Recommended Interview Focus: System design and team collaboration scenarios
    - Potential Role Fit: Senior Developer, Tech Lead
    - Learning Agility: High
    - Cultural Alignment: Strong alignment with company values
    - Project Experience: 5+ years in similar roles
    - Technical Expertise: Advanced in React, Node.js, and cloud technologies
    - Soft Skills: Excellent problem-solving and teamwork abilities
    - Career Trajectory: Shows potential for rapid growth and leadership roles
    - Interview Performance: Consistently strong across multiple rounds
    - References: Highly recommended by previous employers
    - Overall Recommendation: Strong candidate, proceed to final interview stage`)
    setIsLoading(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Candidate Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {analysis ? (
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
          </ScrollArea>
        ) : (
          <Button onClick={analyzeCandidate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Candidate"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
