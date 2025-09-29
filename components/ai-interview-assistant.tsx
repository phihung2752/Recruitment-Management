"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Candidate, InterviewRound } from "./interview-management"

interface AIInterviewAssistantProps {
  candidates: Candidate[]
  interviewRounds: InterviewRound[]
}

export function AIInterviewAssistant({ candidates, interviewRounds }: AIInterviewAssistantProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [selectedRound, setSelectedRound] = useState<string>("")
  const [generatedQuestions, setGeneratedQuestions] = useState<string>("")
  const [interviewAnalysis, setInterviewAnalysis] = useState<string>("")

  const handleGenerateQuestions = () => {
    // In a real application, this would call an AI service to generate questions
    const aiGeneratedQuestions = `
1. Can you describe a challenging project you've worked on and how you overcame obstacles?
2. How do you stay updated with the latest technologies in your field?
3. Can you explain a complex technical concept in simple terms?
    `.trim()
    setGeneratedQuestions(aiGeneratedQuestions)
  }

  const handleAnalyzeInterview = () => {
    // In a real application, this would call an AI service to analyze the interview
    const aiGeneratedAnalysis = `
Based on the candidate's responses:
- Strong problem-solving skills demonstrated
- Good communication abilities, explains technical concepts clearly
- Shows initiative in learning new technologies
- Recommendation: Consider for next round
    `.trim()
    setInterviewAnalysis(aiGeneratedAnalysis)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Interview Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setSelectedCandidate}>
          <SelectTrigger>
            <SelectValue placeholder="Select Candidate" />
          </SelectTrigger>
          <SelectContent>
            {candidates.map(candidate => (
              <SelectItem key={candidate.id} value={candidate.id}>{candidate.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedRound}>
          <SelectTrigger>
            <SelectValue placeholder="Select Interview Round" />
          </SelectTrigger>
          <SelectContent>
            {interviewRounds.map(round => (
              <SelectItem key={round.id} value={round.id}>{round.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleGenerateQuestions} className="w-full">Generate Interview Questions</Button>

        {generatedQuestions && (
          <Textarea
            value={generatedQuestions}
            readOnly
            className="h-40"
          />
        )}

        <Button onClick={handleAnalyzeInterview} className="w-full">Analyze Interview</Button>

        {interviewAnalysis && (
          <Textarea
            value={interviewAnalysis}
            readOnly
            className="h-40"
          />
        )}
      </CardContent>
    </Card>
  )
}
