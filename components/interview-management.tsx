"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
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
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h1 className="text-3xl font-bold tracking-tight">Interview Management</h1>
          </div>
          
          <Tabs defaultValue="candidates" className="space-y-6">
            <div className="sticky top-0 z-10 bg-background pt-2 pb-4 border-b">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-1 bg-muted rounded-lg">
                <TabsTrigger value="candidates" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Candidates
                </TabsTrigger>
                <TabsTrigger value="rounds" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Interview Rounds
                </TabsTrigger>
                <TabsTrigger value="scheduler" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Scheduler
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="online-interview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Online Interview
                </TabsTrigger>
                <TabsTrigger value="in-person-interview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  In-Person Interview
                </TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Results
                </TabsTrigger>
                <TabsTrigger value="evaluation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Evaluation
                </TabsTrigger>
                <TabsTrigger value="feedback" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Feedback
                </TabsTrigger>
                <TabsTrigger value="questions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Questions
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="ai-assistant" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  AI Assistant
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="mt-4 space-y-6">
              <TabsContent value="candidates" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <Card>
                  <CardContent className="p-4">
                    <InterviewRoundsConfig 
                      rounds={interviewRounds} 
                      setRounds={setInterviewRounds} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scheduler">
                <Card>
                  <CardContent className="p-4">
                    <InterviewScheduler 
                      candidates={candidates}
                      interviewRounds={interviewRounds}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardContent className="p-4">
                    <InterviewNotifications 
                      candidates={candidates}
                      interviewRounds={interviewRounds}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="online-interview">
                <Card>
                  <CardContent className="p-4">
                    <OnlineInterviewSupport 
                      candidates={candidates}
                      interviewRounds={interviewRounds}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="in-person-interview">
                <Card>
                  <CardContent className="p-4">
                    <InPersonInterviewManagement 
                      candidates={candidates}
                      interviewRounds={interviewRounds}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results">
                <Card>
                  <CardContent className="p-4">
                    <InterviewResultsRecorder 
                      candidates={candidates}
                      interviewRounds={interviewRounds}
                      onUpdateStatus={updateCandidateStatus}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="evaluation">
                <Card>
                  <CardContent className="p-4">
                    <CandidateEvaluation 
                      candidates={candidates}
                      interviewRounds={interviewRounds}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feedback">
                <Card>
                  <CardContent className="p-4">
                    <InterviewFeedback 
                      candidates={candidates}
                      interviewRounds={interviewRounds}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions">
                <Card>
                  <CardContent className="p-4">
                    <InterviewQuestionsManager />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardContent className="p-4">
                    <InterviewAnalytics />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-assistant">
                <Card>
                  <CardContent className="p-4">
                    <AIInterviewAssistant 
                      candidates={candidates}
                      interviewRounds={interviewRounds}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

