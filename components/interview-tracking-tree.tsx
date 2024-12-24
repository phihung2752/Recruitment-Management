"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, CheckCircle, XCircle } from 'lucide-react'
import { Candidate, InterviewRound } from "./interview-management"

interface InterviewTrackingTreeProps {
  candidate: Candidate
  interviewRounds: InterviewRound[]
}

export function InterviewTrackingTree({ candidate, interviewRounds }: InterviewTrackingTreeProps) {
  return (
    <div className="flex justify-center space-x-4">
      {interviewRounds.map((round, index) => (
        <div key={round.id} className="flex flex-col items-center">
          <Card className={`w-40 mb-4 ${index < candidate.currentRound ? 'bg-green-100' : ''}`}>
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {index < candidate.currentRound ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : index === candidate.currentRound ? (
                    <User className="h-4 w-4 text-blue-500" />
                  ) : (
                    <User className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                <p className="text-sm font-medium truncate">{round.name}</p>
                <Badge 
                  variant={
                    index < candidate.currentRound ? "success" : 
                    index === candidate.currentRound ? "secondary" : 
                    "outline"
                  }
                >
                  {index < candidate.currentRound ? "Passed" : 
                   index === candidate.currentRound ? "Current" : 
                   "Pending"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          {index < interviewRounds.length - 1 && (
            <div className="w-full h-px bg-gray-300 my-2"></div>
          )}
        </div>
      ))}
    </div>
  )
}

