// Object-Relational Mapping (ORM) for HR Management System
// This provides a TypeScript interface to interact with the SQL database

export interface DatabaseConfig {
  server: string
  database: string
  user?: string
  password?: string
  options: {
    encrypt: boolean
    trustServerCertificate: boolean
  }
}

export interface QueryResult<T = any> {
  recordset: T[]
  recordsets: T[][]
  rowsAffected: number[]
}

// Base Entity Interface
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
  createdById?: string
}

// User Entities
export interface User extends BaseEntity {
  username: string
  email: string
  passwordHash: string
  salt: string
  firstName: string
  lastName: string
  phoneNumber?: string
  avatar?: string
  isActive: boolean
  emailConfirmed: boolean
  phoneNumberConfirmed: boolean
  twoFactorEnabled: boolean
  lockoutEnd?: Date
  lockoutEnabled: boolean
  accessFailedCount: number
  lastLoginAt?: Date
}

export interface Role extends BaseEntity {
  name: string
  normalizedName: string
  description?: string
  isSystemRole: boolean
}

export interface Permission extends BaseEntity {
  name: string
  normalizedName: string
  description?: string
  module: string
  action: string
  resource: string
}

// Organization Entities
export interface Company extends BaseEntity {
  name: string
  legalName?: string
  taxId?: string
  industry?: string
  website?: string
  logo?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  phone?: string
  email?: string
  isActive: boolean
}

export interface Department extends BaseEntity {
  companyId: string
  name: string
  code?: string
  description?: string
  parentDepartmentId?: string
  managerId?: string
  budget?: number
  location?: string
  isActive: boolean
}

export interface Position extends BaseEntity {
  departmentId: string
  title: string
  code?: string
  description?: string
  level?: string
  minSalary?: number
  maxSalary?: number
  requiredSkills?: string[]
  requiredExperience?: number
  isActive: boolean
}

// Employee Entities
export interface Employee extends BaseEntity {
  userId: string
  employeeId: string
  companyId: string
  departmentId: string
  positionId: string
  managerId?: string
  hireDate: Date
  terminationDate?: Date
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern"
  workLocation?: string
  salary?: number
  currency: string
  payFrequency?: string
  status: "Active" | "Inactive" | "On Leave" | "Terminated"
  probationEndDate?: Date
  contractEndDate?: Date
  skills?: string[]
  certifications?: string[]
  emergencyContactName?: string
  emergencyContactRelationship?: string
  emergencyContactPhone?: string
  emergencyContactEmail?: string
  notes?: string
}

// Recruitment Entities
export interface JobPosting extends BaseEntity {
  companyId: string
  departmentId: string
  positionId: string
  title: string
  description: string
  requirements?: string
  benefits?: string
  salaryMin?: number
  salaryMax?: number
  currency: string
  location?: string
  workType?: string
  employmentType?: string
  experienceLevel?: string
  status: "Draft" | "Published" | "Paused" | "Closed"
  publishedAt?: Date
  closedAt?: Date
  applicationDeadline?: Date
  expectedStartDate?: Date
  numberOfPositions: number
  priority: "Low" | "Medium" | "High" | "Urgent"
  internalPosting: boolean
  externalPosting: boolean
  postingChannels?: string[]
}

export interface Candidate extends BaseEntity {
  firstName: string
  lastName: string
  email: string
  phone?: string
  linkedInProfile?: string
  gitHubProfile?: string
  portfolioUrl?: string
  currentPosition?: string
  currentCompany?: string
  location?: string
  nationality?: string
  workAuthorization?: string
  expectedSalary?: number
  currency: string
  noticePeriod?: string
  availabilityDate?: Date
  yearsOfExperience?: number
  skills?: string[]
  education?: any[]
  workExperience?: any[]
  languages?: string[]
  certifications?: string[]
  source?: string
  sourceDetails?: string
  rating?: number
  status: "New" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected" | "Withdrawn"
  notes?: string
  isBlacklisted: boolean
  blacklistReason?: string
}

export interface JobApplication extends BaseEntity {
  jobPostingId: string
  candidateId: string
  applicationSource?: string
  coverLetter?: string
  status: "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected" | "Withdrawn"
  stage?: string
  rating?: number
  feedback?: string
  rejectionReason?: string
  appliedAt: Date
  reviewedAt?: Date
  reviewedById?: string
}

// Interview Entities
export interface Interview extends BaseEntity {
  jobApplicationId: string
  interviewRoundId?: string
  title: string
  type: "Phone" | "Video" | "In-Person" | "Technical" | "HR" | "Panel"
  scheduledStartTime: Date
  scheduledEndTime: Date
  actualStartTime?: Date
  actualEndTime?: Date
  timeZone: string
  location?: string
  meetingLink?: string
  meetingId?: string
  meetingPassword?: string
  status: "Scheduled" | "Confirmed" | "In Progress" | "Completed" | "Cancelled" | "No Show"
  cancellationReason?: string
  instructions?: string
  notes?: string
  scheduledById: string
}

export interface InterviewFeedback extends BaseEntity {
  interviewId: string
  interviewerId: string
  overallRating: number
  technicalSkills?: number
  communicationSkills?: number
  problemSolving?: number
  culturalFit?: number
  leadership?: number
  recommendation: "Hire" | "No Hire" | "Maybe" | "Strong Hire"
  strengths?: string
  weaknesses?: string
  comments?: string
  isSubmitted: boolean
  submittedAt?: Date
}

// Calendar Entities
export interface CalendarEvent extends BaseEntity {
  title: string
  description?: string
  startTime: Date
  endTime: Date
  timeZone: string
  isAllDay: boolean
  location?: string
  meetingLink?: string
  eventType: "Interview" | "Meeting" | "Deadline" | "Holiday" | "Training" | "Review"
  status: "Scheduled" | "Confirmed" | "Cancelled" | "Completed"
  priority: "Low" | "Medium" | "High" | "Urgent"
  visibility: "Public" | "Private" | "Confidential"
  relatedEntityType?: string
  relatedEntityId?: string
  recurrenceRule?: string
  recurrenceException?: string[]
  reminders?: any[]
  notes?: string
}

// Repository Pattern Implementation
export abstract class BaseRepository<T extends BaseEntity> {
  protected tableName: string
  protected db: any // Database connection

  constructor(tableName: string, db: any) {
    this.tableName = tableName
    this.db = db
  }

  async findById(id: string): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE Id = @id`
    const result = await this.db.request().input("id", id).query(query)

    return result.recordset[0] || null
  }

  async findAll(filters?: any): Promise<T[]> {
    let query = `SELECT * FROM ${this.tableName}`
    const request = this.db.request()

    if (filters) {
      const conditions = Object.keys(filters).map((key, index) => {
        request.input(`param${index}`, filters[key])
        return `${key} = @param${index}`
      })

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }
    }

    const result = await request.query(query)
    return result.recordset
  }

  async create(entity: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    const id = this.generateId()
    const now = new Date()

    const entityWithMeta = {
      ...entity,
      id,
      createdAt: now,
      updatedAt: now,
    }

    const columns = Object.keys(entityWithMeta).join(", ")
    const values = Object.keys(entityWithMeta)
      .map((_, index) => `@param${index}`)
      .join(", ")

    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${values})`
    const request = this.db.request()

    Object.values(entityWithMeta).forEach((value, index) => {
      request.input(`param${index}`, value)
    })

    await request.query(query)
    return entityWithMeta as T
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const updatesWithMeta = {
      ...updates,
      updatedAt: new Date(),
    }

    const setClause = Object.keys(updatesWithMeta)
      .map((key, index) => {
        return `${key} = @param${index}`
      })
      .join(", ")

    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE Id = @id`
    const request = this.db.request().input("id", id)

    Object.values(updatesWithMeta).forEach((value, index) => {
      request.input(`param${index}`, value)
    })

    await request.query(query)
    return this.findById(id)
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE Id = @id`
    const result = await this.db.request().input("id", id).query(query)

    return result.rowsAffected[0] > 0
  }

  async softDelete(id: string): Promise<boolean> {
    return this.update(id, { isDeleted: true } as any) !== null
  }

  protected generateId(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c == "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}

// Specific Repository Implementations
export class UserRepository extends BaseRepository<User> {
  constructor(db: any) {
    super("Users", db)
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE Email = @email`
    const result = await this.db.request().input("email", email).query(query)

    return result.recordset[0] || null
  }

  async findByUsername(username: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE Username = @username`
    const result = await this.db.request().input("username", username).query(query)

    return result.recordset[0] || null
  }
}

export class EmployeeRepository extends BaseRepository<Employee> {
  constructor(db: any) {
    super("Employees", db)
  }

  async findByEmployeeId(employeeId: string): Promise<Employee | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE EmployeeId = @employeeId`
    const result = await this.db.request().input("employeeId", employeeId).query(query)

    return result.recordset[0] || null
  }

  async findByDepartment(departmentId: string): Promise<Employee[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE DepartmentId = @departmentId AND Status = 'Active'`
    const result = await this.db.request().input("departmentId", departmentId).query(query)

    return result.recordset
  }
}

export class CandidateRepository extends BaseRepository<Candidate> {
  constructor(db: any) {
    super("Candidates", db)
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE Email = @email`
    const result = await this.db.request().input("email", email).query(query)

    return result.recordset[0] || null
  }

  async searchBySkills(skills: string[]): Promise<Candidate[]> {
    const skillConditions = skills.map((_, index) => `Skills LIKE @skill${index}`).join(" OR ")
    const query = `SELECT * FROM ${this.tableName} WHERE ${skillConditions}`
    const request = this.db.request()

    skills.forEach((skill, index) => {
      request.input(`skill${index}`, `%${skill}%`)
    })

    const result = await request.query(query)
    return result.recordset
  }
}

export class JobPostingRepository extends BaseRepository<JobPosting> {
  constructor(db: any) {
    super("JobPostings", db)
  }

  async findActive(): Promise<JobPosting[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE Status = 'Published' AND (ApplicationDeadline IS NULL OR ApplicationDeadline > GETDATE())`
    const result = await this.db.request().query(query)
    return result.recordset
  }

  async findByDepartment(departmentId: string): Promise<JobPosting[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE DepartmentId = @departmentId`
    const result = await this.db.request().input("departmentId", departmentId).query(query)

    return result.recordset
  }
}

export class InterviewRepository extends BaseRepository<Interview> {
  constructor(db: any) {
    super("Interviews", db)
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Interview[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE ScheduledStartTime >= @startDate AND ScheduledStartTime <= @endDate`
    const result = await this.db.request().input("startDate", startDate).input("endDate", endDate).query(query)

    return result.recordset
  }

  async findByInterviewer(interviewerId: string): Promise<Interview[]> {
    const query = `
      SELECT i.* FROM ${this.tableName} i
      INNER JOIN InterviewParticipants ip ON i.Id = ip.InterviewId
      WHERE ip.UserId = @interviewerId AND ip.Role = 'Interviewer'
    `
    const result = await this.db.request().input("interviewerId", interviewerId).query(query)

    return result.recordset
  }
}

export class CalendarEventRepository extends BaseRepository<CalendarEvent> {
  constructor(db: any) {
    super("CalendarEvents", db)
  }

  async findByDateRange(startDate: Date, endDate: Date, userId?: string): Promise<CalendarEvent[]> {
    let query = `
      SELECT ce.* FROM ${this.tableName} ce
      LEFT JOIN CalendarEventAttendees cea ON ce.Id = cea.EventId
      WHERE ce.StartTime >= @startDate AND ce.StartTime <= @endDate
    `

    const request = this.db.request().input("startDate", startDate).input("endDate", endDate)

    if (userId) {
      query += ` AND (ce.CreatedById = @userId OR cea.UserId = @userId)`
      request.input("userId", userId)
    }

    const result = await request.query(query)
    return result.recordset
  }

  async findUpcoming(userId: string, limit = 10): Promise<CalendarEvent[]> {
    const query = `
      SELECT TOP (@limit) ce.* FROM ${this.tableName} ce
      LEFT JOIN CalendarEventAttendees cea ON ce.Id = cea.EventId
      WHERE ce.StartTime > GETDATE() 
      AND (ce.CreatedById = @userId OR cea.UserId = @userId)
      ORDER BY ce.StartTime ASC
    `

    const result = await this.db.request().input("userId", userId).input("limit", limit).query(query)

    return result.recordset
  }
}

// Database Service Class
export class DatabaseService {
  private db: any
  public users: UserRepository
  public employees: EmployeeRepository
  public candidates: CandidateRepository
  public jobPostings: JobPostingRepository
  public interviews: InterviewRepository
  public calendarEvents: CalendarEventRepository

  constructor(db: any) {
    this.db = db
    this.users = new UserRepository(db)
    this.employees = new EmployeeRepository(db)
    this.candidates = new CandidateRepository(db)
    this.jobPostings = new JobPostingRepository(db)
    this.interviews = new InterviewRepository(db)
    this.calendarEvents = new CalendarEventRepository(db)
  }

  async executeQuery<T = any>(query: string, params?: any): Promise<QueryResult<T>> {
    const request = this.db.request()

    if (params) {
      Object.keys(params).forEach((key) => {
        request.input(key, params[key])
      })
    }

    return await request.query(query)
  }

  async executeStoredProcedure<T = any>(procedureName: string, params?: any): Promise<QueryResult<T>> {
    const request = this.db.request()

    if (params) {
      Object.keys(params).forEach((key) => {
        request.input(key, params[key])
      })
    }

    return await request.execute(procedureName)
  }

  async beginTransaction(): Promise<any> {
    const transaction = this.db.transaction()
    await transaction.begin()
    return transaction
  }

  async commitTransaction(transaction: any): Promise<void> {
    await transaction.commit()
  }

  async rollbackTransaction(transaction: any): Promise<void> {
    await transaction.rollback()
  }
}

// Export types and utilities
export type {
  User,
  Role,
  Permission,
  Company,
  Department,
  Position,
  Employee,
  JobPosting,
  Candidate,
  JobApplication,
  Interview,
  InterviewFeedback,
  CalendarEvent,
}
