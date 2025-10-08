"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, CheckCircle, Clock } from "lucide-react"

interface Candidate {
  id: number
  firstName: string
  lastName: string
  currentRound: number
}

interface InterviewRound {
  id: number
  name: string
  status: 'pending' | 'current' | 'passed' | 'failed'
  date?: string
  interviewer: string
}

interface InterviewTrackingTreeProps {
  candidate: Candidate
  interviewRounds: InterviewRound[]
}

export function InterviewTrackingTree({ candidate, interviewRounds }: InterviewTrackingTreeProps) {
  const getStatusIcon = (index: number) => {
    if (index < candidate.currentRound - 1) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else if (index === candidate.currentRound - 1) {
      return <Clock className="h-5 w-5 text-hr-primary" />
    } else {
      return <User className="h-5 w-5 text-hr-text-secondary" />
    }
  }

  const getStatusColor = (index: number) => {
    if (index < candidate.currentRound - 1) {
      return "bg-green-50 border-green-200 text-green-800"
    } else if (index === candidate.currentRound - 1) {
      return "bg-hr-primary bg-opacity-10 border-hr-primary text-hr-primary"
    } else {
      return "bg-hr-bg-primary border-hr-border text-hr-text-secondary"
    }
  }

  const getStatusText = (index: number) => {
    if (index < candidate.currentRound - 1) {
      return "Passed"
    } else if (index === candidate.currentRound - 1) {
      return "Current"
    } else {
      return "Pending"
    }
  }

  // Triangle layout for ≤4 rounds
  if (interviewRounds.length <= 4) {
    return (
      <div className="relative flex flex-col items-center space-y-6 py-8">
        {/* Triangle Layout */}
        {interviewRounds.length >= 4 && (
          <div className="flex justify-center">
            <Card className={`w-48 ${getStatusColor(3)}`}>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  {getStatusIcon(3)}
                  <p className="text-sm font-medium">{interviewRounds[3]?.name}</p>
                  <Badge variant="outline" className="text-xs border-hr-border text-hr-text-primary">
                    {getStatusText(3)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {interviewRounds.length >= 3 && (
          <div className="flex justify-center space-x-8">
            <Card className={`w-44 ${getStatusColor(2)}`}>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  {getStatusIcon(2)}
                  <p className="text-sm font-medium">{interviewRounds[2]?.name}</p>
                  <Badge variant="outline" className="text-xs border-hr-border text-hr-text-primary">
                    {getStatusText(2)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            {interviewRounds.length >= 4 && (
              <Card className={`w-44 ${getStatusColor(3)}`}>
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    {getStatusIcon(3)}
                    <p className="text-sm font-medium">{interviewRounds[3]?.name}</p>
                    <Badge variant="outline" className="text-xs border-hr-border text-hr-text-primary">
                      {getStatusText(3)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {interviewRounds.length >= 2 && (
          <div className="flex justify-center space-x-6">
            <Card className={`w-40 ${getStatusColor(1)}`}>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  {getStatusIcon(1)}
                  <p className="text-sm font-medium">{interviewRounds[1]?.name}</p>
                  <Badge variant="outline" className="text-xs border-hr-border text-hr-text-primary">
                    {getStatusText(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Base of triangle */}
        <div className="flex justify-center">
          <Card className={`w-52 ${getStatusColor(0)}`}>
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                {getStatusIcon(0)}
                <p className="text-sm font-medium">{interviewRounds[0]?.name}</p>
                <Badge variant="outline" className="text-xs border-hr-border text-hr-text-primary">
                  {getStatusText(0)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          {interviewRounds.length >= 2 && <line x1="50%" y1="60%" x2="50%" y2="40%" stroke="#e5e7eb" strokeWidth="2" />}
          {interviewRounds.length >= 3 && (
            <>
              <line x1="40%" y1="40%" x2="50%" y2="60%" stroke="#e5e7eb" strokeWidth="2" />
              <line x1="60%" y1="40%" x2="50%" y2="60%" stroke="#e5e7eb" strokeWidth="2" />
            </>
          )}
          {interviewRounds.length >= 4 && <line x1="50%" y1="20%" x2="50%" y2="40%" stroke="#e5e7eb" strokeWidth="2" />}
        </svg>
      </div>
    )
  }

  // Pyramid layout for >4 rounds
  return (
    <div className="flex flex-col items-center space-y-4 py-8">
      {/* Top level */}
      <div className="flex justify-center">
        <Card className={`w-40 ${getStatusColor(interviewRounds.length - 1)}`}>
          <CardContent className="p-3 text-center">
            <div className="flex flex-col items-center space-y-2">
              {getStatusIcon(interviewRounds.length - 1)}
              <p className="text-xs font-medium">{interviewRounds[interviewRounds.length - 1]?.name}</p>
              <Badge variant="outline" className="text-xs border-hr-border text-hr-text-primary">
                {getStatusText(interviewRounds.length - 1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle levels */}
      {Array.from({ length: Math.ceil((interviewRounds.length - 1) / 2) }, (_, levelIndex) => {
        const startIndex = interviewRounds.length - 2 - levelIndex * 2
        const endIndex = Math.max(0, startIndex - 1)

        return (
          <div key={levelIndex} className="flex justify-center space-x-4">
            {Array.from({ length: Math.min(2, startIndex + 1) }, (_, cardIndex) => {
              const roundIndex = startIndex - cardIndex
              if (roundIndex < 0) return null

              return (
                <Card key={roundIndex} className={`w-36 ${getStatusColor(roundIndex)}`}>
                  <CardContent className="p-3 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      {getStatusIcon(roundIndex)}
                      <p className="text-xs font-medium">{interviewRounds[roundIndex]?.name}</p>
                      <Badge variant="outline" className="text-xs border-hr-border text-hr-text-primary">
                        {getStatusText(roundIndex)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}