import { useState } from "react"
import { Candidate, InterviewRound } from "./interview-management"
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
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CandidateInterviewTrackingProps {
  candidate: Candidate
  interviewRounds: InterviewRound[]
  onUpdateStatus: (candidateId: string, newRound: number, newStatus: "pending" | "passed" | "failed") => void
}

export function CandidateInterviewTracking({ 
  candidate, 
  interviewRounds,
  onUpdateStatus 
}: CandidateInterviewTrackingProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const tabs = [
    { value: "analysis", label: "AI Analysis" },
    { value: "scheduling", label: "Scheduling" },
    { value: "chatbot", label: "AI Chatbot" },
    { value: "feedback", label: "Feedback" },
    { value: "skills", label: "Skills" },
    { value: "assessment", label: "Assessment" }
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
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">
              Interview Progress: {candidate.name}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus("passed")}
              >
                Pass Round
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleUpdateStatus("failed")}
              >
                Fail Round
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="w-full">
            <div className="min-w-[600px]">
              <InterviewTrackingTree 
                candidate={candidate}
                interviewRounds={interviewRounds}
              />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTab}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTab}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs 
            defaultValue="analysis" 
            value={tabs[activeTabIndex].value}
            onValueChange={(value) => setActiveTabIndex(tabs.findIndex(tab => tab.value === value))}
          >
            <ScrollArea className="w-full border-b">
              <TabsList className="inline-flex w-auto p-1 px-4">
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

            <div className="p-4">
              <TabsContent value="analysis" className="m-0">
                <AICandidateAnalysis candidate={candidate} />
              </TabsContent>
              
              <TabsContent value="scheduling" className="m-0">
                <AutomatedScheduling 
                  candidate={candidate} 
                  interviewRounds={interviewRounds} 
                />
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

