-- Fixed HR Management System Database Schema for SQL Server
-- This schema includes all tables for a comprehensive HR system

-- =============================================
-- CORE SYSTEM TABLES
-- =============================================

-- Users and Authentication
CREATE TABLE Users (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Salt NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Avatar NVARCHAR(255),
    IsActive BIT NOT NULL DEFAULT 1,
    EmailConfirmed BIT NOT NULL DEFAULT 0,
    PhoneNumberConfirmed BIT NOT NULL DEFAULT 0,
    TwoFactorEnabled BIT NOT NULL DEFAULT 0,
    LockoutEnd DATETIME2 NULL,
    LockoutEnabled BIT NOT NULL DEFAULT 1,
    AccessFailedCount INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    LastLoginAt DATETIME2 NULL,
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- Roles
CREATE TABLE Roles (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(50) NOT NULL UNIQUE,
    NormalizedName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    IsSystemRole BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- User Roles (Many-to-Many)
CREATE TABLE UserRoles (
    UserId NVARCHAR(36) NOT NULL,
    RoleId NVARCHAR(36) NOT NULL,
    AssignedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    AssignedById NVARCHAR(36) NULL,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    FOREIGN KEY (AssignedById) REFERENCES Users(Id)
);

-- Permissions
CREATE TABLE Permissions (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    NormalizedName NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    Module NVARCHAR(50) NOT NULL,
    Action NVARCHAR(50) NOT NULL,
    Resource NVARCHAR(50) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Role Permissions (Many-to-Many)
CREATE TABLE RolePermissions (
    RoleId NVARCHAR(36) NOT NULL,
    PermissionId NVARCHAR(36) NOT NULL,
    GrantedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    GrantedById NVARCHAR(36) NULL,
    PRIMARY KEY (RoleId, PermissionId),
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    FOREIGN KEY (PermissionId) REFERENCES Permissions(Id) ON DELETE CASCADE,
    FOREIGN KEY (GrantedById) REFERENCES Users(Id)
);

-- User Permissions (Direct permissions, overrides role permissions)
CREATE TABLE UserPermissions (
    UserId NVARCHAR(36) NOT NULL,
    PermissionId NVARCHAR(36) NOT NULL,
    IsGranted BIT NOT NULL, -- True for grant, False for deny
    GrantedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    GrantedById NVARCHAR(36) NULL,
    PRIMARY KEY (UserId, PermissionId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (PermissionId) REFERENCES Permissions(Id) ON DELETE CASCADE,
    FOREIGN KEY (GrantedById) REFERENCES Users(Id)
);

-- =============================================
-- ORGANIZATION STRUCTURE
-- =============================================

-- Companies/Organizations
CREATE TABLE Companies (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    LegalName NVARCHAR(100),
    TaxId NVARCHAR(50),
    Industry NVARCHAR(100),
    Website NVARCHAR(255),
    Logo NVARCHAR(255),
    Address NVARCHAR(MAX),
    City NVARCHAR(50),
    State NVARCHAR(50),
    Country NVARCHAR(50),
    PostalCode NVARCHAR(20),
    Phone NVARCHAR(20),
    Email NVARCHAR(100),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- Departments
CREATE TABLE Departments (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    CompanyId NVARCHAR(36) NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(20),
    Description NVARCHAR(255),
    ParentDepartmentId NVARCHAR(36) NULL,
    ManagerId NVARCHAR(36) NULL,
    Budget DECIMAL(18,2),
    Location NVARCHAR(100),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE CASCADE,
    FOREIGN KEY (ParentDepartmentId) REFERENCES Departments(Id),
    FOREIGN KEY (ManagerId) REFERENCES Users(Id),
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- Positions/Job Titles
CREATE TABLE Positions (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    DepartmentId NVARCHAR(36) NOT NULL,
    Title NVARCHAR(100) NOT NULL,
    Code NVARCHAR(20),
    Description NVARCHAR(MAX),
    Level NVARCHAR(50), -- Junior, Mid, Senior, Lead, Manager, Director, etc.
    MinSalary DECIMAL(18,2),
    MaxSalary DECIMAL(18,2),
    RequiredSkills NVARCHAR(MAX), -- JSON array of skills
    RequiredExperience INT, -- Years of experience
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (DepartmentId) REFERENCES Departments(Id) ON DELETE CASCADE,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- =============================================
-- EMPLOYEE MANAGEMENT
-- =============================================

-- Employees
CREATE TABLE Employees (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(36) NOT NULL UNIQUE,
    EmployeeId NVARCHAR(50) NOT NULL UNIQUE,
    CompanyId NVARCHAR(36) NOT NULL,
    DepartmentId NVARCHAR(36) NOT NULL,
    PositionId NVARCHAR(36) NOT NULL,
    ManagerId NVARCHAR(36) NULL,
    HireDate DATE NOT NULL,
    TerminationDate DATE NULL,
    EmploymentType NVARCHAR(50) NOT NULL, -- Full-time, Part-time, Contract, Intern
    WorkLocation NVARCHAR(100),
    Salary DECIMAL(18,2),
    Currency NVARCHAR(10) DEFAULT 'USD',
    PayFrequency NVARCHAR(20), -- Monthly, Bi-weekly, Weekly
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active', -- Active, Inactive, On Leave, Terminated
    ProbationEndDate DATE NULL,
    ContractEndDate DATE NULL,
    Skills NVARCHAR(MAX), -- JSON array of skills
    Certifications NVARCHAR(MAX), -- JSON array of certifications
    EmergencyContactName NVARCHAR(100),
    EmergencyContactRelationship NVARCHAR(50),
    EmergencyContactPhone NVARCHAR(20),
    EmergencyContactEmail NVARCHAR(100),
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (DepartmentId) REFERENCES Departments(Id),
    FOREIGN KEY (PositionId) REFERENCES Positions(Id),
    FOREIGN KEY (ManagerId) REFERENCES Employees(Id),
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- Employee Documents
CREATE TABLE EmployeeDocuments (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    EmployeeId NVARCHAR(36) NOT NULL,
    DocumentType NVARCHAR(50) NOT NULL, -- Contract, ID, Passport, Certificate, etc.
    DocumentName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    FileSize BIGINT NOT NULL,
    MimeType NVARCHAR(100) NOT NULL,
    ExpiryDate DATE NULL,
    IsConfidential BIT NOT NULL DEFAULT 0,
    UploadedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UploadedById NVARCHAR(36) NOT NULL,
    FOREIGN KEY (EmployeeId) REFERENCES Employees(Id) ON DELETE CASCADE,
    FOREIGN KEY (UploadedById) REFERENCES Users(Id)
);

-- =============================================
-- RECRUITMENT MANAGEMENT
-- =============================================

-- Job Postings
CREATE TABLE JobPostings (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    CompanyId NVARCHAR(36) NOT NULL,
    DepartmentId NVARCHAR(36) NOT NULL,
    PositionId NVARCHAR(36) NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Requirements NVARCHAR(MAX),
    Benefits NVARCHAR(MAX),
    SalaryMin DECIMAL(18,2),
    SalaryMax DECIMAL(18,2),
    Currency NVARCHAR(10) DEFAULT 'USD',
    Location NVARCHAR(100),
    WorkType NVARCHAR(50), -- Remote, On-site, Hybrid
    EmploymentType NVARCHAR(50), -- Full-time, Part-time, Contract
    ExperienceLevel NVARCHAR(50), -- Entry, Mid, Senior, Executive
    Status NVARCHAR(50) NOT NULL DEFAULT 'Draft', -- Draft, Published, Paused, Closed
    PublishedAt DATETIME2 NULL,
    ClosedAt DATETIME2 NULL,
    ApplicationDeadline DATETIME2 NULL,
    ExpectedStartDate DATE NULL,
    NumberOfPositions INT DEFAULT 1,
    Priority NVARCHAR(20) DEFAULT 'Medium', -- Low, Medium, High, Urgent
    InternalPosting BIT NOT NULL DEFAULT 0,
    ExternalPosting BIT NOT NULL DEFAULT 1,
    PostingChannels NVARCHAR(MAX), -- JSON array of posting channels
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NOT NULL,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (DepartmentId) REFERENCES Departments(Id),
    FOREIGN KEY (PositionId) REFERENCES Positions(Id),
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- Candidates
CREATE TABLE Candidates (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20),
    LinkedInProfile NVARCHAR(255),
    GitHubProfile NVARCHAR(255),
    PortfolioUrl NVARCHAR(255),
    CurrentPosition NVARCHAR(100),
    CurrentCompany NVARCHAR(100),
    Location NVARCHAR(100),
    Nationality NVARCHAR(50),
    WorkAuthorization NVARCHAR(100),
    ExpectedSalary DECIMAL(18,2),
    Currency NVARCHAR(10) DEFAULT 'USD',
    NoticePeriod NVARCHAR(50),
    AvailabilityDate DATE,
    YearsOfExperience INT,
    Skills NVARCHAR(MAX), -- JSON array of skills
    Education NVARCHAR(MAX), -- JSON array of education
    WorkExperience NVARCHAR(MAX), -- JSON array of work experience
    Languages NVARCHAR(MAX), -- JSON array of languages
    Certifications NVARCHAR(MAX), -- JSON array of certifications
    Source NVARCHAR(100), -- LinkedIn, Indeed, Referral, etc.
    SourceDetails NVARCHAR(255),
    Rating DECIMAL(3,2), -- 0.00 to 5.00
    Status NVARCHAR(50) NOT NULL DEFAULT 'New', -- New, Screening, Interview, Offer, Hired, Rejected, Withdrawn
    Notes NVARCHAR(MAX),
    IsBlacklisted BIT NOT NULL DEFAULT 0,
    BlacklistReason NVARCHAR(255),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- CV/Resume Files
CREATE TABLE CandidateDocuments (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    CandidateId NVARCHAR(36) NOT NULL,
    DocumentType NVARCHAR(50) NOT NULL, -- CV, Cover Letter, Portfolio, Certificate
    FileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    FileSize BIGINT NOT NULL,
    MimeType NVARCHAR(100) NOT NULL,
    ParsedData NVARCHAR(MAX), -- JSON of parsed CV data
    UploadedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UploadedById NVARCHAR(36) NULL,
    FOREIGN KEY (CandidateId) REFERENCES Candidates(Id) ON DELETE CASCADE,
    FOREIGN KEY (UploadedById) REFERENCES Users(Id)
);

-- Job Applications
CREATE TABLE JobApplications (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    JobPostingId NVARCHAR(36) NOT NULL,
    CandidateId NVARCHAR(36) NOT NULL,
    ApplicationSource NVARCHAR(100), -- Website, LinkedIn, Email, etc.
    CoverLetter NVARCHAR(MAX),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Applied', -- Applied, Screening, Interview, Offer, Hired, Rejected, Withdrawn
    Stage NVARCHAR(50), -- Application Review, Phone Screen, Technical Interview, etc.
    Rating DECIMAL(3,2), -- 0.00 to 5.00
    Feedback NVARCHAR(MAX),
    RejectionReason NVARCHAR(255),
    AppliedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    ReviewedAt DATETIME2 NULL,
    ReviewedById NVARCHAR(36) NULL,
    FOREIGN KEY (JobPostingId) REFERENCES JobPostings(Id) ON DELETE CASCADE,
    FOREIGN KEY (CandidateId) REFERENCES Candidates(Id) ON DELETE CASCADE,
    FOREIGN KEY (ReviewedById) REFERENCES Users(Id)
);

-- =============================================
-- INTERVIEW MANAGEMENT
-- =============================================

-- Interview Rounds Configuration
CREATE TABLE InterviewRounds (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    JobPostingId NVARCHAR(36) NOT NULL,
    RoundNumber INT NOT NULL,
    RoundName NVARCHAR(100) NOT NULL,
    RoundType NVARCHAR(50) NOT NULL, -- Phone, Video, In-Person, Technical, HR, Panel
    Duration INT NOT NULL, -- Duration in minutes
    Description NVARCHAR(255),
    RequiredInterviewers INT DEFAULT 1,
    IsOptional BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NOT NULL,
    FOREIGN KEY (JobPostingId) REFERENCES JobPostings(Id) ON DELETE CASCADE,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- Interviews
CREATE TABLE Interviews (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    JobApplicationId NVARCHAR(36) NOT NULL,
    InterviewRoundId NVARCHAR(36) NULL,
    Title NVARCHAR(200) NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- Phone, Video, In-Person, Technical, HR, Panel
    ScheduledStartTime DATETIME2 NOT NULL,
    ScheduledEndTime DATETIME2 NOT NULL,
    ActualStartTime DATETIME2 NULL,
    ActualEndTime DATETIME2 NULL,
    TimeZone NVARCHAR(50) NOT NULL DEFAULT 'UTC',
    Location NVARCHAR(255),
    MeetingLink NVARCHAR(500),
    MeetingId NVARCHAR(100),
    MeetingPassword NVARCHAR(100),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Scheduled', -- Scheduled, Confirmed, In Progress, Completed, Cancelled, No Show
    CancellationReason NVARCHAR(255),
    Instructions NVARCHAR(MAX),
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    ScheduledById NVARCHAR(36) NOT NULL,
    FOREIGN KEY (JobApplicationId) REFERENCES JobApplications(Id) ON DELETE CASCADE,
    FOREIGN KEY (InterviewRoundId) REFERENCES InterviewRounds(Id),
    FOREIGN KEY (ScheduledById) REFERENCES Users(Id)
);

-- Interview Participants
CREATE TABLE InterviewParticipants (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    InterviewId NVARCHAR(36) NOT NULL,
    UserId NVARCHAR(36) NOT NULL,
    Role NVARCHAR(50) NOT NULL, -- Interviewer, Observer, Coordinator
    IsRequired BIT NOT NULL DEFAULT 1,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Accepted, Declined, Tentative
    ResponseAt DATETIME2 NULL,
    JoinedAt DATETIME2 NULL,
    LeftAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (InterviewId) REFERENCES Interviews(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Interview Feedback
CREATE TABLE InterviewFeedback (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    InterviewId NVARCHAR(36) NOT NULL,
    InterviewerId NVARCHAR(36) NOT NULL,
    OverallRating DECIMAL(3,2) NOT NULL, -- 0.00 to 5.00
    TechnicalSkills DECIMAL(3,2),
    CommunicationSkills DECIMAL(3,2),
    ProblemSolving DECIMAL(3,2),
    CulturalFit DECIMAL(3,2),
    Leadership DECIMAL(3,2),
    Recommendation NVARCHAR(50) NOT NULL, -- Hire, No Hire, Maybe, Strong Hire
    Strengths NVARCHAR(MAX),
    Weaknesses NVARCHAR(MAX),
    Comments NVARCHAR(MAX),
    IsSubmitted BIT NOT NULL DEFAULT 0,
    SubmittedAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (InterviewId) REFERENCES Interviews(Id) ON DELETE CASCADE,
    FOREIGN KEY (InterviewerId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- =============================================
-- CALENDAR AND SCHEDULING
-- =============================================

-- Calendar Events
CREATE TABLE CalendarEvents (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    StartTime DATETIME2 NOT NULL,
    EndTime DATETIME2 NOT NULL,
    TimeZone NVARCHAR(50) NOT NULL DEFAULT 'UTC',
    IsAllDay BIT NOT NULL DEFAULT 0,
    Location NVARCHAR(255),
    MeetingLink NVARCHAR(500),
    EventType NVARCHAR(50) NOT NULL, -- Interview, Meeting, Deadline, Holiday, Training, Review
    Status NVARCHAR(50) NOT NULL DEFAULT 'Scheduled', -- Scheduled, Confirmed, Cancelled, Completed
    Priority NVARCHAR(20) NOT NULL DEFAULT 'Medium', -- Low, Medium, High, Urgent
    Visibility NVARCHAR(20) NOT NULL DEFAULT 'Public', -- Public, Private, Confidential
    RelatedEntityType NVARCHAR(50), -- Interview, Candidate, Employee, JobPosting
    RelatedEntityId NVARCHAR(36),
    RecurrenceRule NVARCHAR(255), -- RRULE format for recurring events
    RecurrenceException NVARCHAR(MAX), -- JSON array of exception dates
    Reminders NVARCHAR(MAX), -- JSON array of reminder settings
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NOT NULL,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- Calendar Event Attendees
CREATE TABLE CalendarEventAttendees (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    EventId NVARCHAR(36) NOT NULL,
    UserId NVARCHAR(36) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'Attendee', -- Organizer, Attendee, Optional
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Accepted, Declined, Tentative
    ResponseAt DATETIME2 NULL,
    ResponseMessage NVARCHAR(255),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (EventId) REFERENCES CalendarEvents(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- =============================================
-- SYSTEM CONFIGURATION
-- =============================================

-- System Settings
CREATE TABLE SystemSettings (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    Category NVARCHAR(50) NOT NULL,
    [Key] NVARCHAR(100) NOT NULL,
    Value NVARCHAR(MAX),
    DataType NVARCHAR(20) NOT NULL, -- String, Integer, Boolean, JSON
    Description NVARCHAR(255),
    IsEncrypted BIT NOT NULL DEFAULT 0,
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedById NVARCHAR(36) NOT NULL,
    UNIQUE(Category, [Key]),
    FOREIGN KEY (UpdatedById) REFERENCES Users(Id)
);

-- Audit Logs
CREATE TABLE AuditLogs (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(36) NULL,
    Action NVARCHAR(50) NOT NULL,
    EntityType NVARCHAR(50) NOT NULL,
    EntityId NVARCHAR(36) NULL,
    OldValues NVARCHAR(MAX) NULL,
    NewValues NVARCHAR(MAX) NULL,
    IpAddress NVARCHAR(50) NULL,
    UserAgent NVARCHAR(500) NULL,
    SessionId NVARCHAR(100) NULL,
    Timestamp DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Notifications
CREATE TABLE Notifications (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(36) NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- Info, Warning, Error, Success
    Category NVARCHAR(50), -- Interview, Application, System, etc.
    RelatedEntityType NVARCHAR(50),
    RelatedEntityId NVARCHAR(36),
    IsRead BIT NOT NULL DEFAULT 0,
    ReadAt DATETIME2 NULL,
    ActionUrl NVARCHAR(500),
    ExpiresAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- File Storage
CREATE TABLE FileStorage (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    FileName NVARCHAR(255) NOT NULL,
    OriginalFileName NVARCHAR(255) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    FileSize BIGINT NOT NULL,
    MimeType NVARCHAR(100) NOT NULL,
    FileHash NVARCHAR(64), -- SHA-256 hash for duplicate detection
    RelatedEntityType NVARCHAR(50),
    RelatedEntityId NVARCHAR(36),
    UploadedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UploadedById NVARCHAR(36) NOT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedAt DATETIME2 NULL,
    FOREIGN KEY (UploadedById) REFERENCES Users(Id)
);

-- Tags System
CREATE TABLE Tags (
    Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Color NVARCHAR(20) DEFAULT '#6B7280',
    Description NVARCHAR(255),
    Category NVARCHAR(50), -- Skill, Department, Priority, etc.
    IsSystem BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NOT NULL,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- Entity Tags (Many-to-Many for tagging any entity)
CREATE TABLE EntityTags (
    EntityType NVARCHAR(50) NOT NULL, -- Candidate, Employee, JobPosting, etc.
    EntityId NVARCHAR(36) NOT NULL,
    TagId NVARCHAR(36) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NOT NULL,
    PRIMARY KEY (EntityType, EntityId, TagId),
    FOREIGN KEY (TagId) REFERENCES Tags(Id) ON DELETE CASCADE,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_Username ON Users(Username);
CREATE INDEX IX_Users_IsActive ON Users(IsActive);

-- Employees
CREATE INDEX IX_Employees_EmployeeId ON Employees(EmployeeId);
CREATE INDEX IX_Employees_CompanyId ON Employees(CompanyId);
CREATE INDEX IX_Employees_DepartmentId ON Employees(DepartmentId);
CREATE INDEX IX_Employees_Status ON Employees(Status);

-- Candidates
CREATE INDEX IX_Candidates_Email ON Candidates(Email);
CREATE INDEX IX_Candidates_Status ON Candidates(Status);
CREATE INDEX IX_Candidates_CreatedAt ON Candidates(CreatedAt);

-- Job Applications
CREATE INDEX IX_JobApplications_JobPostingId ON JobApplications(JobPostingId);
CREATE INDEX IX_JobApplications_CandidateId ON JobApplications(CandidateId);
CREATE INDEX IX_JobApplications_Status ON JobApplications(Status);

-- Interviews
CREATE INDEX IX_Interviews_JobApplicationId ON Interviews(JobApplicationId);
CREATE INDEX IX_Interviews_ScheduledStartTime ON Interviews(ScheduledStartTime);
CREATE INDEX IX_Interviews_Status ON Interviews(Status);

-- Calendar Events
CREATE INDEX IX_CalendarEvents_StartTime ON CalendarEvents(StartTime);
CREATE INDEX IX_CalendarEvents_EndTime ON CalendarEvents(EndTime);
CREATE INDEX IX_CalendarEvents_EventType ON CalendarEvents(EventType);
CREATE INDEX IX_CalendarEvents_CreatedById ON CalendarEvents(CreatedById);

-- Audit Logs
CREATE INDEX IX_AuditLogs_UserId ON AuditLogs(UserId);
CREATE INDEX IX_AuditLogs_Timestamp ON AuditLogs(Timestamp);
CREATE INDEX IX_AuditLogs_EntityType_EntityId ON AuditLogs(EntityType, EntityId);
