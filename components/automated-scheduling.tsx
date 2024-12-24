"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedCalendar } from "./enhanced-calendar"
import { InterviewScheduler } from "./interview-scheduler"
import { Candidate, InterviewRound } from "./interview-management"

interface AutomatedSchedulingProps {
  candidate: Candidate
  interviewRounds: InterviewRound[]
}

export function AutomatedScheduling({ candidate, interviewRounds }: AutomatedSchedulingProps) {
  return (
    <Tabs defaultValue="calendar" className="w-full">
      <TabsList>
        <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        <TabsTrigger value="scheduler">Schedule Interview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="calendar">
        <EnhancedCalendar />
      </TabsContent>
      
      <TabsContent value="scheduler">
        <InterviewScheduler
          candidateId={candidate.id}
          candidateName={candidate.name}
          candidateEmail="candidate@example.com" // This would come from your candidate data
        />
      </TabsContent>
    </Tabs>
  )
}

