-- Create database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'HRManagementSystem')
BEGIN
    CREATE DATABASE HRManagementSystem;
END
GO

USE HRManagementSystem;
GO

-- Create Permissions table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Permissions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Permissions] (
        [PermissionId] int IDENTITY(1,1) NOT NULL,
        [PermissionName] nvarchar(100) NOT NULL,
        [Description] nvarchar(255) NULL,
        [Module] nvarchar(50) NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Permissions] PRIMARY KEY ([PermissionId])
    );
END
GO

-- Create Roles table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Roles]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Roles] (
        [RoleId] int IDENTITY(1,1) NOT NULL,
        [RoleName] nvarchar(50) NOT NULL,
        [Description] nvarchar(255) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Roles] PRIMARY KEY ([RoleId])
    );
END
GO

-- Create RolePermissions table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RolePermissions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[RolePermissions] (
        [RoleId] int NOT NULL,
        [PermissionId] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_RolePermissions] PRIMARY KEY ([RoleId], [PermissionId]),
        CONSTRAINT [FK_RolePermissions_Permissions_PermissionId] FOREIGN KEY ([PermissionId]) REFERENCES [Permissions] ([PermissionId]) ON DELETE CASCADE,
        CONSTRAINT [FK_RolePermissions_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Roles] ([RoleId]) ON DELETE CASCADE
    );
END
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users] (
        [UserId] int IDENTITY(1,1) NOT NULL,
        [Username] nvarchar(50) NOT NULL,
        [Email] nvarchar(100) NOT NULL,
        [PasswordHash] nvarchar(255) NOT NULL,
        [FirstName] nvarchar(50) NOT NULL,
        [LastName] nvarchar(50) NOT NULL,
        [RoleId] int NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [LastLoginAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        [CreatedBy] int NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([UserId]),
        CONSTRAINT [FK_Users_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Roles] ([RoleId]) ON DELETE RESTRICT,
        CONSTRAINT [FK_Users_Users_CreatedBy] FOREIGN KEY ([CreatedBy]) REFERENCES [Users] ([UserId]) ON DELETE RESTRICT
    );
END
GO

-- Insert Roles
IF NOT EXISTS (SELECT * FROM [Roles] WHERE [RoleId] = 1)
BEGIN
    INSERT INTO [Roles] ([RoleId], [RoleName], [Description], [CreatedAt], [UpdatedAt])
    VALUES (1, 'Admin', 'System Administrator with full access', GETDATE(), GETDATE()),
           (2, 'HR', 'Human Resources Manager', GETDATE(), GETDATE()),
           (3, 'Manager', 'Department Manager', GETDATE(), GETDATE()),
           (4, 'Employee', 'Regular Employee', GETDATE(), GETDATE()),
           (5, 'Interviewer', 'Interview Panel Member', GETDATE(), GETDATE());
END
GO

-- Insert Permissions
IF NOT EXISTS (SELECT * FROM [Permissions] WHERE [PermissionId] = 1)
BEGIN
    INSERT INTO [Permissions] ([PermissionId], [PermissionName], [Description], [Module], [CreatedAt])
    VALUES (1, 'users.view', 'View users', 'Users', GETDATE()),
           (2, 'users.create', 'Create users', 'Users', GETDATE()),
           (3, 'users.edit', 'Edit users', 'Users', GETDATE()),
           (4, 'users.delete', 'Delete users', 'Users', GETDATE()),
           (5, 'users.reset_password', 'Reset user passwords', 'Users', GETDATE()),
           (6, 'employees.view', 'View employees', 'Employees', GETDATE()),
           (7, 'employees.create', 'Create employees', 'Employees', GETDATE()),
           (8, 'employees.edit', 'Edit employees', 'Employees', GETDATE()),
           (9, 'employees.delete', 'Delete employees', 'Employees', GETDATE()),
           (10, 'candidates.view', 'View candidates', 'Candidates', GETDATE()),
           (11, 'candidates.create', 'Create candidates', 'Candidates', GETDATE()),
           (12, 'candidates.edit', 'Edit candidates', 'Candidates', GETDATE()),
           (13, 'candidates.delete', 'Delete candidates', 'Candidates', GETDATE()),
           (14, 'interviews.view', 'View interviews', 'Interviews', GETDATE()),
           (15, 'interviews.create', 'Create interviews', 'Interviews', GETDATE()),
           (16, 'interviews.edit', 'Edit interviews', 'Interviews', GETDATE()),
           (17, 'interviews.delete', 'Delete interviews', 'Interviews', GETDATE()),
           (18, 'jobs.view', 'View job postings', 'Jobs', GETDATE()),
           (19, 'jobs.create', 'Create job postings', 'Jobs', GETDATE()),
           (20, 'jobs.edit', 'Edit job postings', 'Jobs', GETDATE()),
           (21, 'jobs.delete', 'Delete job postings', 'Jobs', GETDATE()),
           (22, 'reports.view', 'View reports', 'Reports', GETDATE()),
           (23, 'reports.export', 'Export reports', 'Reports', GETDATE()),
           (24, 'system.admin', 'System administration', 'System', GETDATE()),
           (25, 'system.settings', 'System settings', 'System', GETDATE()),
           (26, 'calendar.view', 'View calendar', 'Calendar', GETDATE()),
           (27, 'calendar.edit', 'Edit calendar', 'Calendar', GETDATE()),
           (28, 'notifications.view', 'View notifications', 'Notifications', GETDATE()),
           (29, 'notifications.send', 'Send notifications', 'Notifications', GETDATE());
END
GO

-- Insert RolePermissions
IF NOT EXISTS (SELECT * FROM [RolePermissions] WHERE [RoleId] = 1 AND [PermissionId] = 1)
BEGIN
    -- Admin gets all permissions
    INSERT INTO [RolePermissions] ([RoleId], [PermissionId], [CreatedAt])
    SELECT 1, [PermissionId], GETDATE() FROM [Permissions];
    
    -- HR permissions
    INSERT INTO [RolePermissions] ([RoleId], [PermissionId], [CreatedAt])
    VALUES (2, 6, GETDATE()), (2, 7, GETDATE()), (2, 8, GETDATE()), (2, 9, GETDATE()),
           (2, 10, GETDATE()), (2, 11, GETDATE()), (2, 12, GETDATE()), (2, 13, GETDATE()),
           (2, 14, GETDATE()), (2, 15, GETDATE()), (2, 16, GETDATE()), (2, 17, GETDATE()),
           (2, 18, GETDATE()), (2, 19, GETDATE()), (2, 20, GETDATE()), (2, 21, GETDATE()),
           (2, 22, GETDATE()), (2, 23, GETDATE()), (2, 26, GETDATE()), (2, 27, GETDATE()),
           (2, 28, GETDATE()), (2, 29, GETDATE());
    
    -- Manager permissions
    INSERT INTO [RolePermissions] ([RoleId], [PermissionId], [CreatedAt])
    VALUES (3, 6, GETDATE()), (3, 10, GETDATE()), (3, 14, GETDATE()), (3, 15, GETDATE()),
           (3, 16, GETDATE()), (3, 18, GETDATE()), (3, 22, GETDATE()), (3, 26, GETDATE());
    
    -- Employee permissions
    INSERT INTO [RolePermissions] ([RoleId], [PermissionId], [CreatedAt])
    VALUES (4, 26, GETDATE()), (4, 28, GETDATE());
    
    -- Interviewer permissions
    INSERT INTO [RolePermissions] ([RoleId], [PermissionId], [CreatedAt])
    VALUES (5, 10, GETDATE()), (5, 14, GETDATE()), (5, 15, GETDATE()),
           (5, 16, GETDATE()), (5, 26, GETDATE());
END
GO

-- Insert Admin User
IF NOT EXISTS (SELECT * FROM [Users] WHERE [Username] = 'admin')
BEGIN
    INSERT INTO [Users] ([Username], [Email], [PasswordHash], [FirstName], [LastName], [RoleId], [Status], [CreatedAt], [UpdatedAt], [CreatedBy])
    VALUES ('admin', 'admin@hrmanagement.com', '$2b$12$bBZv5rCrJLQj/eyqOgtLX.OgJcEdWQHcKY6vBZpy9TNs.i1Uq/jE6', 'System', 'Administrator', 1, 'Active', GETDATE(), GETDATE(), 1);
END
GO

-- Create indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Username' AND object_id = OBJECT_ID('Users'))
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email' AND object_id = OBJECT_ID('Users'))
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_RoleId' AND object_id = OBJECT_ID('Users'))
BEGIN
    CREATE INDEX [IX_Users_RoleId] ON [Users] ([RoleId]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_RolePermissions_PermissionId' AND object_id = OBJECT_ID('RolePermissions'))
BEGIN
    CREATE INDEX [IX_RolePermissions_PermissionId] ON [RolePermissions] ([PermissionId]);
END
GO

PRINT 'Database setup completed successfully!';

