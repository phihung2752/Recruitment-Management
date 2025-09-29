"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"

interface CV {
  id: number
  candidateName: string
  email: string
  phone: string
  position: string
  uploadDate: string
  status: "pending" | "analyzed" | "matched" | "rejected"
  cvText: string
  analysis?: {
    matchScore: number
    matchingSkills: string[]
    missingSkills: string[]
    experienceLevel: string
    summary: string
    recommendations: string[]
  }
  matchedJobs?: Array<{
    jobId: number
    jobTitle: string
    matchPercentage: number
    recommendation: string
  }>
}

interface Job {
  id: number
  title: string
  description: string
  requirements: string[]
}

export default function CVManagementPage() {
  const [cvs, setCvs] = useState<CV[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedCV, setSelectedCV] = useState<CV | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [matching, setMatching] = useState(false)

  useEffect(() => {
    loadCVs()
    loadJobs()
  }, [])

  const loadCVs = () => {
    // Mock CV data - replace with real API call
    const mockCVs: CV[] = [
      {
        id: 1,
        candidateName: "John Doe",
        email: "john.doe@email.com",
        phone: "+1234567890",
        position: "Senior Frontend Developer",
        uploadDate: "2024-01-15",
        status: "pending",
        cvText: `
          John Doe - Senior Frontend Developer
          
          Experience:
          - 5+ years of React development
          - Expert in TypeScript, JavaScript, HTML, CSS
          - Experience with Next.js, Redux, GraphQL
          - Worked at Google, Microsoft
          - Led team of 8 developers
          
          Education:
          - BS Computer Science, Stanford University
          
          Skills:
          React, TypeScript, JavaScript, Next.js, Redux, GraphQL, Node.js, AWS, Docker
        `,
      },
      {
        id: 2,
        candidateName: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+1234567891",
        position: "Product Manager",
        uploadDate: "2024-01-18",
        status: "analyzed",
        cvText: `
          Jane Smith - Product Manager
          
          Experience:
          - 7+ years in product management
          - Led product launches at Apple, Amazon
          - Expert in user research, data analysis
          - Managed cross-functional teams
          
          Education:
          - MBA, Harvard Business School
          - BS Engineering, MIT
          
          Skills:
          Product Strategy, User Research, Data Analysis, Agile, Scrum, SQL, Python
        `,
        analysis: {
          matchScore: 85,
          matchingSkills: ["Product Strategy", "User Research", "Data Analysis", "Agile"],
          missingSkills: ["Machine Learning", "A/B Testing"],
          experienceLevel: "Senior",
          summary: "Excellent product management background with strong analytical skills",
          recommendations: ["Consider additional ML training", "Strong leadership experience"],
        },
      },
      {
        id: 3,
        candidateName: "Alex Rodriguez",
        email: "alex.rodriguez@email.com",
        phone: "+1234567892",
        position: "Full Stack Developer",
        uploadDate: "2024-01-20",
        status: "matched",
        cvText: `
          Alex Rodriguez - Full Stack Developer
          
          Experience:
          - 4+ years full stack development
          - React, Node.js, Python, PostgreSQL
          - Built scalable web applications
          - DevOps experience with AWS, Docker
          
          Education:
          - BS Computer Science, UC Berkeley
          
          Skills:
          React, Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes, GraphQL
        `,
        analysis: {
          matchScore: 92,
          matchingSkills: ["React", "Node.js", "Python", "PostgreSQL", "AWS"],
          missingSkills: ["TypeScript", "Redis"],
          experienceLevel: "Mid-Senior",
          summary: "Strong full stack developer with excellent technical skills",
          recommendations: ["Perfect fit for full stack roles", "Consider TypeScript training"],
        },
        matchedJobs: [
          {
            jobId: 1,
            jobTitle: "Senior Full Stack Developer",
            matchPercentage: 92,
            recommendation: "Highly Recommended",
          },
          {
            jobId: 2,
            jobTitle: "Backend Developer",
            matchPercentage: 78,
            recommendation: "Recommended",
          },
        ],
      },
    ]
    setCvs(mockCVs)
  }

  const loadJobs = () => {
    // Mock job data
    const mockJobs: Job[] = [
      {
        id: 1,
        title: "Senior Full Stack Developer",
        description: "We are looking for a senior full stack developer to join our team",
        requirements: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "5+ years experience"],
      },
      {
        id: 2,
        title: "Product Manager",
        description: "Seeking an experienced product manager to lead our product initiatives",
        requirements: ["Product Strategy", "User Research", "Data Analysis", "Agile", "5+ years experience"],
      },
      {
        id: 3,
        title: "Frontend Developer",
        description: "Frontend developer position for our web applications",
        requirements: ["React", "TypeScript", "CSS", "JavaScript", "3+ years experience"],
      },
    ]
    setJobs(mockJobs)
  }

  const analyzeCV = async (cv: CV) => {
    if (!selectedJob) {
      alert("Please select a job to analyze against")
      return
    }

    setAnalyzing(true)
    try {
      const response = await api.post("/ai/analyze-cv", {
        cvText: cv.cvText,
        jobDescription: `${selectedJob.title}\n${selectedJob.description}\nRequirements: ${selectedJob.requirements.join(", ")}`,
      })

      // Update CV with analysis
      const updatedCVs = cvs.map((c) =>
        c.id === cv.id ? { ...c, status: "analyzed" as const, analysis: response.data.analysis } : c,
      )
      setCvs(updatedCVs)
      setSelectedCV({ ...cv, status: "analyzed", analysis: response.data.analysis })
    } catch (error) {
      console.error("Error analyzing CV:", error)
      alert("Failed to analyze CV. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  const matchCandidates = async () => {
    if (!selectedJob) {
      alert("Please select a job for matching")
      return
    }

    setMatching(true)
    try {
      const candidateIds = cvs.map((cv) => cv.id)
      const response = await api.post("/ai/match-candidates", {
        jobId: selectedJob.id,
        candidateIds: candidateIds,
      })

      // Update CVs with matching results
      const updatedCVs = cvs.map((cv) => {
        const match = response.data.matches.find((m: any) => m.candidateId === cv.id)
        if (match) {
          return {
            ...cv,
            status: "matched" as const,
            matchedJobs: [
              {
                jobId: selectedJob.id,
                jobTitle: selectedJob.title,
                matchPercentage: match.matchPercentage,
                recommendation: match.recommendation,
              },
            ],
          }
        }
        return cv
      })
      setCvs(updatedCVs)
    } catch (error) {
      console.error("Error matching candidates:", error)
      alert("Failed to match candidates. Please try again.")
    } finally {
      setMatching(false)
    }
  }

  const getStatusColor = (status: CV["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "analyzed":
        return "bg-blue-100 text-blue-800"
      case "matched":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">CV Management & AI Analysis</h1>
        <p className="text-gray-600">Analyze CVs and match candidates with AI-powered insights</p>
      </div>

      {/* Job Selection */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Select Job for Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                selectedJob?.id === job.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <h4 className="font-medium text-gray-900">{job.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{job.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {job.requirements.slice(0, 3).map((req) => (
                  <span key={req} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {req}
                  </span>
                ))}
                {job.requirements.length > 3 && (
                  <span className="text-xs text-gray-500">+{job.requirements.length - 3} more</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Actions */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">AI Actions</h3>
        <div className="flex space-x-4">
          <button
            onClick={matchCandidates}
            disabled={!selectedJob || matching}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>🤖</span>
            <span>{matching ? "Matching..." : "Match All Candidates"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CV List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">CVs ({cvs.length})</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {cvs.map((cv) => (
                <div
                  key={cv.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedCV?.id === cv.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                  }`}
                  onClick={() => setSelectedCV(cv)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{cv.candidateName}</h3>
                      <p className="text-sm text-gray-600">{cv.position}</p>
                      <p className="text-xs text-gray-500 mt-1">{cv.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(cv.status)}`}>{cv.status}</span>
                  </div>

                  {cv.analysis && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Match Score:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${cv.analysis.matchScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{cv.analysis.matchScore}%</span>
                      </div>
                    </div>
                  )}

                  {cv.matchedJobs && cv.matchedJobs.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-green-600 font-medium">
                        Matched to {cv.matchedJobs.length} job(s)
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CV Details */}
        <div className="lg:col-span-2">
          {selectedCV ? (
            <div className="space-y-6">
              {/* CV Header */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCV.candidateName}</h2>
                    <p className="text-gray-600">{selectedCV.position}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{selectedCV.email}</span>
                      <span>{selectedCV.phone}</span>
                      <span>Uploaded: {selectedCV.uploadDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedCV.status)}`}>
                      {selectedCV.status}
                    </span>
                    {selectedJob && (
                      <button
                        onClick={() => analyzeCV(selectedCV)}
                        disabled={analyzing}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <span>🔍</span>
                        <span>{analyzing ? "Analyzing..." : "Analyze CV"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Analysis Results */}
              {selectedCV.analysis && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">AI Analysis Results</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Match Score</h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div
                            className={`h-4 rounded-full ${
                              selectedCV.analysis.matchScore >= 80
                                ? "bg-green-500"
                                : selectedCV.analysis.matchScore >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${selectedCV.analysis.matchScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xl font-bold">{selectedCV.analysis.matchScore}%</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Experience Level</h4>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {selectedCV.analysis.experienceLevel}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Matching Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCV.analysis.matchingSkills.map((skill) => (
                          <span key={skill} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Missing Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCV.analysis.missingSkills.map((skill) => (
                          <span key={skill} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                            ✗ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                    <p className="text-gray-700">{selectedCV.analysis.summary}</p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedCV.analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-700">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Job Matches */}
              {selectedCV.matchedJobs && selectedCV.matchedJobs.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Job Matches</h3>
                  <div className="space-y-4">
                    {selectedCV.matchedJobs.map((match) => (
                      <div key={match.jobId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{match.jobTitle}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              match.recommendation === "Highly Recommended"
                                ? "bg-green-100 text-green-800"
                                : match.recommendation === "Recommended"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {match.recommendation}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">Match:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${match.matchPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{match.matchPercentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CV Content */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">CV Content</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{selectedCV.cvText}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-96">
              <p className="text-gray-500">Select a CV to view details and analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
