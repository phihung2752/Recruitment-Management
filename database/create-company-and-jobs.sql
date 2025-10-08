-- =============================================
-- Create Company and Job Postings
-- =============================================

USE HRManagementDB;
GO

-- Create a company first
INSERT INTO Companies (Id, Name, Description, Industry, Website, Email, Phone, Address, City, State, Country, PostalCode, FoundedYear, Size, Status, CreatedAt, UpdatedAt, CreatedById)
VALUES 
    ('comp-001', 'Tech Solutions Inc', 'Leading technology company specializing in software development', 'Technology', 'https://techsolutions.com', 'info@techsolutions.com', '+84-28-1234-5678', '123 Nguyen Hue Street', 'Ho Chi Minh City', 'Ho Chi Minh', 'Vietnam', '700000', 2020, '50-200', 'Active', GETDATE(), GETDATE(), 'user-001');

-- Create departments
INSERT INTO Departments (Id, Name, Description, ManagerId, Budget, Status, CreatedAt, UpdatedAt, CreatedById)
VALUES 
    ('dept-001', 'Engineering', 'Software development and engineering department', 'user-001', 1000000, 'Active', GETDATE(), GETDATE(), 'user-001'),
    ('dept-002', 'Marketing', 'Marketing and communications department', 'user-001', 500000, 'Active', GETDATE(), GETDATE(), 'user-001'),
    ('dept-003', 'Analytics', 'Data analysis and business intelligence department', 'user-001', 300000, 'Active', GETDATE(), GETDATE(), 'user-001'),
    ('dept-004', 'Design', 'User experience and design department', 'user-001', 400000, 'Active', GETDATE(), GETDATE(), 'user-001');

-- Create positions
INSERT INTO Positions (Id, Title, Description, DepartmentId, Level, MinSalary, MaxSalary, Status, CreatedAt, UpdatedAt, CreatedById)
VALUES 
    ('pos-001', 'Senior Software Engineer', 'Senior level software engineering position', 'dept-001', 'Senior', 20000000, 40000000, 'Active', GETDATE(), GETDATE(), 'user-001'),
    ('pos-002', 'Frontend Developer', 'Frontend development position', 'dept-001', 'Mid', 15000000, 25000000, 'Active', GETDATE(), GETDATE(), 'user-001'),
    ('pos-003', 'Marketing Manager', 'Marketing management position', 'dept-002', 'Senior', 18000000, 30000000, 'Active', GETDATE(), GETDATE(), 'user-001'),
    ('pos-004', 'Data Analyst', 'Data analysis position', 'dept-003', 'Mid', 12000000, 20000000, 'Active', GETDATE(), GETDATE(), 'user-001'),
    ('pos-005', 'UX Designer', 'User experience design position', 'dept-004', 'Senior', 16000000, 28000000, 'Active', GETDATE(), GETDATE(), 'user-001');

-- Now insert job postings
INSERT INTO JobPostings (Id, CompanyId, DepartmentId, PositionId, Title, Description, Requirements, Location, WorkType, EmploymentType, ExperienceLevel, Status, PublishedAt, ApplicationDeadline, NumberOfPositions, InternalPosting, ExternalPosting, CreatedAt, UpdatedAt, CreatedById)
VALUES 
    ('job-001', 'comp-001', 'dept-001', 'pos-001', 'Senior Software Engineer', 'We are looking for an experienced software engineer to join our development team.', 
     '5+ years experience, C#, .NET, SQL Server, React', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Senior', 'Active', GETDATE(), DATEADD(day, 30, GETDATE()), 2, 0, 1, GETDATE(), GETDATE(), 'user-001'),
    
    ('job-002', 'comp-001', 'dept-001', 'pos-002', 'Frontend Developer', 'Join our frontend team to build amazing user experiences.', 
     '3+ years experience, React, TypeScript, CSS, HTML', 'Ha Noi', 'Full-time', 'Permanent', 'Mid', 'Active', GETDATE(), DATEADD(day, 25, GETDATE()), 3, 0, 1, GETDATE(), GETDATE(), 'user-001'),
    
    ('job-003', 'comp-001', 'dept-002', 'pos-003', 'Marketing Manager', 'Lead our marketing initiatives and drive growth.', 
     '5+ years marketing experience, Digital marketing, Analytics', 'Da Nang', 'Full-time', 'Permanent', 'Senior', 'Draft', NULL, DATEADD(day, 20, GETDATE()), 1, 0, 1, GETDATE(), GETDATE(), 'user-001'),
    
    ('job-004', 'comp-001', 'dept-003', 'pos-004', 'Data Analyst', 'Analyze data to provide business insights and recommendations.', 
     '3+ years experience, SQL, Python, Excel, Statistics', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Mid', 'Active', GETDATE(), DATEADD(day, 35, GETDATE()), 2, 0, 1, GETDATE(), GETDATE(), 'user-001'),
    
    ('job-005', 'comp-001', 'dept-004', 'pos-005', 'UX Designer', 'Design intuitive and beautiful user interfaces.', 
     '4+ years UX/UI experience, Figma, Adobe Creative Suite', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Senior', 'Active', GETDATE(), DATEADD(day, 28, GETDATE()), 1, 0, 1, GETDATE(), GETDATE(), 'user-001');

-- Display summary
SELECT 'Company, departments, positions, and job postings created successfully!' AS Message;
SELECT 'Total Companies: ' + CAST(COUNT(*) AS VARCHAR) AS Companies FROM Companies;
SELECT 'Total Departments: ' + CAST(COUNT(*) AS VARCHAR) AS Departments FROM Departments;
SELECT 'Total Positions: ' + CAST(COUNT(*) AS VARCHAR) AS Positions FROM Positions;
SELECT 'Total Job Postings: ' + CAST(COUNT(*) AS VARCHAR) AS JobPostings FROM JobPostings;

