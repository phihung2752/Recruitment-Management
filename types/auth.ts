export type Role =
  | "admin"
  | "department_manager"
  | "recruiter"
  | "hr_manager"
  | "interviewer"
  | "employee"
  | "senior_management"
  | "system_administrator"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department?: string
  jobTitle?: string
}

export interface Module {
  id: string
  name: string
  allowedRoles: Role[]
  features: {
    id: string
    name: string
    allowedRoles: Role[]
  }[]
}

export const modules: Module[] = [
  {
    id: "recruitment_request",
    name: "Recruitment Request Management",
    allowedRoles: ["department_manager", "recruiter", "hr_manager"],
    features: [
      {
        id: "create_request",
        name: "Create Recruitment Request",
        allowedRoles: ["department_manager", "hr_manager"]
      },
      {
        id: "approve_request",
        name: "Approve Recruitment Request",
        allowedRoles: ["department_manager", "hr_manager"]
      },
      // Add other features...
    ]
  },
  // Add other modules...
]
