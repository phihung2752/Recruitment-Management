-- Update Users table to add comprehensive user information
-- This script adds new columns to the existing Users table

-- Add personal information fields
ALTER TABLE Users ADD 
    Phone NVARCHAR(20) NULL,
    DateOfBirth DATE NULL,
    Gender NVARCHAR(10) NULL,
    PersonalId NVARCHAR(20) NULL,
    Nationality NVARCHAR(50) NULL,
    MaritalStatus NVARCHAR(20) NULL,
    AvatarUrl NVARCHAR(500) NULL,
    EmergencyContactName NVARCHAR(100) NULL,
    EmergencyContactPhone NVARCHAR(20) NULL,
    PersonalEmail NVARCHAR(100) NULL,
    CurrentAddress NVARCHAR(500) NULL,
    PermanentAddress NVARCHAR(500) NULL;

-- Add work information fields
ALTER TABLE Users ADD
    EmployeeId NVARCHAR(20) NULL,
    DepartmentId NVARCHAR(36) NULL,
    Position NVARCHAR(100) NULL,
    Level NVARCHAR(20) NULL,
    ManagerId NVARCHAR(36) NULL,
    WorkLocation NVARCHAR(100) NULL,
    EmploymentType NVARCHAR(20) NULL,
    EmploymentStatus NVARCHAR(20) NULL,
    JoinDate DATE NULL,
    ContractEndDate DATE NULL,
    ProbationEndDate DATE NULL,
    LastLoginAt DATETIME2 NULL,
    LastActiveAt DATETIME2 NULL,
    LoginCount INT DEFAULT 0,
    FailedLoginAttempts INT DEFAULT 0,
    IsLocked BIT DEFAULT 0,
    LockedUntil DATETIME2 NULL;

-- Add compensation fields (optional, can be in separate table for security)
ALTER TABLE Users ADD
    SalaryGrade NVARCHAR(20) NULL,
    BankAccount NVARCHAR(50) NULL,
    TaxCode NVARCHAR(20) NULL,
    SocialInsuranceNumber NVARCHAR(20) NULL;

-- Add education and skills fields
ALTER TABLE Users ADD
    HighestDegree NVARCHAR(50) NULL,
    University NVARCHAR(200) NULL,
    Major NVARCHAR(100) NULL,
    Skills NVARCHAR(1000) NULL,
    Certificates NVARCHAR(1000) NULL,
    Languages NVARCHAR(500) NULL;

-- Add system fields
ALTER TABLE Users ADD
    CreatedById NVARCHAR(36) NULL,
    UpdatedById NVARCHAR(36) NULL,
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    Notes NVARCHAR(2000) NULL,
    Tags NVARCHAR(500) NULL;

-- Create Departments table if not exists
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Departments' AND xtype='U')
BEGIN
    CREATE TABLE Departments (
        Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(100) NOT NULL UNIQUE,
        Description NVARCHAR(500) NULL,
        ManagerId NVARCHAR(36) NULL,
        ParentDepartmentId NVARCHAR(36) NULL,
        Location NVARCHAR(100) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CreatedById NVARCHAR(36) NULL,
        FOREIGN KEY (ManagerId) REFERENCES Users(Id),
        FOREIGN KEY (ParentDepartmentId) REFERENCES Departments(Id),
        FOREIGN KEY (CreatedById) REFERENCES Users(Id)
    );
END

-- Create UserActivityLog table for tracking user actions
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserActivityLog' AND xtype='U')
BEGIN
    CREATE TABLE UserActivityLog (
        Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        UserId NVARCHAR(36) NOT NULL,
        Action NVARCHAR(100) NOT NULL,
        Description NVARCHAR(500) NULL,
        OldValue NVARCHAR(1000) NULL,
        NewValue NVARCHAR(1000) NULL,
        IpAddress NVARCHAR(45) NULL,
        UserAgent NVARCHAR(500) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CreatedById NVARCHAR(36) NULL,
        FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
        FOREIGN KEY (CreatedById) REFERENCES Users(Id)
    );
END

-- Create UserSessions table for session management
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserSessions' AND xtype='U')
BEGIN
    CREATE TABLE UserSessions (
        Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        UserId NVARCHAR(36) NOT NULL,
        SessionToken NVARCHAR(500) NOT NULL,
        IpAddress NVARCHAR(45) NULL,
        UserAgent NVARCHAR(500) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        ExpiresAt DATETIME2 NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        LastActivityAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
    );
END

-- Create UserNotes table for internal notes
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserNotes' AND xtype='U')
BEGIN
    CREATE TABLE UserNotes (
        Id NVARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
        UserId NVARCHAR(36) NOT NULL,
        NoteText NVARCHAR(2000) NOT NULL,
        NoteType NVARCHAR(50) NOT NULL DEFAULT 'General',
        IsPrivate BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        CreatedById NVARCHAR(36) NOT NULL,
        FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
        FOREIGN KEY (CreatedById) REFERENCES Users(Id)
    );
END

-- Add foreign key constraints for Users table
ALTER TABLE Users ADD CONSTRAINT FK_Users_DepartmentId 
    FOREIGN KEY (DepartmentId) REFERENCES Departments(Id);

ALTER TABLE Users ADD CONSTRAINT FK_Users_ManagerId 
    FOREIGN KEY (ManagerId) REFERENCES Users(Id);

ALTER TABLE Users ADD CONSTRAINT FK_Users_CreatedById 
    FOREIGN KEY (CreatedById) REFERENCES Users(Id);

ALTER TABLE Users ADD CONSTRAINT FK_Users_UpdatedById 
    FOREIGN KEY (UpdatedById) REFERENCES Users(Id);

-- Insert sample departments
INSERT INTO Departments (Id, Name, Description, Location, IsActive) VALUES
(NEWID(), 'Engineering', 'Software Development and Technical Operations', 'HQ - Hà Nội', 1),
(NEWID(), 'Product', 'Product Management and Strategy', 'HQ - Hà Nội', 1),
(NEWID(), 'Design', 'UI/UX Design and Creative Services', 'HQ - Hà Nội', 1),
(NEWID(), 'Marketing', 'Marketing and Brand Management', 'HQ - Hà Nội', 1),
(NEWID(), 'Sales', 'Sales and Business Development', 'Office - HCM', 1),
(NEWID(), 'HR', 'Human Resources and People Operations', 'HQ - Hà Nội', 1),
(NEWID(), 'Finance', 'Finance and Accounting', 'HQ - Hà Nội', 1),
(NEWID(), 'Operations', 'Operations and Administration', 'HQ - Hà Nội', 1);

-- Update existing users with sample data
UPDATE Users SET 
    Phone = '+84' + CAST(ABS(CHECKSUM(NEWID())) % 900000000 + 100000000 AS NVARCHAR(9)),
    DepartmentId = (SELECT TOP 1 Id FROM Departments ORDER BY NEWID()),
    Position = CASE 
        WHEN Username = 'admin' THEN 'System Administrator'
        WHEN Username = 'hr' THEN 'HR Manager'
        ELSE 'Software Engineer'
    END,
    Level = CASE 
        WHEN Username = 'admin' THEN 'Senior'
        WHEN Username = 'hr' THEN 'Manager'
        ELSE 'Mid'
    END,
    EmploymentType = 'Full-time',
    EmploymentStatus = 'Permanent',
    JoinDate = DATEADD(DAY, -ABS(CHECKSUM(NEWID())) % 365, GETDATE()),
    WorkLocation = 'HQ - Hà Nội',
    EmployeeId = 'EMP' + RIGHT('0000' + CAST(ROW_NUMBER() OVER (ORDER BY CreatedAt) AS NVARCHAR(4)), 4)
WHERE Phone IS NULL;

-- Create indexes for better performance
CREATE INDEX IX_Users_DepartmentId ON Users(DepartmentId);
CREATE INDEX IX_Users_ManagerId ON Users(ManagerId);
CREATE INDEX IX_Users_EmployeeId ON Users(EmployeeId);
CREATE INDEX IX_Users_EmploymentStatus ON Users(EmploymentStatus);
CREATE INDEX IX_Users_LastLoginAt ON Users(LastLoginAt);
CREATE INDEX IX_UserActivityLog_UserId ON UserActivityLog(UserId);
CREATE INDEX IX_UserActivityLog_CreatedAt ON UserActivityLog(CreatedAt);
CREATE INDEX IX_UserSessions_UserId ON UserSessions(UserId);
CREATE INDEX IX_UserSessions_IsActive ON UserSessions(IsActive);
