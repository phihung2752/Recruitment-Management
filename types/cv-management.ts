export interface CV {
  id: string
  name: string
  email: string
  phone: string
  position: string
  experience: number
  skills: string[]
  skillLevels?: { [key: string]: number }
  source: string
  appliedDate: Date
  status: "New" | "Reviewing" | "Shortlisted" | "Interviewed" | "Offered" | "Rejected" | "Expired" | "Completed"
  matchPercentage?: number
  tags: string[]
  interviewStatus?: "Pending" | "Scheduled" | "Completed" | "Cancelled"
  interviewDate?: Date
  interviewLink?: string
  interviewScore?: number
  interviewFeedback?: string
  communicationLog?: { date: Date; message: string }[]
  progressStage?: string
  salary?: number
  location?: string
  approvalStatus?: "Pending" | "Approved" | "Rejected"
  approver?: string
}

export interface InterviewFeedbackForm {
  technicalSkills: number
  communicationSkills: number
  problemSolving: number
  culturalFit: number
  overallRating: number
  comments: string
}

export interface CVFilter {
  search: string
  skills: string[]
  status: string[]
  tags: string[]
  source: string[]
  matchPercentage: number
  location: string
  experienceLevel: string
  salary?: [number, number]
}

export interface JobPosting {
  id: string
  title: string
  department: string
  status: "Draft" | "Pending Approval" | "Approved" | "Published" | "Expired" | "Completed"
  approver?: string
  publishDate?: Date
  expirationDate?: Date
  applicants: number
}
