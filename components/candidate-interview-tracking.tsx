"use client"

import { useState } from "react"
import type { Candidate, InterviewRound } from "./interview-management"
import { InterviewTrackingTree } from "./interview-tracking-tree"
import { AICandidateAnalysis } from "./ai-candidate-analysis"
import { AutomatedScheduling } from "./automated-scheduling"
import { AIChatbot } from "./ai-chatbot"
import { FeedbackSystem } from "./feedback-system"
import { SkillManagement } from "./skill-management"
import { CandidateSkillAssessment } from "./candidate-skill-assessment"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CandidateInterviewTrackingProps {
  candidate: Candidate
  interviewRounds: InterviewRound[]
  onUpdateStatus: (candidateId: string, newRound: number, newStatus: "pending" | "passed" | "failed") => void
}

export function CandidateInterviewTracking({
  candidate,
  interviewRounds,
  onUpdateStatus,
}: CandidateInterviewTrackingProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const tabs = [
    { value: "analysis", label: "AI Analysis" },
    { value: "scheduling", label: "Scheduling" },
    { value: "chatbot", label: "AI Chatbot" },
    { value: "feedback", label: "Feedback" },
    { value: "skills", label: "Skills" },
    { value: "assessment", label: "Assessment" },
  ]

  const handleUpdateStatus = (status: "passed" | "failed") => {
    const newRound = status === "passed" ? candidate.currentRound + 1 : candidate.currentRound
    const newStatus = newRound > interviewRounds.length ? "passed" : "pending"
    onUpdateStatus(candidate.id, newRound, newStatus)
  }

  const nextTab = () => {
    setActiveTabIndex((prev) => (prev + 1) % tabs.length)
  }

  const prevTab = () => {
    setActiveTabIndex((prev) => (prev - 1 + tabs.length) % tabs.length)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base sm:text-lg lg:text-xl">Interview Progress: {candidate.name}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus("passed")}
                className="text-xs sm:text-sm"
              >
                Pass Round
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleUpdateStatus("failed")}
                className="text-xs sm:text-sm"
              >
                Fail Round
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <ScrollArea className="w-full">
            <div className="min-w-[300px] sm:min-w-[600px]">
              <InterviewTrackingTree 
                candidate={{
                  ...candidate,
                  id: parseInt(candidate.id) || 0,
                  firstName: candidate.name?.split(' ')[0] || '',
                  lastName: candidate.name?.split(' ').slice(1).join(' ') || ''
                }} 
                interviewRounds={interviewRounds.map(round => ({
                  ...round,
                  id: parseInt(round.id) || 0,
                  status: (round as any).status || 'pending',
                  interviewer: (round as any).interviewer || 'TBD'
                }))} 
              />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b p-3 sm:p-4 lg:p-6 gap-4">
            <h3 className="text-base sm:text-lg font-semibold">Additional Information</h3>
            <div className="flex items-center space-x-2 justify-center sm:justify-end">
              <Button variant="outline" size="icon" onClick={prevTab} className="lg:hidden bg-transparent">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextTab} className="lg:hidden bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs
            defaultValue="analysis"
            value={tabs[activeTabIndex].value}
            onValueChange={(value) => setActiveTabIndex(tabs.findIndex((tab) => tab.value === value))}
          >
            <div className="border-b">
              <ScrollArea className="w-full">
                <TabsList className="inline-flex w-auto p-1 px-3 sm:px-4 min-w-max">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex-shrink-0 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>

            <div className="p-3 sm:p-4 lg:p-6">
              <TabsContent value="analysis" className="m-0">
                <AICandidateAnalysis candidate={candidate} />
              </TabsContent>

              <TabsContent value="scheduling" className="m-0">
                <AutomatedScheduling candidate={candidate} interviewRounds={interviewRounds} />
              </TabsContent>

              <TabsContent value="chatbot" className="m-0">
                <AIChatbot />
              </TabsContent>

              <TabsContent value="feedback" className="m-0">
                <FeedbackSystem
                  candidateId={candidate.id}
                  interviewRound={interviewRounds[candidate.currentRound - 1].name}
                />
              </TabsContent>

              <TabsContent value="skills" className="m-0">
                <SkillManagement />
              </TabsContent>

              <TabsContent value="assessment" className="m-0">
                <CandidateSkillAssessment
                  candidateId={candidate.id}
                  candidateName={candidate.name}
                  skills={[
                    { id: "1", name: "React" },
                    { id: "2", name: "Node.js" },
                    { id: "3", name: "TypeScript" },
                  ]}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
