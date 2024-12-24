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
  const handleUpdateStatus = (status: "passed" | "failed") => {
    const newRound = status === "passed" ? candidate.currentRound + 1 : candidate.currentRound
    const newStatus = newRound > interviewRounds.length ? "passed" : "pending"
    onUpdateStatus(candidate.id, newRound, newStatus)
  }

  const skills = [
    { id: "1", name: "React" },
    { id: "2", name: "Node.js" },
    { id: "3", name: "TypeScript" },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Interview Progress: {candidate.name}</h2>
      <InterviewTrackingTree 
        candidate={candidate}
        interviewRounds={interviewRounds}
      />
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
        <Button onClick={() => handleUpdateStatus("passed")} variant="default" className="w-full sm:w-auto">
          Pass Current Round
        </Button>
        <Button onClick={() => handleUpdateStatus("failed")} variant="destructive" className="w-full sm:w-auto">
          Fail Current Round
        </Button>
      </div>
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="chatbot">AI Chatbot</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
        </TabsList>
        <TabsContent value="analysis">
          <AICandidateAnalysis candidate={candidate} />
        </TabsContent>
        <TabsContent value="scheduling">
          <AutomatedScheduling candidate={candidate} interviewRounds={interviewRounds} />
        </TabsContent>
        <TabsContent value="chatbot">
          <AIChatbot />
        </TabsContent>
        <TabsContent value="feedback">
          <FeedbackSystem candidateId={candidate.id} interviewRound={interviewRounds[candidate.currentRound - 1].name} />
        </TabsContent>
        <TabsContent value="skills">
          <SkillManagement />
        </TabsContent>
        <TabsContent value="assessment">
          <CandidateSkillAssessment candidateId={candidate.id} candidateName={candidate.name} skills={skills} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

