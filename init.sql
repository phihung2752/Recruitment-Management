-- Create database if not exists
CREATE DATABASE IF NOT EXISTS HRManagement;
USE HRManagement;

-- Create tables
CREATE TABLE IF NOT EXISTS `Roles` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(50) NOT NULL,
    `Description` varchar(200) NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_Roles_Name` (`Name`)
);

CREATE TABLE IF NOT EXISTS `Permissions` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(50) NOT NULL,
    `Description` varchar(200) NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_Permissions_Name` (`Name`)
);

CREATE TABLE IF NOT EXISTS `Users` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Username` varchar(50) NOT NULL,
    `Email` varchar(100) NOT NULL,
    `PasswordHash` varchar(255) NOT NULL,
    `FirstName` varchar(50) NOT NULL,
    `LastName` varchar(50) NOT NULL,
    `Phone` varchar(20) NULL,
    `Avatar` varchar(255) NULL,
    `Status` varchar(20) NOT NULL DEFAULT 'Active',
    `LastLoginAt` datetime(6) NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_Users_Username` (`Username`),
    UNIQUE KEY `IX_Users_Email` (`Email`)
);

CREATE TABLE IF NOT EXISTS `UserRoles` (
    `UserId` int NOT NULL,
    `RoleId` int NOT NULL,
    `AssignedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`UserId`, `RoleId`),
    KEY `IX_UserRoles_RoleId` (`RoleId`),
    CONSTRAINT `FK_UserRoles_Roles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_UserRoles_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `RolePermissions` (
    `RoleId` int NOT NULL,
    `PermissionId` int NOT NULL,
    `AssignedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`RoleId`, `PermissionId`),
    KEY `IX_RolePermissions_PermissionId` (`PermissionId`),
    CONSTRAINT `FK_RolePermissions_Permissions_PermissionId` FOREIGN KEY (`PermissionId`) REFERENCES `Permissions` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_RolePermissions_Roles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Departments` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(100) NOT NULL,
    `Description` varchar(500) NULL,
    `Manager` varchar(100) NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_Departments_Name` (`Name`)
);

CREATE TABLE IF NOT EXISTS `Employees` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `EmployeeId` varchar(20) NOT NULL,
    `UserId` int NULL,
    `FirstName` varchar(50) NOT NULL,
    `LastName` varchar(50) NOT NULL,
    `Email` varchar(100) NOT NULL,
    `Phone` varchar(20) NULL,
    `DepartmentId` int NOT NULL,
    `Position` varchar(100) NOT NULL,
    `Manager` varchar(100) NULL,
    `HireDate` date NOT NULL,
    `Salary` decimal(18,2) NULL,
    `Location` varchar(100) NULL,
    `WorkType` varchar(20) NULL,
    `Status` varchar(20) NOT NULL DEFAULT 'Active',
    `Avatar` varchar(255) NULL,
    `Notes` text NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_Employees_EmployeeId` (`EmployeeId`),
    UNIQUE KEY `IX_Employees_Email` (`Email`),
    KEY `IX_Employees_DepartmentId` (`DepartmentId`),
    KEY `IX_Employees_UserId` (`UserId`),
    CONSTRAINT `FK_Employees_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_Employees_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `JobPosts` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Title` varchar(200) NOT NULL,
    `Description` text NOT NULL,
    `Requirements` text NOT NULL,
    `DepartmentId` int NOT NULL,
    `Location` varchar(100) NOT NULL,
    `EmploymentType` varchar(20) NULL,
    `SalaryMin` decimal(18,2) NULL,
    `SalaryMax` decimal(18,2) NULL,
    `Status` varchar(20) NOT NULL DEFAULT 'Draft',
    `CreatedBy` int NOT NULL,
    `PublishedAt` datetime(6) NULL,
    `ExpiryDate` datetime(6) NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    KEY `IX_JobPosts_DepartmentId` (`DepartmentId`),
    KEY `IX_JobPosts_CreatedBy` (`CreatedBy`),
    CONSTRAINT `FK_JobPosts_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_JobPosts_Users_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Candidates` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `FirstName` varchar(50) NOT NULL,
    `LastName` varchar(50) NOT NULL,
    `Email` varchar(100) NOT NULL,
    `Phone` varchar(20) NULL,
    `Position` varchar(100) NOT NULL,
    `Experience` varchar(500) NULL,
    `Skills` text NULL,
    `Education` varchar(500) NULL,
    `ExpectedSalary` decimal(18,2) NULL,
    `Status` varchar(20) NOT NULL DEFAULT 'New',
    `Source` varchar(50) NULL,
    `Notes` text NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_Candidates_Email` (`Email`)
);

CREATE TABLE IF NOT EXISTS `CVs` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `CandidateId` int NOT NULL,
    `FileName` varchar(255) NOT NULL,
    `FilePath` varchar(500) NOT NULL,
    `FileSize` bigint NOT NULL,
    `ContentType` varchar(100) NOT NULL,
    `Status` varchar(20) NOT NULL DEFAULT 'Active',
    `UploadedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    KEY `IX_CVs_CandidateId` (`CandidateId`),
    CONSTRAINT `FK_CVs_Candidates_CandidateId` FOREIGN KEY (`CandidateId`) REFERENCES `Candidates` (`Id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Interviews` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `CandidateId` int NOT NULL,
    `JobPostId` int NOT NULL,
    `InterviewerId` int NOT NULL,
    `ScheduledDate` datetime(6) NOT NULL,
    `Duration` int NULL,
    `Type` varchar(50) NOT NULL,
    `Status` varchar(20) NOT NULL DEFAULT 'Scheduled',
    `Location` varchar(200) NULL,
    `Notes` text NULL,
    `Feedback` text NULL,
    `Rating` int NULL,
    `Recommendation` varchar(20) NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    KEY `IX_Interviews_CandidateId` (`CandidateId`),
    KEY `IX_Interviews_JobPostId` (`JobPostId`),
    KEY `IX_Interviews_InterviewerId` (`InterviewerId`),
    CONSTRAINT `FK_Interviews_Candidates_CandidateId` FOREIGN KEY (`CandidateId`) REFERENCES `Candidates` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_Interviews_JobPosts_JobPostId` FOREIGN KEY (`JobPostId`) REFERENCES `JobPosts` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_Interviews_Users_InterviewerId` FOREIGN KEY (`InterviewerId`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `CalendarEvents` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Title` varchar(200) NOT NULL,
    `Description` text NULL,
    `StartDate` datetime(6) NOT NULL,
    `EndDate` datetime(6) NOT NULL,
    `Type` varchar(50) NULL,
    `Location` varchar(200) NULL,
    `Attendees` text NULL,
    `CreatedBy` int NOT NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    KEY `IX_CalendarEvents_CreatedBy` (`CreatedBy`),
    CONSTRAINT `FK_CalendarEvents_Users_CreatedBy` FOREIGN KEY (`CreatedBy`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `AuditLogs` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UserId` int NULL,
    `Action` varchar(100) NOT NULL,
    `EntityType` varchar(100) NOT NULL,
    `EntityId` int NOT NULL,
    `Changes` json NULL,
    `IpAddress` varchar(45) NULL,
    `UserAgent` varchar(500) NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    KEY `IX_AuditLogs_UserId` (`UserId`),
    KEY `IX_AuditLogs_EntityType_EntityId` (`EntityType`, `EntityId`),
    CONSTRAINT `FK_AuditLogs_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `FileUploads` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `FileName` varchar(255) NOT NULL,
    `OriginalFileName` varchar(255) NOT NULL,
    `FilePath` varchar(500) NOT NULL,
    `FileSize` bigint NOT NULL,
    `ContentType` varchar(100) NOT NULL,
    `Category` varchar(50) NOT NULL,
    `UploadedBy` int NOT NULL,
    `UploadedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    KEY `IX_FileUploads_UploadedBy` (`UploadedBy`),
    CONSTRAINT `FK_FileUploads_Users_UploadedBy` FOREIGN KEY (`UploadedBy`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Notifications` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `UserId` int NOT NULL,
    `Title` varchar(200) NOT NULL,
    `Message` text NOT NULL,
    `Type` varchar(50) NOT NULL,
    `IsRead` tinyint(1) NOT NULL DEFAULT 0,
    `Data` json NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    KEY `IX_Notifications_UserId` (`UserId`),
    CONSTRAINT `FK_Notifications_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
);

-- Insert initial data
INSERT IGNORE INTO `Roles` (`Name`, `Description`) VALUES
('Admin', 'System Administrator with full access'),
('HR', 'Human Resources Manager'),
('Manager', 'Department Manager'),
('Employee', 'Regular Employee');

INSERT IGNORE INTO `Permissions` (`Name`, `Description`) VALUES
('users.view', 'View users'),
('users.create', 'Create users'),
('users.edit', 'Edit users'),
('users.delete', 'Delete users'),
('employees.view', 'View employees'),
('employees.create', 'Create employees'),
('employees.edit', 'Edit employees'),
('employees.delete', 'Delete employees'),
('candidates.view', 'View candidates'),
('candidates.create', 'Create candidates'),
('candidates.edit', 'Edit candidates'),
('candidates.delete', 'Delete candidates'),
('interviews.view', 'View interviews'),
('interviews.create', 'Create interviews'),
('interviews.edit', 'Edit interviews'),
('interviews.delete', 'Delete interviews');

INSERT IGNORE INTO `Departments` (`Name`, `Description`, `Manager`) VALUES
('Information Technology', 'IT Department responsible for technology infrastructure', 'John Smith'),
('Human Resources', 'HR Department managing employee relations and recruitment', 'Jane Doe'),
('Finance', 'Finance Department handling financial operations', 'Mike Johnson'),
('Marketing', 'Marketing Department managing brand and promotions', 'Sarah Wilson'),
('Operations', 'Operations Department overseeing daily business operations', 'David Brown');

-- Create default admin user (password: Admin123!)
INSERT IGNORE INTO `Users` (`Username`, `Email`, `PasswordHash`, `FirstName`, `LastName`, `Status`) VALUES
('admin', 'admin@hrmanagement.com', '$2a$11$rQZJKjQXjGF.8WJQJQJQJeO7VQJQJQJQJQJQJQJQJQJQJQJQJQJQJe', 'System', 'Administrator', 'Active');

-- Assign admin role to default user
INSERT IGNORE INTO `UserRoles` (`UserId`, `RoleId`) 
SELECT u.Id, r.Id FROM `Users` u, `Roles` r 
WHERE u.Username = 'admin' AND r.Name = 'Admin';
