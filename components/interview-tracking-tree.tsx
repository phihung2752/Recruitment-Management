"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { Candidate, InterviewRound } from "./interview-management"

interface InterviewTrackingTreeProps {
  candidate: Candidate
  interviewRounds: InterviewRound[]
}

export function InterviewTrackingTree({ candidate, interviewRounds }: InterviewTrackingTreeProps) {
  return (
    <div className="flex flex-col md:flex-row justify-start md:space-x-4 space-y-4 md:space-y-0">
      {interviewRounds.map((round, index) => (
        <div key={round.id} className="flex md:flex-col items-center min-w-[150px] relative">
          <Card className={`w-full ${index < candidate.currentRound ? 'bg-green-100 dark:bg-green-900' : ''}`}>
            <CardContent className="p-3 text-center">
              <div className="flex flex-row md:flex-col items-center md:space-y-2 space-x-2 md:space-x-0">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  {index < candidate.currentRound ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : index === candidate.currentRound ? (
                    <User className="h-4 w-4 text-blue-500" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm font-medium">{round.name}</p>
                <Badge 
                  variant={
                    index < candidate.currentRound ? "success" : 
                    index === candidate.currentRound ? "secondary" : 
                    "outline"
                  }
                  className="w-full"
                >
                  {index < candidate.currentRound ? "Passed" : 
                   index === candidate.currentRound ? "Current" : 
                   "Pending"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          {index < interviewRounds.length - 1 && (
            <>
              {/* Desktop connector */}
              <div className="hidden md:block w-full h-px bg-border" />
              {/* Mobile connector */}
              <div className="md:hidden absolute -right-3 top-1/2 transform -translate-y-1/2">
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

