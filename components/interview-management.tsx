"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { InterviewRoundsConfig } from "./interview-rounds-config"
import { CandidateList } from "./candidate-list"
import { CandidateInterviewTracking } from "./candidate-interview-tracking"
import { RecruitmentDashboard } from "./recruitment-dashboard"
import { SkillManagement } from "./skill-management"
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
    { id: "1", name: "John Smith", jobTitle: "Senior Developer", currentRound: 1, status: "pending", email: "john@example.com" },
    { id: "2", name: "Alice Johnson", jobTitle: "Frontend Developer", currentRound: 2, status: "pending", email: "alice@example.com" },
    { id: "3", name: "Bob Wilson", jobTitle: "React Developer", currentRound: 3, status: "pending", email: "bob@example.com" },
  ])

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const [interviewRounds, setInterviewRounds] = useState<InterviewRound[]>([
    { id: "1", name: "Initial Screening", description: "Basic qualification check", order: 1 },
    { id: "2", name: "Technical Interview", description: "Skills assessment", order: 2 },
    { id: "3", name: "HR Interview", description: "Cultural fit evaluation", order: 3 }
  ])

  const updateCandidateStatus = (candidateId: string, newRound: number, newStatus: "pending" | "passed" | "failed") => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, currentRound: newRound, status: newStatus } 
        : candidate
    ))
    setSelectedCandidate(prev => prev && prev.id === candidateId 
      ? { ...prev, currentRound: newRound, status: newStatus } 
      : prev
    )
  }

  return (
    <Card className="min-h-screen bg-background">
      <CardContent className="p-2 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Interview Management</h1>
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTab}
                className="hidden md:flex"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTab}
                className="hidden md:flex"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs 
            defaultValue="candidates" 
            value={tabs[activeTabIndex].value}
            onValueChange={(value) => setActiveTabIndex(tabs.findIndex(tab => tab.value === value))}
            className="space-y-4"
          >
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-auto p-1 bg-muted rounded-lg">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="min-w-[100px] whitespace-nowrap"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
            
            <div className="mt-4 space-y-4">
              <TabsContent value="candidates">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-1">
                    <Card>
                      <CardContent className="p-4">
                        <CandidateList 
                          candidates={candidates} 
                          onSelectCandidate={setSelectedCandidate} 
                        />
                      </CardContent>
                    </Card>
                  </div>
                  {selectedCandidate && (
                    <div className="lg:col-span-2">
                      <Card>
                        <CardContent className="p-4">
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
              </TabsContent>
              
              <TabsContent value="rounds">
                <InterviewRoundsConfig 
                  rounds={interviewRounds} 
                  setRounds={setInterviewRounds} 
                />
              </TabsContent>

              <TabsContent value="scheduler">
                <InterviewScheduler 
                  candidates={candidates}
                  interviewRounds={interviewRounds}
                />
              </TabsContent>

              <TabsContent value="notifications">
                <InterviewNotifications 
                  candidates={candidates}
                  interviewRounds={interviewRounds}
                />
              </TabsContent>

              <TabsContent value="online">
                <OnlineInterviewSupport 
                  candidates={candidates}
                  interviewRounds={interviewRounds}
                />
              </TabsContent>

              <TabsContent value="in-person">
                <InPersonInterviewManagement 
                  candidates={candidates}
                  interviewRounds={interviewRounds}
                />
              </TabsContent>

              <TabsContent value="results">
                <InterviewResultsRecorder 
                  candidates={candidates}
                  interviewRounds={interviewRounds}
                  onUpdateStatus={updateCandidateStatus}
                />
              </TabsContent>

              <TabsContent value="evaluation">
                <CandidateEvaluation 
                  candidates={candidates}
                  interviewRounds={interviewRounds}
                />
              </TabsContent>

              <TabsContent value="feedback">
                <InterviewFeedback 
                  candidates={candidates}
                  interviewRounds={interviewRounds}
                />
              </TabsContent>

              <TabsContent value="questions">
                <InterviewQuestionsManager />
              </TabsContent>

              <TabsContent value="analytics">
                <InterviewAnalytics />
              </TabsContent>

              <TabsContent value="ai-assistant">
                <AIInterviewAssistant 
                  candidates={candidates}
                  interviewRounds={interviewRounds}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

