-- =============================================
-- Create Company and Job Postings (Working Schema)
-- =============================================

USE HRManagementDB;
GO

-- Create a company first
INSERT INTO Companies (Id, Name, LegalName, TaxId, Industry, Website, Address, City, State, Country, PostalCode, Phone, Email, IsActive, CreatedAt, UpdatedAt, CreatedById)
VALUES 
    ('comp-001', 'Tech Solutions Inc', 'Tech Solutions Inc', '0123456789', 'Technology', 'https://techsolutions.com', '123 Nguyen Hue Street', 'Ho Chi Minh City', 'Ho Chi Minh', 'Vietnam', '700000', '+84-28-1234-5678', 'info@techsolutions.com', 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124');

-- Create departments
INSERT INTO Departments (Id, CompanyId, Name, Code, Description, ManagerId, Budget, Location, IsActive, CreatedAt, UpdatedAt, CreatedById)
VALUES 
    ('dept-001', 'comp-001', 'Engineering', 'ENG', 'Software development and engineering department', '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124', 1000000, 'Ho Chi Minh City', 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124'),
    ('dept-002', 'comp-001', 'Marketing', 'MKT', 'Marketing and communications department', '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124', 500000, 'Ho Chi Minh City', 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124'),
    ('dept-003', 'comp-001', 'Analytics', 'ANA', 'Data analysis and business intelligence department', '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124', 300000, 'Ho Chi Minh City', 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124'),
    ('dept-004', 'comp-001', 'Design', 'DES', 'User experience and design department', '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124', 400000, 'Ho Chi Minh City', 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124');

-- Create positions
INSERT INTO Positions (Id, DepartmentId, Title, Code, Description, Level, MinSalary, MaxSalary, RequiredSkills, RequiredExperience, IsActive, CreatedAt, UpdatedAt, CreatedById)
VALUES 
    ('pos-001', 'dept-001', 'Senior Software Engineer', 'SSE', 'Senior level software engineering position', 'Senior', 20000000, 40000000, 'C#, .NET, SQL Server, React', 5, 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124'),
    ('pos-002', 'dept-001', 'Frontend Developer', 'FD', 'Frontend development position', 'Mid', 15000000, 25000000, 'React, TypeScript, CSS, HTML', 3, 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124'),
    ('pos-003', 'dept-002', 'Marketing Manager', 'MM', 'Marketing management position', 'Senior', 18000000, 30000000, 'Digital marketing, Analytics', 5, 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124'),
    ('pos-004', 'dept-003', 'Data Analyst', 'DA', 'Data analysis position', 'Mid', 12000000, 20000000, 'SQL, Python, Excel, Statistics', 3, 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124'),
    ('pos-005', 'dept-004', 'UX Designer', 'UXD', 'User experience design position', 'Senior', 16000000, 28000000, 'Figma, Adobe Creative Suite', 4, 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124');

-- Now insert job postings
INSERT INTO JobPostings (Id, CompanyId, DepartmentId, PositionId, Title, Description, Requirements, Location, WorkType, EmploymentType, ExperienceLevel, Status, PublishedAt, ApplicationDeadline, NumberOfPositions, InternalPosting, ExternalPosting, CreatedAt, UpdatedAt, CreatedById)
VALUES 
    ('job-001', 'comp-001', 'dept-001', 'pos-001', 'Senior Software Engineer', 'We are looking for an experienced software engineer to join our development team.', 
     '5+ years experience, C#, .NET, SQL Server, React', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Senior', 'Active', GETDATE(), DATEADD(day, 30, GETDATE()), 2, 0, 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124'),
    
    ('job-002', 'comp-001', 'dept-001', 'pos-002', 'Frontend Developer', 'Join our frontend team to build amazing user experiences.', 
     '3+ years experience, React, TypeScript, CSS, HTML', 'Ha Noi', 'Full-time', 'Permanent', 'Mid', 'Active', GETDATE(), DATEADD(day, 25, GETDATE()), 3, 0, 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124'),
    
    ('job-003', 'comp-001', 'dept-002', 'pos-003', 'Marketing Manager', 'Lead our marketing initiatives and drive growth.', 
     '5+ years marketing experience, Digital marketing, Analytics', 'Da Nang', 'Full-time', 'Permanent', 'Senior', 'Draft', NULL, DATEADD(day, 20, GETDATE()), 1, 0, 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124'),
    
    ('job-004', 'comp-001', 'dept-003', 'pos-004', 'Data Analyst', 'Analyze data to provide business insights and recommendations.', 
     '3+ years experience, SQL, Python, Excel, Statistics', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Mid', 'Active', GETDATE(), DATEADD(day, 35, GETDATE()), 2, 0, 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124'),
    
    ('job-005', 'comp-001', 'dept-004', 'pos-005', 'UX Designer', 'Design intuitive and beautiful user interfaces.', 
     '4+ years UX/UI experience, Figma, Adobe Creative Suite', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Senior', 'Active', GETDATE(), DATEADD(day, 28, GETDATE()), 1, 0, 1, GETDATE(), GETDATE(), '3D287A93-9DE4-48F7-B9ED-26F0A5B0E124');

-- Display summary
SELECT 'Company, departments, positions, and job postings created successfully!' AS Message;
SELECT 'Total Companies: ' + CAST(COUNT(*) AS VARCHAR) AS Companies FROM Companies;
SELECT 'Total Departments: ' + CAST(COUNT(*) AS VARCHAR) AS Departments FROM Departments;
SELECT 'Total Positions: ' + CAST(COUNT(*) AS VARCHAR) AS Positions FROM Positions;
SELECT 'Total Job Postings: ' + CAST(COUNT(*) AS VARCHAR) AS JobPostings FROM JobPostings;
