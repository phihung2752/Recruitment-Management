-- HR Management System Database Schema for MySQL
-- Created: 2024-01-15

USE hr_management_system;

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS InterviewEvaluations;
DROP TABLE IF EXISTS InterviewRounds;
DROP TABLE IF EXISTS CalendarEvents;
DROP TABLE IF EXISTS JobPostings;
DROP TABLE IF EXISTS Candidates;
DROP TABLE IF EXISTS RolePermissions;
DROP TABLE IF EXISTS UserRoles;
DROP TABLE IF EXISTS Permissions;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Users;

-- Users table
CREATE TABLE Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE Roles (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL UNIQUE,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table
CREATE TABLE Permissions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PermissionName VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UserRoles table (many-to-many relationship)
CREATE TABLE UserRoles (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    AssignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (UserId, RoleId)
);

-- RolePermissions table (many-to-many relationship)
CREATE TABLE RolePermissions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    RoleId INT NOT NULL,
    PermissionId INT NOT NULL,
    AssignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    FOREIGN KEY (PermissionId) REFERENCES Permissions(Id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (RoleId, PermissionId)
);

-- Candidates table
CREATE TABLE Candidates (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    Position VARCHAR(100),
    Department VARCHAR(50),
    Experience INT DEFAULT 0,
    Education VARCHAR(100),
    Skills TEXT,
    ResumeUrl VARCHAR(500),
    Status ENUM('New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected') DEFAULT 'New',
    AppliedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Source VARCHAR(50),
    Notes TEXT,
    Rating DECIMAL(3,2) DEFAULT 0.00,
    ExpectedSalary DECIMAL(15,2),
    AvailableStartDate DATE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- InterviewRounds table
CREATE TABLE InterviewRounds (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CandidateId INT NOT NULL,
    RoundNumber INT NOT NULL,
    RoundName VARCHAR(100) NOT NULL,
    Status ENUM('Pending', 'Scheduled', 'Completed', 'Passed', 'Failed', 'Cancelled') DEFAULT 'Pending',
    Interviewer VARCHAR(100),
    InterviewerEmail VARCHAR(100),
    ScheduledDate DATETIME,
    Notes TEXT,
    Score DECIMAL(3,2),
    Feedback TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CandidateId) REFERENCES Candidates(Id) ON DELETE CASCADE
);

-- InterviewEvaluations table
CREATE TABLE InterviewEvaluations (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    InterviewRoundId INT NOT NULL,
    TechnicalSkills INT NOT NULL CHECK (TechnicalSkills >= 1 AND TechnicalSkills <= 5),
    Communication INT NOT NULL CHECK (Communication >= 1 AND Communication <= 5),
    ProblemSolving INT NOT NULL CHECK (ProblemSolving >= 1 AND ProblemSolving <= 5),
    CulturalFit INT NOT NULL CHECK (CulturalFit >= 1 AND CulturalFit <= 5),
    OverallRating INT NOT NULL CHECK (OverallRating >= 1 AND OverallRating <= 5),
    Strengths TEXT,
    AreasForImprovement TEXT,
    AdditionalComments TEXT,
    Recommendation ENUM('Strong Hire', 'Hire', 'Maybe', 'Not a Fit', 'Strong No Hire') NOT NULL,
    EvaluatedBy VARCHAR(100) NOT NULL,
    EvaluatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (InterviewRoundId) REFERENCES InterviewRounds(Id) ON DELETE CASCADE
);

-- JobPostings table
CREATE TABLE JobPostings (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Department VARCHAR(50) NOT NULL,
    Location VARCHAR(100),
    EmploymentType ENUM('Full-time', 'Part-time', 'Contract', 'Intern') DEFAULT 'Full-time',
    ExperienceLevel ENUM('Entry', 'Mid', 'Senior', 'Lead', 'Executive') DEFAULT 'Mid',
    SalaryMin DECIMAL(15,2),
    SalaryMax DECIMAL(15,2),
    Description TEXT NOT NULL,
    Requirements TEXT,
    Benefits TEXT,
    Status ENUM('Draft', 'Published', 'Paused', 'Closed') DEFAULT 'Draft',
    Priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    ApplicationDeadline DATE,
    CreatedBy INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id) ON DELETE CASCADE
);

-- CalendarEvents table
CREATE TABLE CalendarEvents (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    EventType ENUM('Interview', 'Meeting', 'Deadline', 'Onboarding', 'Training', 'Other') NOT NULL,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    Location VARCHAR(200),
    Attendees TEXT,
    CandidateId INT,
    InterviewRoundId INT,
    Status ENUM('Scheduled', 'Completed', 'Cancelled', 'Rescheduled') DEFAULT 'Scheduled',
    Priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    CreatedBy INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CandidateId) REFERENCES Candidates(Id) ON DELETE SET NULL,
    FOREIGN KEY (InterviewRoundId) REFERENCES InterviewRounds(Id) ON DELETE SET NULL,
    FOREIGN KEY (CreatedBy) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Insert default roles
INSERT INTO Roles (RoleName, Description) VALUES
('Admin', 'Full system access'),
('HR', 'Human Resources management'),
('Manager', 'Team management and hiring'),
('Employee', 'Basic employee access'),
('Interviewer', 'Interview conducting access');

-- Insert default permissions
INSERT INTO Permissions (PermissionName, Description) VALUES
('users.view', 'View users'),
('users.create', 'Create users'),
('users.edit', 'Edit users'),
('users.delete', 'Delete users'),
('candidates.view', 'View candidates'),
('candidates.create', 'Create candidates'),
('candidates.edit', 'Edit candidates'),
('candidates.delete', 'Delete candidates'),
('interviews.view', 'View interviews'),
('interviews.edit', 'Edit interviews'),
('interviews.schedule', 'Schedule interviews'),
('jobs.view', 'View job postings'),
('jobs.create', 'Create job postings'),
('jobs.edit', 'Edit job postings'),
('jobs.delete', 'Delete job postings'),
('reports.view', 'View reports'),
('calendar.view', 'View calendar'),
('calendar.edit', 'Edit calendar'),
('notifications.view', 'View notifications'),
('notifications.send', 'Send notifications'),
('help.view', 'View help'),
('system.settings', 'System settings');

-- Assign permissions to roles
-- Admin gets all permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 1, Id FROM Permissions;

-- HR permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 2, Id FROM Permissions 
WHERE PermissionName IN ('candidates.view', 'candidates.create', 'candidates.edit', 'candidates.delete',
                        'interviews.view', 'interviews.edit', 'interviews.schedule',
                        'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.delete',
                        'reports.view', 'calendar.view', 'calendar.edit',
                        'notifications.view', 'notifications.send', 'help.view');

-- Manager permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 3, Id FROM Permissions 
WHERE PermissionName IN ('candidates.view', 'interviews.view', 'interviews.edit', 'interviews.schedule',
                        'jobs.view', 'reports.view', 'calendar.view', 'notifications.view', 'help.view');

-- Employee permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 4, Id FROM Permissions 
WHERE PermissionName IN ('calendar.view', 'notifications.view', 'help.view');

-- Interviewer permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 5, Id FROM Permissions 
WHERE PermissionName IN ('candidates.view', 'interviews.view', 'interviews.edit', 'interviews.schedule',
                        'calendar.view', 'notifications.view', 'help.view');

-- Create default admin user
INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, Status) VALUES
('admin', 'admin@company.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9yQK.2K', 'Admin', 'User', 'Active');

-- Assign admin role to admin user
INSERT INTO UserRoles (UserId, RoleId) VALUES (1, 1);

-- Insert sample data
INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, Status) VALUES
('hr_manager', 'hr@company.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9yQK.2K', 'HR', 'Manager', 'Active'),
('tech_lead', 'tech.lead@company.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9yQK.2K', 'Tech', 'Lead', 'Active'),
('employee1', 'employee@company.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9yQK.2K', 'Employee', 'One', 'Active'),
('interviewer1', 'interviewer@company.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/9yQK.2K', 'Interviewer', 'One', 'Active');

-- Assign roles to users
INSERT INTO UserRoles (UserId, RoleId) VALUES
(2, 2), -- HR Manager
(3, 3), -- Tech Lead (Manager)
(4, 4), -- Employee
(5, 5); -- Interviewer

-- Insert sample candidates
INSERT INTO Candidates (FirstName, LastName, Email, Phone, Position, Department, Experience, Education, Skills, Status, Source, Rating, ExpectedSalary, AvailableStartDate) VALUES
('Nguyễn', 'Văn A', 'nguyen.van.a@email.com', '0901234567', 'Senior Frontend Developer', 'Engineering', 5, 'Bachelor in Computer Science', 'React, TypeScript, Node.js, MongoDB', 'Interview', 'VietnamWorks', 4.5, 25000000, '2024-02-01'),
('Trần', 'Thị B', 'tran.thi.b@email.com', '0901234568', 'UI/UX Designer', 'Design', 3, 'Bachelor in Design', 'Figma, Adobe Creative Suite, Sketch', 'Screening', 'TopCV', 4.2, 20000000, '2024-02-15'),
('Lê', 'Văn C', 'le.van.c@email.com', '0901234569', 'Backend Developer', 'Engineering', 4, 'Master in Software Engineering', 'Java, Spring Boot, PostgreSQL, Docker', 'New', 'LinkedIn', 4.0, 22000000, '2024-03-01'),
('Phạm', 'Thị D', 'pham.thi.d@email.com', '0901234570', 'Marketing Manager', 'Marketing', 6, 'MBA in Marketing', 'Digital Marketing, SEO, SEM, Analytics', 'Offer', 'Referral', 4.8, 30000000, '2024-01-20'),
('Hoàng', 'Văn E', 'hoang.van.e@email.com', '0901234571', 'Data Analyst', 'Analytics', 2, 'Bachelor in Statistics', 'Python, SQL, Tableau, Power BI', 'Interview', 'Website', 3.8, 18000000, '2024-02-10');

-- Insert sample interview rounds
INSERT INTO InterviewRounds (CandidateId, RoundNumber, RoundName, Status, Interviewer, InterviewerEmail, ScheduledDate, Notes, Score) VALUES
(1, 1, 'Phone Screening', 'Completed', 'HR Manager', 'hr@company.com', '2024-01-10 10:00:00', 'Good communication skills', 4.5),
(1, 2, 'Technical Interview', 'Scheduled', 'Tech Lead', 'tech.lead@company.com', '2024-01-20 14:00:00', 'Focus on React and TypeScript', NULL),
(2, 1, 'Portfolio Review', 'Completed', 'Design Lead', 'design@company.com', '2024-01-12 15:00:00', 'Strong design portfolio', 4.2),
(4, 1, 'HR Interview', 'Completed', 'HR Manager', 'hr@company.com', '2024-01-08 09:00:00', 'Excellent cultural fit', 4.8),
(4, 2, 'Final Interview', 'Completed', 'Marketing Director', 'marketing@company.com', '2024-01-15 16:00:00', 'Ready for offer', 4.9);

-- Insert sample job postings
INSERT INTO JobPostings (Title, Department, Location, EmploymentType, ExperienceLevel, SalaryMin, SalaryMax, Description, Requirements, Status, Priority, CreatedBy) VALUES
('Senior Frontend Developer', 'Engineering', 'Ho Chi Minh City', 'Full-time', 'Senior', 25000000, 35000000, 'We are looking for a Senior Frontend Developer...', '5+ years experience with React, TypeScript...', 'Published', 'High', 1),
('UI/UX Designer', 'Design', 'Ho Chi Minh City', 'Full-time', 'Mid', 15000000, 25000000, 'Join our design team...', '3+ years experience with Figma, Adobe Creative Suite...', 'Published', 'Medium', 1),
('Backend Developer', 'Engineering', 'Hanoi', 'Full-time', 'Mid', 20000000, 30000000, 'Backend developer position...', '4+ years experience with Java, Spring Boot...', 'Published', 'Medium', 1);

-- Insert sample calendar events
INSERT INTO CalendarEvents (Title, Description, EventType, StartTime, EndTime, Location, CandidateId, InterviewRoundId, Status, Priority, CreatedBy) VALUES
('Interview with Nguyễn Văn A', 'Technical Interview - React Developer', 'Interview', '2024-01-20 14:00:00', '2024-01-20 15:00:00', 'Meeting Room A', 1, 2, 'Scheduled', 'High', 1),
('Portfolio Review - Trần Thị B', 'Design Portfolio Review', 'Interview', '2024-01-12 15:00:00', '2024-01-12 16:00:00', 'Design Studio', 2, 3, 'Completed', 'Medium', 1),
('Final Interview - Phạm Thị D', 'Final Interview for Marketing Manager', 'Interview', '2024-01-15 16:00:00', '2024-01-15 17:00:00', 'Conference Room B', 4, 5, 'Completed', 'High', 1);

-- Insert sample interview evaluations
INSERT INTO InterviewEvaluations (InterviewRoundId, TechnicalSkills, Communication, ProblemSolving, CulturalFit, OverallRating, Strengths, AreasForImprovement, AdditionalComments, Recommendation, EvaluatedBy) VALUES
(1, 4, 5, 4, 5, 4, 'Strong technical background, excellent communication', 'Could improve on system design', 'Good candidate for next round', 'Hire', 'HR Manager'),
(3, 5, 4, 4, 5, 4, 'Excellent design skills, creative thinking', 'Needs more experience with enterprise projects', 'Ready for technical round', 'Hire', 'Design Lead'),
(4, 5, 5, 5, 5, 5, 'Outstanding in all areas', 'None', 'Perfect fit for the role', 'Strong Hire', 'HR Manager'),
(5, 5, 5, 5, 5, 5, 'Exceptional candidate', 'None', 'Immediate hire recommended', 'Strong Hire', 'Marketing Director');

-- Create CVAnalysis table
CREATE TABLE CVAnalysis (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    candidateName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(255),
    aiScore INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'new',
    source VARCHAR(100),
    sourceName VARCHAR(255),
    appliedDate DATE,
    skills JSON,
    experience VARCHAR(100),
    education VARCHAR(255),
    expectedSalary VARCHAR(100),
    tags JSON,
    isStarCandidate BOOLEAN DEFAULT FALSE,
    isReapplicant BOOLEAN DEFAULT FALSE,
    applicationCount INT DEFAULT 1,
    lastInterviewDate DATE,
    lastInterviewResult VARCHAR(50),
    notes TEXT,
    cvUrl VARCHAR(500),
    jobMatch INT DEFAULT 0,
    cvQuality INT DEFAULT 0,
    strengths JSON,
    weaknesses JSON,
    missingSkills JSON,
    redFlags JSON,
    recommendations JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Employees table
CREATE TABLE Employees (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(255),
    department VARCHAR(100),
    manager VARCHAR(255),
    hireDate DATE,
    salary DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'active',
    employeeType VARCHAR(50),
    workLocation VARCHAR(255),
    emergencyContact VARCHAR(255),
    emergencyPhone VARCHAR(20),
    address TEXT,
    skills JSON,
    certifications JSON,
    performance JSON,
    attendance JSON,
    benefits JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Show success message
SELECT 'Database schema created successfully!' as Status;


