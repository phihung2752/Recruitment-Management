-- Users Table
CREATE TABLE Users (
    Id NVARCHAR(36) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Salt NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL,
    Department NVARCHAR(50),
    Status NVARCHAR(20) NOT NULL DEFAULT 'active',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    LastLoginAt DATETIME2 NULL
);

-- Roles Table
CREATE TABLE Roles (
    Id NVARCHAR(36) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Permissions Table
CREATE TABLE Permissions (
    Id NVARCHAR(36) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    Module NVARCHAR(50) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Role Permissions (Many-to-Many)
CREATE TABLE RolePermissions (
    RoleId NVARCHAR(36) NOT NULL,
    PermissionId NVARCHAR(36) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (RoleId, PermissionId),
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    FOREIGN KEY (PermissionId) REFERENCES Permissions(Id) ON DELETE CASCADE
);

-- User Permissions (Many-to-Many for custom permissions)
CREATE TABLE UserPermissions (
    UserId NVARCHAR(36) NOT NULL,
    PermissionId NVARCHAR(36) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (UserId, PermissionId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (PermissionId) REFERENCES Permissions(Id) ON DELETE CASCADE
);

-- Departments Table
CREATE TABLE Departments (
    Id NVARCHAR(36) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    ManagerId NVARCHAR(36) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (ManagerId) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Refresh Tokens Table
CREATE TABLE RefreshTokens (
    Id NVARCHAR(36) PRIMARY KEY,
    UserId NVARCHAR(36) NOT NULL,
    Token NVARCHAR(255) NOT NULL UNIQUE,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    RevokedAt DATETIME2 NULL,
    ReplacedByToken NVARCHAR(255) NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Audit Logs Table
CREATE TABLE AuditLogs (
    Id NVARCHAR(36) PRIMARY KEY,
    UserId NVARCHAR(36) NULL,
    Action NVARCHAR(50) NOT NULL,
    EntityType NVARCHAR(50) NOT NULL,
    EntityId NVARCHAR(36) NULL,
    OldValues NVARCHAR(MAX) NULL,
    NewValues NVARCHAR(MAX) NULL,
    IpAddress NVARCHAR(50) NULL,
    UserAgent NVARCHAR(255) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Candidates Table
CREATE TABLE Candidates (
    Id NVARCHAR(36) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20) NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'new',
    Source NVARCHAR(50) NULL,
    Rating INT NULL,
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id) ON DELETE SET NULL
);

-- CVs Table
CREATE TABLE CVs (
    Id NVARCHAR(36) PRIMARY KEY,
    CandidateId NVARCHAR(36) NOT NULL,
    FilePath NVARCHAR(255) NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    FileType NVARCHAR(50) NOT NULL,
    FileSize INT NOT NULL,
    ParsedData NVARCHAR(MAX) NULL,
    UploadedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UploadedById NVARCHAR(36) NULL,
    FOREIGN KEY (CandidateId) REFERENCES Candidates(Id) ON DELETE CASCADE,
    FOREIGN KEY (UploadedById) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Jobs Table
CREATE TABLE Jobs (
    Id NVARCHAR(36) PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Department NVARCHAR(50) NOT NULL,
    Location NVARCHAR(100) NULL,
    Type NVARCHAR(50) NOT NULL, -- Full-time, Part-time, Contract, etc.
    Status NVARCHAR(50) NOT NULL DEFAULT 'draft',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    PublishedAt DATETIME2 NULL,
    ClosedAt DATETIME2 NULL,
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Job Applications Table
CREATE TABLE JobApplications (
    Id NVARCHAR(36) PRIMARY KEY,
    JobId NVARCHAR(36) NOT NULL,
    CandidateId NVARCHAR(36) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'applied',
    AppliedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    Notes NVARCHAR(MAX) NULL,
    FOREIGN KEY (JobId) REFERENCES Jobs(Id) ON DELETE CASCADE,
    FOREIGN KEY (CandidateId) REFERENCES Candidates(Id) ON DELETE CASCADE
);

-- Interviews Table
CREATE TABLE Interviews (
    Id NVARCHAR(36) PRIMARY KEY,
    JobApplicationId NVARCHAR(36) NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- Phone, Video, In-person, etc.
    ScheduledStart DATETIME2 NOT NULL,
    ScheduledEnd DATETIME2 NOT NULL,
    ActualStart DATETIME2 NULL,
    ActualEnd DATETIME2 NULL,
    Location NVARCHAR(255) NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'scheduled',
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    ScheduledById NVARCHAR(36) NULL,
    FOREIGN KEY (JobApplicationId) REFERENCES JobApplications(Id) ON DELETE CASCADE,
    FOREIGN KEY (ScheduledById) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Interview Participants Table
CREATE TABLE InterviewParticipants (
    InterviewId NVARCHAR(36) NOT NULL,
    UserId NVARCHAR(36) NOT NULL,
    Role NVARCHAR(50) NOT NULL, -- Interviewer, Observer, etc.
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (InterviewId, UserId),
    FOREIGN KEY (InterviewId) REFERENCES Interviews(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Interview Feedback Table
CREATE TABLE InterviewFeedback (
    Id NVARCHAR(36) PRIMARY KEY,
    InterviewId NVARCHAR(36) NOT NULL,
    UserId NVARCHAR(36) NOT NULL,
    Rating INT NOT NULL,
    Comments NVARCHAR(MAX) NULL,
    Recommendation NVARCHAR(50) NOT NULL, -- Hire, Reject, Consider
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (InterviewId) REFERENCES Interviews(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Tags Table
CREATE TABLE Tags (
    Id NVARCHAR(36) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Color NVARCHAR(20) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Candidate Tags (Many-to-Many)
CREATE TABLE CandidateTags (
    CandidateId NVARCHAR(36) NOT NULL,
    TagId NVARCHAR(36) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NULL,
    PRIMARY KEY (CandidateId, TagId),
    FOREIGN KEY (CandidateId) REFERENCES Candidates(Id) ON DELETE CASCADE,
    FOREIGN KEY (TagId) REFERENCES Tags(Id) ON DELETE CASCADE,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Communication Logs Table
CREATE TABLE CommunicationLogs (
    Id NVARCHAR(36) PRIMARY KEY,
    CandidateId NVARCHAR(36) NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- Email, Phone, SMS, etc.
    Direction NVARCHAR(20) NOT NULL, -- Inbound, Outbound
    Subject NVARCHAR(255) NULL,
    Content NVARCHAR(MAX) NULL,
    Status NVARCHAR(50) NOT NULL, -- Sent, Delivered, Failed, etc.
    SentAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    SentById NVARCHAR(36) NULL,
    FOREIGN KEY (CandidateId) REFERENCES Candidates(Id) ON DELETE CASCADE,
    FOREIGN KEY (SentById) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Email Templates Table
CREATE TABLE EmailTemplates (
    Id NVARCHAR(36) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Subject NVARCHAR(255) NOT NULL,
    Body NVARCHAR(MAX) NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- Interview Invitation, Rejection, etc.
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Calendar Events Table
CREATE TABLE CalendarEvents (
    Id NVARCHAR(36) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    StartTime DATETIME2 NOT NULL,
    EndTime DATETIME2 NOT NULL,
    Location NVARCHAR(255) NULL,
    Type NVARCHAR(50) NOT NULL, -- Interview, Meeting, etc.
    Status NVARCHAR(50) NOT NULL DEFAULT 'scheduled',
    RelatedEntityType NVARCHAR(50) NULL, -- Interview, Candidate, etc.
    RelatedEntityId NVARCHAR(36) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedById NVARCHAR(36) NULL,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id) ON DELETE SET NULL
);

-- Calendar Event Attendees Table
CREATE TABLE CalendarEventAttendees (
    EventId NVARCHAR(36) NOT NULL,
    UserId NVARCHAR(36) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'pending', -- Accepted, Declined, Tentative, Pending
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (EventId, UserId),
    FOREIGN KEY (EventId) REFERENCES CalendarEvents(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Seed Data for Roles
INSERT INTO Roles (Id, Name, Description)
VALUES 
    (NEWID(), 'admin', 'System Administrator with full access'),
    (NEWID(), 'hr_manager', 'HR Manager with access to all HR functions'),
    (NEWID(), 'recruiter', 'Recruiter with access to recruitment functions'),
    (NEWID(), 'department_manager', 'Department Manager with limited HR access'),
    (NEWID(), 'interviewer', 'Staff member who conducts interviews'),
    (NEWID(), 'employee', 'Regular employee with minimal access');

-- Seed Data for Permissions
INSERT INTO Permissions (Id, Name, Description, Module)
VALUES
    -- User Management
    (NEWID(), 'user_view', 'View user details', 'user_management'),
    (NEWID(), 'user_create', 'Create new users', 'user_management'),
    (NEWID(), 'user_edit', 'Edit user details', 'user_management'),
    (NEWID(), 'user_delete', 'Delete users', 'user_management'),
    
    -- Recruitment
    (NEWID(), 'job_view', 'View job postings', 'recruitment'),
    (NEWID(), 'job_create', 'Create job postings', 'recruitment'),
    (NEWID(), 'job_edit', 'Edit job postings', 'recruitment'),
    (NEWID(), 'job_delete', 'Delete job postings', 'recruitment'),
    
    -- Candidates
    (NEWID(), 'candidate_view', 'View candidates', 'candidates'),
    (NEWID(), 'candidate_create', 'Create candidates', 'candidates'),
    (NEWID(), 'candidate_edit', 'Edit candidates', 'candidates'),
    (NEWID(), 'candidate_delete', 'Delete candidates', 'candidates'),
    
    -- Interviews
    (NEWID(), 'interview_view', 'View interviews', 'interviews'),
    (NEWID(), 'interview_schedule', 'Schedule interviews', 'interviews'),
    (NEWID(), 'interview_feedback', 'Provide interview feedback', 'interviews'),
    
    -- CV Management
    (NEWID(), 'cv_view', 'View CVs', 'cv_management'),
    (NEWID(), 'cv_upload', 'Upload CVs', 'cv_management'),
    (NEWID(), 'cv_parse', 'Parse CV data', 'cv_management'),
    
    -- Analytics
    (NEWID(), 'analytics_view', 'View analytics', 'analytics'),
    (NEWID(), 'analytics_export', 'Export analytics data', 'analytics'),
    
    -- Settings
    (NEWID(), 'settings_view', 'View system settings', 'settings'),
    (NEWID(), 'settings_edit', 'Edit system settings', 'settings');

-- Create Admin User (Password: Admin@123)
INSERT INTO Users (Id, Name, Email, PasswordHash, Salt, Role, Status)
VALUES (
    NEWID(),
    'System Admin',
    'admin@example.com',
    -- In a real system, properly hash the password with salt
    'AQAAAAIAAYagAAAAELTUqpep1pOsWvkUjgXUTiZPiVhGRwHmHSIVxLOwiOxBzqKc5qRqiQpD0+5Q5TPBAQ==',
    'randomsalt123',
    'admin',
    'active'
);
