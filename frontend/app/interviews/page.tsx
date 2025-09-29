"use client"

import { useState, useEffect } from "react"
import InterviewRoundsTriangle from "@/components/interview-rounds-triangle"

interface Interview {
  id: number
  candidateName: string
  jobTitle: string
  rounds: Array<{
    id: number
    name: string
    status: "pending" | "passed" | "failed" | "in-progress"
    interviewer: {
      name: string
      avatar: string
    }
    date?: string
    notes?: string
  }>
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)

  useEffect(() => {
    // Mock data - replace with real API call
    const mockInterviews: Interview[] = [
      {
        id: 1,
        candidateName: "John Doe",
        jobTitle: "Senior Frontend Developer",
        rounds: [
          {
            id: 1,
            name: "Initial Screening",
            status: "passed",
            interviewer: { name: "Sarah Johnson", avatar: "" },
            date: "2024-01-15",
            notes: "Strong communication skills, good technical background",
          },
          {
            id: 2,
            name: "Technical Assessment",
            status: "passed",
            interviewer: { name: "Mike Chen", avatar: "" },
            date: "2024-01-18",
            notes: "Excellent coding skills, solved all problems efficiently",
          },
          {
            id: 3,
            name: "System Design",
            status: "in-progress",
            interviewer: { name: "Emily Davis", avatar: "" },
            date: "2024-01-22",
          },
          {
            id: 4,
            name: "Final Interview",
            status: "pending",
            interviewer: { name: "David Wilson", avatar: "" },
          },
        ],
      },
      {
        id: 2,
        candidateName: "Jane Smith",
        jobTitle: "Product Manager",
        rounds: [
          {
            id: 1,
            name: "HR Screening",
            status: "passed",
            interviewer: { name: "Lisa Brown", avatar: "" },
            date: "2024-01-10",
          },
          {
            id: 2,
            name: "Product Case Study",
            status: "failed",
            interviewer: { name: "Tom Anderson", avatar: "" },
            date: "2024-01-14",
            notes: "Good analytical skills but lacked product vision",
          },
        ],
      },
      {
        id: 3,
        candidateName: "Alex Rodriguez",
        jobTitle: "Full Stack Developer",
        rounds: [
          {
            id: 1,
            name: "Phone Screening",
            status: "passed",
            interviewer: { name: "Rachel Green", avatar: "" },
            date: "2024-01-20",
          },
          {
            id: 2,
            name: "Technical Round 1",
            status: "passed",
            interviewer: { name: "Kevin Lee", avatar: "" },
            date: "2024-01-23",
          },
          {
            id: 3,
            name: "Technical Round 2",
            status: "passed",
            interviewer: { name: "Anna White", avatar: "" },
            date: "2024-01-25",
          },
          {
            id: 4,
            name: "Behavioral Interview",
            status: "in-progress",
            interviewer: { name: "Mark Taylor", avatar: "" },
            date: "2024-01-28",
          },
          {
            id: 5,
            name: "Team Fit Interview",
            status: "pending",
            interviewer: { name: "Sophie Clark", avatar: "" },
          },
          {
            id: 6,
            name: "Final Decision",
            status: "pending",
            interviewer: { name: "James Miller", avatar: "" },
          },
        ],
      },
    ]

    setInterviews(mockInterviews)
    setSelectedInterview(mockInterviews[0])
  }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Interview Management</h1>
        <p className="text-gray-600">Track candidate progress through interview rounds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interview List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Active Interviews</h2>
            <div className="space-y-3">
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedInterview?.id === interview.id
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                  }`}
                  onClick={() => setSelectedInterview(interview)}
                >
                  <h3 className="font-medium text-gray-900">{interview.candidateName}</h3>
                  <p className="text-sm text-gray-600">{interview.jobTitle}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {interview.rounds.length} rounds
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {interview.rounds.filter((r) => r.status === "passed").length} passed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Triangle Visualization */}
        <div className="lg:col-span-2">
          {selectedInterview ? (
            <InterviewRoundsTriangle
              rounds={selectedInterview.rounds}
              candidateName={selectedInterview.candidateName}
              jobTitle={selectedInterview.jobTitle}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center h-96">
              <p className="text-gray-500">Select an interview to view progress</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Interviews</h3>
          <p className="text-2xl font-bold text-gray-900">{interviews.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
          <p className="text-2xl font-bold text-blue-600">
            {interviews.filter((i) => i.rounds.some((r) => r.status === "in-progress")).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold text-green-600">
            {interviews.filter((i) => i.rounds.every((r) => r.status === "passed" || r.status === "failed")).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
          <p className="text-2xl font-bold text-purple-600">75%</p>
        </div>
      </div>
    </div>
  )
}
