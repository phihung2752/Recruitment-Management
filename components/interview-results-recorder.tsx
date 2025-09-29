"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Candidate, InterviewRound } from "./interview-management"

interface InterviewResultsRecorderProps {
  candidates: Candidate[]
  interviewRounds: InterviewRound[]
  onUpdateStatus: (candidateId: string, newRound: number, newStatus: "pending" | "passed" | "failed") => void
}

export function InterviewResultsRecorder({ candidates, interviewRounds, onUpdateStatus }: InterviewResultsRecorderProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [selectedRound, setSelectedRound] = useState<string>("")
  const [interviewNotes, setInterviewNotes] = useState<string>("")
  const [interviewResult, setInterviewResult] = useState<"passed" | "failed">("passed")

  const handleRecordResults = () => {
    if (!selectedCandidate || !selectedRound) return

    const candidate = candidates.find(c => c.id === selectedCandidate)
    const round = interviewRounds.find(r => r.id === selectedRound)

    if (candidate && round) {
      const newRound = interviewResult === "passed" ? round.order + 1 : round.order
      onUpdateStatus(candidate.id, newRound, interviewResult)

      // In a real application, you would also save the interview notes
      console.log("Recording interview results:", { selectedCandidate, selectedRound, interviewNotes, interviewResult })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Interview Results</CardTitle>
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

        <Textarea
          placeholder="Enter interview notes"
          value={interviewNotes}
          onChange={(e) => setInterviewNotes(e.target.value)}
        />

        <Select onValueChange={(value) => setInterviewResult(value as "passed" | "failed")}>
          <SelectTrigger>
            <SelectValue placeholder="Select Result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleRecordResults} className="w-full">Record Results</Button>
      </CardContent>
    </Card>
  )
}
