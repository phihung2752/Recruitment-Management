-- SQL Server Database Schema for HR Management System
USE master;
GO

-- Create database if not exists
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'HRManagementDB')
BEGIN
    CREATE DATABASE HRManagementDB;
END
GO

USE HRManagementDB;
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50) NOT NULL UNIQUE,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        FirstName NVARCHAR(50) NOT NULL,
        LastName NVARCHAR(50) NOT NULL,
        Status NVARCHAR(20) DEFAULT 'Active',
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Create Roles table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Roles' AND xtype='U')
BEGIN
    CREATE TABLE Roles (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(255),
        CreatedAt DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Create Permissions table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Permissions' AND xtype='U')
BEGIN
    CREATE TABLE Permissions (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL UNIQUE,
        Description NVARCHAR(255),
        CreatedAt DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Create UserRoles table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserRoles' AND xtype='U')
BEGIN
    CREATE TABLE UserRoles (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        RoleId INT NOT NULL,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
        FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
        UNIQUE(UserId, RoleId)
    );
END
GO

-- Create RolePermissions table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RolePermissions' AND xtype='U')
BEGIN
    CREATE TABLE RolePermissions (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        RoleId INT NOT NULL,
        PermissionId INT NOT NULL,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
        FOREIGN KEY (PermissionId) REFERENCES Permissions(Id) ON DELETE CASCADE,
        UNIQUE(RoleId, PermissionId)
    );
END
GO

-- Create Candidates table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Candidates' AND xtype='U')
BEGIN
    CREATE TABLE Candidates (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FirstName NVARCHAR(50) NOT NULL,
        LastName NVARCHAR(50) NOT NULL,
        Email NVARCHAR(100) NOT NULL,
        Phone NVARCHAR(20),
        Position NVARCHAR(100),
        Experience NVARCHAR(20),
        Skills NVARCHAR(MAX),
        Status NVARCHAR(20) DEFAULT 'Applied',
        AppliedDate DATETIME2 DEFAULT GETDATE(),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Create InterviewRounds table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='InterviewRounds' AND xtype='U')
BEGIN
    CREATE TABLE InterviewRounds (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CandidateId INT NOT NULL,
        RoundNumber INT NOT NULL,
        RoundName NVARCHAR(100) NOT NULL,
        Interviewer NVARCHAR(100),
        ScheduledDate DATETIME2,
        Status NVARCHAR(20) DEFAULT 'Pending',
        Score INT,
        Notes NVARCHAR(MAX),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (CandidateId) REFERENCES Candidates(Id) ON DELETE CASCADE
    );
END
GO

-- Create JobPostings table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='JobPostings' AND xtype='U')
BEGIN
    CREATE TABLE JobPostings (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Department NVARCHAR(100),
        Location NVARCHAR(100),
        Type NVARCHAR(50),
        Description NVARCHAR(MAX),
        Requirements NVARCHAR(MAX),
        SalaryMin DECIMAL(10,2),
        SalaryMax DECIMAL(10,2),
        Status NVARCHAR(20) DEFAULT 'Draft',
        PostedDate DATETIME2 DEFAULT GETDATE(),
        ExpiryDate DATETIME2,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Create CalendarEvents table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CalendarEvents' AND xtype='U')
BEGIN
    CREATE TABLE CalendarEvents (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX),
        StartDate DATETIME2 NOT NULL,
        EndDate DATETIME2 NOT NULL,
        Type NVARCHAR(50) DEFAULT 'Interview',
        Location NVARCHAR(200),
        Attendees NVARCHAR(MAX),
        Status NVARCHAR(20) DEFAULT 'Scheduled',
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Create CVAnalysis table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CVAnalysis' AND xtype='U')
BEGIN
    CREATE TABLE CVAnalysis (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CandidateId INT NOT NULL,
        AIScore DECIMAL(5,2),
        JobMatch DECIMAL(5,2),
        Strengths NVARCHAR(MAX),
        Weaknesses NVARCHAR(MAX),
        Summary NVARCHAR(MAX),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (CandidateId) REFERENCES Candidates(Id) ON DELETE CASCADE
    );
END
GO

-- Create Employees table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Employees' AND xtype='U')
BEGIN
    CREATE TABLE Employees (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FirstName NVARCHAR(50) NOT NULL,
        LastName NVARCHAR(50) NOT NULL,
        Email NVARCHAR(100) NOT NULL UNIQUE,
        Phone NVARCHAR(20),
        Position NVARCHAR(100),
        Department NVARCHAR(100),
        Manager NVARCHAR(100),
        HireDate DATE,
        Salary DECIMAL(10,2),
        Status NVARCHAR(20) DEFAULT 'Active',
        EmployeeType NVARCHAR(20) DEFAULT 'Full-time',
        WorkLocation NVARCHAR(200),
        EmergencyContact NVARCHAR(100),
        EmergencyPhone NVARCHAR(20),
        Address NVARCHAR(MAX),
        Skills NVARCHAR(MAX),
        Certifications NVARCHAR(MAX),
        PerformanceRating DECIMAL(3,2),
        PerformanceLastReview DATE,
        PerformanceGoals NVARCHAR(MAX),
        AttendanceTotalDays INT DEFAULT 0,
        AttendancePresentDays INT DEFAULT 0,
        AttendanceAbsentDays INT DEFAULT 0,
        AttendanceLateDays INT DEFAULT 0,
        HealthInsurance BIT DEFAULT 0,
        DentalInsurance BIT DEFAULT 0,
        RetirementPlan BIT DEFAULT 0,
        PaidTimeOff INT DEFAULT 0,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Insert default admin user
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, Status)
    VALUES ('admin', 'admin@hrsystem.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'Active');
END
GO

-- Insert default roles
IF NOT EXISTS (SELECT * FROM Roles WHERE Name = 'Admin')
BEGIN
    INSERT INTO Roles (Name, Description) VALUES ('Admin', 'System Administrator');
END
GO

IF NOT EXISTS (SELECT * FROM Roles WHERE Name = 'HR')
BEGIN
    INSERT INTO Roles (Name, Description) VALUES ('HR', 'Human Resources Manager');
END
GO

IF NOT EXISTS (SELECT * FROM Roles WHERE Name = 'Recruiter')
BEGIN
    INSERT INTO Roles (Name, Description) VALUES ('Recruiter', 'Recruitment Specialist');
END
GO

-- Insert default permissions
DECLARE @PermissionNames TABLE (Name NVARCHAR(100), Description NVARCHAR(255))
INSERT INTO @PermissionNames VALUES 
('users.view', 'View users'),
('users.create', 'Create users'),
('users.edit', 'Edit users'),
('users.delete', 'Delete users'),
('candidates.view', 'View candidates'),
('candidates.create', 'Create candidates'),
('candidates.edit', 'Edit candidates'),
('candidates.delete', 'Delete candidates'),
('interviews.view', 'View interviews'),
('interviews.create', 'Create interviews'),
('interviews.edit', 'Edit interviews'),
('interviews.delete', 'Delete interviews'),
('jobs.view', 'View job postings'),
('jobs.create', 'Create job postings'),
('jobs.edit', 'Edit job postings'),
('jobs.delete', 'Delete job postings'),
('calendar.view', 'View calendar'),
('calendar.edit', 'Edit calendar'),
('reports.view', 'View reports'),
('system.settings', 'System settings')

INSERT INTO Permissions (Name, Description)
SELECT Name, Description FROM @PermissionNames
WHERE Name NOT IN (SELECT Name FROM Permissions)
GO

-- Assign admin role to admin user
DECLARE @AdminUserId INT = (SELECT Id FROM Users WHERE Username = 'admin')
DECLARE @AdminRoleId INT = (SELECT Id FROM Roles WHERE Name = 'Admin')

IF NOT EXISTS (SELECT * FROM UserRoles WHERE UserId = @AdminUserId AND RoleId = @AdminRoleId)
BEGIN
    INSERT INTO UserRoles (UserId, RoleId) VALUES (@AdminUserId, @AdminRoleId)
END
GO

-- Assign all permissions to admin role
DECLARE @AdminRoleId2 INT = (SELECT Id FROM Roles WHERE Name = 'Admin')

INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT @AdminRoleId2, Id FROM Permissions
WHERE Id NOT IN (SELECT PermissionId FROM RolePermissions WHERE RoleId = @AdminRoleId2)
GO

-- Insert sample data
INSERT INTO Candidates (FirstName, LastName, Email, Phone, Position, Experience, Skills, Status, AppliedDate)
VALUES 
('Nguyen', 'Van A', 'nguyenvana@email.com', '0123456789', 'Frontend Developer', '2-3 years', 'React, JavaScript, TypeScript', 'Applied', GETDATE()),
('Tran', 'Thi B', 'tranthib@email.com', '0987654321', 'Backend Developer', '3-4 years', 'Node.js, Python, SQL', 'Interviewed', GETDATE()),
('Le', 'Van C', 'levanc@email.com', '0369258147', 'Full Stack Developer', '4-5 years', 'React, Node.js, MongoDB', 'Hired', GETDATE())
GO

INSERT INTO JobPostings (Title, Department, Location, Type, Description, Requirements, SalaryMin, SalaryMax, Status, PostedDate, ExpiryDate)
VALUES 
('Senior Frontend Developer', 'Engineering', 'Ho Chi Minh City', 'Full-time', 'We are looking for a senior frontend developer...', '3+ years experience with React, TypeScript', 20000000, 35000000, 'Active', GETDATE(), DATEADD(month, 1, GETDATE())),
('Backend Developer', 'Engineering', 'Ha Noi', 'Full-time', 'Join our backend team...', '2+ years experience with Node.js, Python', 15000000, 25000000, 'Active', GETDATE(), DATEADD(month, 1, GETDATE()))
GO

INSERT INTO InterviewRounds (CandidateId, RoundNumber, RoundName, Interviewer, ScheduledDate, Status, Score, Notes)
VALUES 
(1, 1, 'Technical Interview', 'John Doe', DATEADD(day, 1, GETDATE()), 'Scheduled', NULL, NULL),
(2, 1, 'HR Interview', 'Jane Smith', DATEADD(day, 2, GETDATE()), 'Completed', 85, 'Good communication skills'),
(2, 2, 'Technical Interview', 'Mike Johnson', DATEADD(day, 3, GETDATE()), 'Completed', 90, 'Excellent technical knowledge')
GO

INSERT INTO CalendarEvents (Title, Description, StartDate, EndDate, Type, Location, Attendees, Status)
VALUES 
('Interview - Nguyen Van A', 'Technical interview for Frontend Developer position', DATEADD(day, 1, GETDATE()), DATEADD(hour, 1, DATEADD(day, 1, GETDATE())), 'Interview', 'Meeting Room A', 'John Doe, Nguyen Van A', 'Scheduled'),
('Team Meeting', 'Weekly team standup', DATEADD(day, 2, GETDATE()), DATEADD(hour, 1, DATEADD(day, 2, GETDATE())), 'Meeting', 'Conference Room', 'Development Team', 'Scheduled')
GO

INSERT INTO CVAnalysis (CandidateId, AIScore, JobMatch, Strengths, Weaknesses, Summary)
VALUES 
(1, 85.5, 78.0, 'Strong React skills, Good problem solving', 'Limited backend experience', 'Good candidate for frontend role'),
(2, 92.0, 88.5, 'Excellent technical skills, Good communication', 'Needs more leadership experience', 'Highly recommended for senior role')
GO

INSERT INTO Employees (FirstName, LastName, Email, Phone, Position, Department, Manager, HireDate, Salary, Status, EmployeeType, WorkLocation, Skills, PerformanceRating, AttendanceTotalDays, AttendancePresentDays, HealthInsurance, DentalInsurance, RetirementPlan, PaidTimeOff)
VALUES 
('Admin', 'User', 'admin@company.com', '0123456789', 'System Administrator', 'IT', 'CEO', '2023-01-01', 50000000, 'Active', 'Full-time', 'Ho Chi Minh City', 'System Administration, Database Management', 4.5, 250, 245, 1, 1, 1, 20),
('HR', 'Manager', 'hr@company.com', '0987654321', 'HR Manager', 'Human Resources', 'CEO', '2023-02-01', 40000000, 'Active', 'Full-time', 'Ho Chi Minh City', 'Recruitment, Employee Relations', 4.2, 250, 248, 1, 1, 1, 18)
GO

PRINT 'Database schema created successfully!'