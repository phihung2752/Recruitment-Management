"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Candidate, InterviewRound } from "./interview-management"

interface CandidateEvaluationProps {
  candidates: Candidate[]
  interviewRounds: InterviewRound[]
}

interface EvaluationCriteria {
  id: string
  name: string
}

export function CandidateEvaluation({ candidates, interviewRounds }: CandidateEvaluationProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [selectedRound, setSelectedRound] = useState<string>("")
  const [evaluations, setEvaluations] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<string>("")

  // Mock evaluation criteria
  const criteria: EvaluationCriteria[] = [
    { id: "1", name: "Technical Skills" },
    { id: "2", name: "Communication" },
    { id: "3", name: "Problem Solving" },
    { id: "4", name: "Cultural Fit" },
    { id: "5", name: "Leadership Potential" },
  ]

  const handleEvaluationChange = (criteriaId: string, value: number[]) => {
    setEvaluations({ ...evaluations, [criteriaId]: value[0] })
  }

  const calculateOverallRating = () => {
    const totalScore = Object.values(evaluations).reduce((sum, score) => sum + score, 0)
    return totalScore / criteria.length
  }

  const handleSubmitEvaluation = () => {
    const overallRating = calculateOverallRating()
    // In a real application, this would send the data to your backend
    console.log("Submitting evaluation:", {
      selectedCandidate,
      selectedRound,
      evaluations,
      overallRating,
      comments,
    })
    // You would then update the candidate's evaluation in the database
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Evaluation</CardTitle>
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

        {criteria.map(criterion => (
          <div key={criterion.id} className="space-y-2">
            <label className="text-sm font-medium">{criterion.name}</label>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[evaluations[criterion.id] || 3]}
              onValueChange={(value) => handleEvaluationChange(criterion.id, value)}
            />
            <div className="text-sm text-gray-500">
              Rating: {evaluations[criterion.id] || 3} / 5
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <label className="text-sm font-medium">Overall Rating</label>
          <div className="text-lg font-semibold">{calculateOverallRating().toFixed(2)} / 5</div>
        </div>

        <Textarea
          placeholder="Additional comments or feedback"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />

        <Button onClick={handleSubmitEvaluation} className="w-full">Submit Evaluation</Button>
      </CardContent>
    </Card>
  )
}

