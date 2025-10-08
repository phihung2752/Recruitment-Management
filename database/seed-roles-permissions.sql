-- Seed data for Roles and Permissions
-- Insert sample roles
INSERT INTO Roles (Id, Name, NormalizedName, Description, IsSystemRole, CreatedAt, UpdatedAt) VALUES
(NEWID(), 'SuperAdmin', 'SUPERADMIN', 'Super Administrator with full system access', 1, GETDATE(), GETDATE()),
(NEWID(), 'HR Manager', 'HRMANAGER', 'Human Resources Manager', 1, GETDATE(), GETDATE()),
(NEWID(), 'Recruiter', 'RECRUITER', 'Recruitment Specialist', 1, GETDATE(), GETDATE()),
(NEWID(), 'Manager', 'MANAGER', 'Department Manager', 1, GETDATE(), GETDATE()),
(NEWID(), 'Employee', 'EMPLOYEE', 'Regular Employee', 1, GETDATE(), GETDATE());

-- Insert sample permissions
INSERT INTO Permissions (Id, Name, NormalizedName, Description, Module, Action, Resource, CreatedAt, UpdatedAt) VALUES
-- Dashboard permissions
(NEWID(), 'dashboard.view', 'DASHBOARD.VIEW', 'View dashboard', 'Dashboard', 'View', 'Dashboard', GETDATE(), GETDATE()),

-- User management permissions
(NEWID(), 'user.read', 'USER.READ', 'Read user information', 'User', 'Read', 'User', GETDATE(), GETDATE()),
(NEWID(), 'user.create', 'USER.CREATE', 'Create new users', 'User', 'Create', 'User', GETDATE(), GETDATE()),
(NEWID(), 'user.update', 'USER.UPDATE', 'Update user information', 'User', 'Update', 'User', GETDATE(), GETDATE()),
(NEWID(), 'user.delete', 'USER.DELETE', 'Delete users', 'User', 'Delete', 'User', GETDATE(), GETDATE()),

-- Job posting permissions
(NEWID(), 'job.read', 'JOB.READ', 'Read job postings', 'Job', 'Read', 'JobPosting', GETDATE(), GETDATE()),
(NEWID(), 'job.create', 'JOB.CREATE', 'Create job postings', 'Job', 'Create', 'JobPosting', GETDATE(), GETDATE()),
(NEWID(), 'job.update', 'JOB.UPDATE', 'Update job postings', 'Job', 'Update', 'JobPosting', GETDATE(), GETDATE()),
(NEWID(), 'job.delete', 'JOB.DELETE', 'Delete job postings', 'Job', 'Delete', 'JobPosting', GETDATE(), GETDATE()),
(NEWID(), 'job.approve', 'JOB.APPROVE', 'Approve job postings', 'Job', 'Approve', 'JobPosting', GETDATE(), GETDATE()),

-- Candidate permissions
(NEWID(), 'candidate.read', 'CANDIDATE.READ', 'Read candidate information', 'Candidate', 'Read', 'Candidate', GETDATE(), GETDATE()),
(NEWID(), 'candidate.create', 'CANDIDATE.CREATE', 'Create new candidates', 'Candidate', 'Create', 'Candidate', GETDATE(), GETDATE()),
(NEWID(), 'candidate.update', 'CANDIDATE.UPDATE', 'Update candidate information', 'Candidate', 'Update', 'Candidate', GETDATE(), GETDATE()),
(NEWID(), 'candidate.delete', 'CANDIDATE.DELETE', 'Delete candidates', 'Candidate', 'Delete', 'Candidate', GETDATE(), GETDATE()),

-- Interview permissions
(NEWID(), 'interview.read', 'INTERVIEW.READ', 'Read interview information', 'Interview', 'Read', 'Interview', GETDATE(), GETDATE()),
(NEWID(), 'interview.create', 'INTERVIEW.CREATE', 'Schedule interviews', 'Interview', 'Create', 'Interview', GETDATE(), GETDATE()),
(NEWID(), 'interview.update', 'INTERVIEW.UPDATE', 'Update interview information', 'Interview', 'Update', 'Interview', GETDATE(), GETDATE()),
(NEWID(), 'interview.delete', 'INTERVIEW.DELETE', 'Cancel interviews', 'Interview', 'Delete', 'Interview', GETDATE(), GETDATE()),

-- Permission management
(NEWID(), 'permission.read', 'PERMISSION.READ', 'Read permissions', 'Permission', 'Read', 'Permission', GETDATE(), GETDATE()),
(NEWID(), 'permission.assign', 'PERMISSION.ASSIGN', 'Assign permissions to users', 'Permission', 'Assign', 'Permission', GETDATE(), GETDATE()),

-- Analytics permissions
(NEWID(), 'analytics.view', 'ANALYTICS.VIEW', 'View analytics and reports', 'Analytics', 'View', 'Report', GETDATE(), GETDATE()),
(NEWID(), 'report.generate', 'REPORT.GENERATE', 'Generate reports', 'Report', 'Generate', 'Report', GETDATE(), GETDATE());
