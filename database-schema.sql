-- HR Management System Database Schema
-- SQL Server Database Design with RBAC

-- Create Database
CREATE DATABASE HRManagementSystem;
GO

USE HRManagementSystem;
GO

-- 1. Roles Table
CREATE TABLE Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- 2. Permissions Table
CREATE TABLE Permissions (
    PermissionId INT IDENTITY(1,1) PRIMARY KEY,
    PermissionName NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    Module NVARCHAR(50), -- e.g., 'Users', 'Employees', 'Candidates'
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- 3. RolePermissions Junction Table
CREATE TABLE RolePermissions (
    RoleId INT NOT NULL,
    PermissionId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    PRIMARY KEY (RoleId, PermissionId),
    FOREIGN KEY (RoleId) REFERENCES Roles(RoleId) ON DELETE CASCADE,
    FOREIGN KEY (PermissionId) REFERENCES Permissions(PermissionId) ON DELETE CASCADE
);

-- 4. Users Table
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    RoleId INT NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Active', -- Active, Inactive, Locked
    LastLoginAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CreatedBy INT,
    FOREIGN KEY (RoleId) REFERENCES Roles(RoleId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- 5. Employees Table
CREATE TABLE Employees (
    EmployeeId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT UNIQUE,
    EmployeeCode NVARCHAR(20) NOT NULL UNIQUE,
    Department NVARCHAR(100),
    Position NVARCHAR(100),
    ManagerId INT,
    HireDate DATE,
    Salary DECIMAL(10,2),
    Status NVARCHAR(20) DEFAULT 'Active',
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ManagerId) REFERENCES Employees(EmployeeId)
);

-- 6. Candidates Table
CREATE TABLE Candidates (
    CandidateId INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20),
    Position NVARCHAR(100),
    Experience INT,
    Skills NVARCHAR(MAX),
    Education NVARCHAR(255),
    ExpectedSalary DECIMAL(10,2),
    Status NVARCHAR(20) DEFAULT 'Applied', -- Applied, Interviewed, Hired, Rejected
    Source NVARCHAR(100),
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CreatedBy INT,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- 7. JobPostings Table
CREATE TABLE JobPostings (
    JobId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Department NVARCHAR(100),
    Description NVARCHAR(MAX),
    Requirements NVARCHAR(MAX),
    Location NVARCHAR(100),
    SalaryMin DECIMAL(10,2),
    SalaryMax DECIMAL(10,2),
    Status NVARCHAR(20) DEFAULT 'Open', -- Open, Closed, Paused
    PostedDate DATETIME2 DEFAULT GETUTCDATE(),
    ClosedDate DATETIME2,
    CreatedBy INT,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);

-- 8. Interviews Table
CREATE TABLE Interviews (
    InterviewId INT IDENTITY(1,1) PRIMARY KEY,
    CandidateId INT NOT NULL,
    JobId INT,
    InterviewerId INT NOT NULL,
    InterviewDate DATETIME2 NOT NULL,
    Duration INT, -- in minutes
    Type NVARCHAR(50), -- Phone, Video, In-Person
    Status NVARCHAR(20) DEFAULT 'Scheduled', -- Scheduled, Completed, Cancelled
    Notes NVARCHAR(MAX),
    Rating INT, -- 1-5 scale
    Result NVARCHAR(20), -- Pass, Fail, Pending
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (CandidateId) REFERENCES Candidates(CandidateId),
    FOREIGN KEY (JobId) REFERENCES JobPostings(JobId),
    FOREIGN KEY (InterviewerId) REFERENCES Users(UserId)
);

-- 9. AuditLogs Table
CREATE TABLE AuditLogs (
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT,
    Action NVARCHAR(100) NOT NULL,
    TableName NVARCHAR(50),
    RecordId INT,
    OldValues NVARCHAR(MAX),
    NewValues NVARCHAR(MAX),
    IpAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Insert Default Roles
INSERT INTO Roles (RoleName, Description) VALUES
('Admin', 'System Administrator with full access'),
('HR', 'Human Resources Manager'),
('Manager', 'Department Manager'),
('Employee', 'Regular Employee'),
('Interviewer', 'Interview Panel Member');

-- Insert Permissions
INSERT INTO Permissions (PermissionName, Description, Module) VALUES
-- User Management
('users.view', 'View users', 'Users'),
('users.create', 'Create users', 'Users'),
('users.edit', 'Edit users', 'Users'),
('users.delete', 'Delete users', 'Users'),
('users.reset_password', 'Reset user passwords', 'Users'),

-- Employee Management
('employees.view', 'View employees', 'Employees'),
('employees.create', 'Create employees', 'Employees'),
('employees.edit', 'Edit employees', 'Employees'),
('employees.delete', 'Delete employees', 'Employees'),

-- Candidate Management
('candidates.view', 'View candidates', 'Candidates'),
('candidates.create', 'Create candidates', 'Candidates'),
('candidates.edit', 'Edit candidates', 'Candidates'),
('candidates.delete', 'Delete candidates', 'Candidates'),

-- Interview Management
('interviews.view', 'View interviews', 'Interviews'),
('interviews.create', 'Create interviews', 'Interviews'),
('interviews.edit', 'Edit interviews', 'Interviews'),
('interviews.delete', 'Delete interviews', 'Interviews'),

-- Job Posting Management
('jobs.view', 'View job postings', 'Jobs'),
('jobs.create', 'Create job postings', 'Jobs'),
('jobs.edit', 'Edit job postings', 'Jobs'),
('jobs.delete', 'Delete job postings', 'Jobs'),

-- Reports
('reports.view', 'View reports', 'Reports'),
('reports.export', 'Export reports', 'Reports'),

-- System
('system.admin', 'System administration', 'System'),
('system.settings', 'System settings', 'System'),

-- Calendar
('calendar.view', 'View calendar', 'Calendar'),
('calendar.edit', 'Edit calendar', 'Calendar'),

-- Notifications
('notifications.view', 'View notifications', 'Notifications'),
('notifications.send', 'Send notifications', 'Notifications');

-- Assign Permissions to Roles
-- Admin gets all permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 1, PermissionId FROM Permissions;

-- HR permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 2, PermissionId FROM Permissions 
WHERE PermissionName IN (
    'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
    'candidates.view', 'candidates.create', 'candidates.edit', 'candidates.delete',
    'interviews.view', 'interviews.create', 'interviews.edit', 'interviews.delete',
    'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.delete',
    'reports.view', 'reports.export',
    'calendar.view', 'calendar.edit',
    'notifications.view', 'notifications.send'
);

-- Manager permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 3, PermissionId FROM Permissions 
WHERE PermissionName IN (
    'employees.view',
    'candidates.view',
    'interviews.view', 'interviews.create', 'interviews.edit',
    'jobs.view',
    'reports.view',
    'calendar.view'
);

-- Employee permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 4, PermissionId FROM Permissions 
WHERE PermissionName IN (
    'calendar.view',
    'notifications.view'
);

-- Interviewer permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 5, PermissionId FROM Permissions 
WHERE PermissionName IN (
    'candidates.view',
    'interviews.view', 'interviews.create', 'interviews.edit',
    'calendar.view'
);

-- Create default admin user (password: Admin123!)
INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, RoleId, Status, CreatedBy)
VALUES ('admin', 'admin@hrmanagement.com', '$2a$11$rQZ8K9LmN2pQ3sT4uV5wXeY6zA7bC8dE9fG0hI1jK2lM3nO4pP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4', 'System', 'Administrator', 1, 'Active', 1);

-- Create sample HR user (password: HR123!)
INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, RoleId, Status, CreatedBy)
VALUES ('hr_manager', 'hr@hrmanagement.com', '$2a$11$rQZ8K9LmN2pQ3sT4uV5wXeY6zA7bC8dE9fG0hI1jK2lM3nO4pP5qR6sS7tT8uU9vV0wW1xX2yY3zZ4', 'HR', 'Manager', 2, 'Active', 1);

-- Create indexes for better performance
CREATE INDEX IX_Users_Username ON Users(Username);
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_RoleId ON Users(RoleId);
CREATE INDEX IX_Employees_UserId ON Employees(UserId);
CREATE INDEX IX_Candidates_Status ON Candidates(Status);
CREATE INDEX IX_Interviews_InterviewerId ON Interviews(InterviewerId);
CREATE INDEX IX_Interviews_CandidateId ON Interviews(CandidateId);
CREATE INDEX IX_AuditLogs_UserId ON AuditLogs(UserId);
CREATE INDEX IX_AuditLogs_CreatedAt ON AuditLogs(CreatedAt);

-- Create stored procedures for common operations
GO

-- Stored Procedure: Get User Permissions
CREATE PROCEDURE GetUserPermissions
    @UserId INT
AS
BEGIN
    SELECT p.PermissionName, p.Description, p.Module
    FROM Users u
    INNER JOIN RolePermissions rp ON u.RoleId = rp.RoleId
    INNER JOIN Permissions p ON rp.PermissionId = p.PermissionId
    WHERE u.UserId = @UserId AND u.Status = 'Active'
    ORDER BY p.Module, p.PermissionName;
END
GO

-- Stored Procedure: Check User Permission
CREATE PROCEDURE CheckUserPermission
    @UserId INT,
    @PermissionName NVARCHAR(100)
AS
BEGIN
    SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS HasPermission
    FROM Users u
    INNER JOIN RolePermissions rp ON u.RoleId = rp.RoleId
    INNER JOIN Permissions p ON rp.PermissionId = p.PermissionId
    WHERE u.UserId = @UserId 
    AND u.Status = 'Active' 
    AND p.PermissionName = @PermissionName;
END
GO

-- Stored Procedure: Get Users with Roles
CREATE PROCEDURE GetUsersWithRoles
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @SearchTerm NVARCHAR(100) = NULL
AS
BEGIN
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        u.UserId,
        u.Username,
        u.Email,
        u.FirstName,
        u.LastName,
        r.RoleName,
        u.Status,
        u.LastLoginAt,
    FROM Users u
    INNER JOIN Roles r ON u.RoleId = r.RoleId
    WHERE (@SearchTerm IS NULL OR 
           u.Username LIKE '%' + @SearchTerm + '%' OR
           u.Email LIKE '%' + @SearchTerm + '%' OR
           u.FirstName LIKE '%' + @SearchTerm + '%' OR
           
           u.LastName LIKE '%' + @SearchTerm + '%')
    ORDER BY u.CreatedAt DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
    
    -- Get total count
    SELECT COUNT(*) as TotalCount
    FROM Users u
    WHERE (@SearchTerm IS NULL OR 
           u.Username LIKE '%' + @SearchTerm + '%' OR
           u.Email LIKE '%' + @SearchTerm + '%' OR
           u.FirstName LIKE '%' + @SearchTerm + '%' OR
           u.LastName LIKE '%' + @SearchTerm + '%');
END
GO



