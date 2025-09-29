"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { InterviewRoundsConfig } from "./interview-rounds-config"
import { CandidateList } from "./candidate-list"
import { CandidateInterviewTracking } from "./candidate-interview-tracking"
import { InterviewScheduler } from "./interview-scheduler"
import { InterviewNotifications } from "./interview-notifications"
import { OnlineInterviewSupport } from "./online-interview-support"
import { InterviewResultsRecorder } from "./interview-results-recorder"
import { AIInterviewAssistant } from "./ai-interview-assistant"
import { InPersonInterviewManagement } from "./in-person-interview-management"
import { CandidateEvaluation } from "./candidate-evaluation"
import { InterviewFeedback } from "./interview-feedback"
import { InterviewQuestionsManager } from "./interview-questions-manager"
import { InterviewAnalytics } from "./interview-analytics"

export interface Candidate {
  id: string
  name: string
  jobTitle: string
  currentRound: number
  status: "pending" | "passed" | "failed"
  email: string
}

export interface InterviewRound {
  id: string
  name: string
  description: string
  order: number
}

export default function InterviewManagement() {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const tabsRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { value: "candidates", label: "Candidates" },
    { value: "rounds", label: "Rounds" },
    { value: "scheduler", label: "Scheduler" },
    { value: "notifications", label: "Notifications" },
    { value: "online", label: "Online" },
    { value: "in-person", label: "In-Person" },
    { value: "results", label: "Results" },
    { value: "evaluation", label: "Evaluation" },
    { value: "feedback", label: "Feedback" },
    { value: "questions", label: "Questions" },
    { value: "analytics", label: "Analytics" },
    { value: "ai-assistant", label: "AI Assistant" },
  ]

  const nextTab = () => {
    setActiveTabIndex((prev) => (prev + 1) % tabs.length)
  }

  const prevTab = () => {
    setActiveTabIndex((prev) => (prev - 1 + tabs.length) % tabs.length)
  }

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "1",
      name: "John Smith",
      jobTitle: "Senior Developer",
      currentRound: 1,
      status: "pending",
      email: "john@example.com",
    },
    {
      id: "2",
      name: "Alice Johnson",
      jobTitle: "Frontend Developer",
      currentRound: 2,
      status: "pending",
      email: "alice@example.com",
    },
    {
      id: "3",
      name: "Bob Wilson",
      jobTitle: "React Developer",
      currentRound: 3,
      status: "pending",
      email: "bob@example.com",
    },
  ])

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const [interviewRounds, setInterviewRounds] = useState<InterviewRound[]>([
    { id: "1", name: "Initial Screening", description: "Basic qualification check", order: 1 },
    { id: "2", name: "Technical Interview", description: "Skills assessment", order: 2 },
    { id: "3", name: "HR Interview", description: "Cultural fit evaluation", order: 3 },
  ])

  const updateCandidateStatus = (candidateId: string, newRound: number, newStatus: "pending" | "passed" | "failed") => {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, currentRound: newRound, status: newStatus } : candidate,
      ),
    )
    setSelectedCandidate((prev) =>
      prev && prev.id === candidateId ? { ...prev, currentRound: newRound, status: newStatus } : prev,
    )
  }

  useEffect(() => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.querySelector('[data-state="active"]')
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [activeTabIndex])

  return (
    <div className="w-full max-w-full">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Interview Management</h1>
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <Button variant="outline" size="icon" onClick={prevTab} className="lg:hidden bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextTab} className="lg:hidden bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full">
          <ScrollArea className="w-full">
            <div
              ref={tabsRef}
              className="flex items-center justify-start lg:justify-center rounded-md bg-muted p-1 text-muted-foreground min-w-max"
            >
              {tabs.map((tab, index) => (
                <Button
                  key={tab.value}
                  variant={activeTabIndex === index ? "default" : "ghost"}
                  onClick={() => setActiveTabIndex(index)}
                  className="flex-shrink-0 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap"
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {activeTabIndex === 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              <div className="xl:col-span-1 order-2 xl:order-1">
                <Card>
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <CandidateList candidates={candidates} onSelectCandidate={setSelectedCandidate} />
                  </CardContent>
                </Card>
              </div>
              {selectedCandidate && (
                <div className="xl:col-span-2 order-1 xl:order-2">
                  <Card>
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <CandidateInterviewTracking
                        candidate={selectedCandidate}
                        interviewRounds={interviewRounds}
                        onUpdateStatus={updateCandidateStatus}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {activeTabIndex === 1 && (
            <div className="w-full max-w-full overflow-hidden">
              <InterviewRoundsConfig rounds={interviewRounds} setRounds={setInterviewRounds} />
            </div>
          )}

          {activeTabIndex === 2 && (
            <div className="w-full max-w-full overflow-hidden">
              <InterviewScheduler candidates={candidates} interviewRounds={interviewRounds} />
            </div>
          )}

          {activeTabIndex === 3 && (
            <div className="w-full max-w-full overflow-hidden">
              <InterviewNotifications candidates={candidates} interviewRounds={interviewRounds} />
            </div>
          )}

          {activeTabIndex === 4 && (
            <div className="w-full max-w-full overflow-hidden">
              <OnlineInterviewSupport candidates={candidates} interviewRounds={interviewRounds} />
            </div>
          )}

          {activeTabIndex === 5 && (
            <div className="w-full max-w-full overflow-hidden">
              <InPersonInterviewManagement candidates={candidates} interviewRounds={interviewRounds} />
            </div>
          )}

          {activeTabIndex === 6 && (
            <div className="w-full max-w-full overflow-hidden">
              <InterviewResultsRecorder
                candidates={candidates}
                interviewRounds={interviewRounds}
                onUpdateStatus={updateCandidateStatus}
              />
            </div>
          )}

          {activeTabIndex === 7 && (
            <div className="w-full max-w-full overflow-hidden">
              <CandidateEvaluation candidates={candidates} interviewRounds={interviewRounds} />
            </div>
          )}

          {activeTabIndex === 8 && (
            <div className="w-full max-w-full overflow-hidden">
              <InterviewFeedback candidates={candidates} interviewRounds={interviewRounds} />
            </div>
          )}

          {activeTabIndex === 9 && (
            <div className="w-full max-w-full overflow-hidden">
              <InterviewQuestionsManager />
            </div>
          )}

          {activeTabIndex === 10 && (
            <div className="w-full max-w-full overflow-hidden">
              <InterviewAnalytics />
            </div>
          )}

          {activeTabIndex === 11 && (
            <div className="w-full max-w-full overflow-hidden">
              <AIInterviewAssistant candidates={candidates} interviewRounds={interviewRounds} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
