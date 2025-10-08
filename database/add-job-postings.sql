-- =============================================
-- Add Sample Job Postings Data
-- =============================================

USE hr_management_system;

-- Insert sample job postings
INSERT INTO JobPostings (Id, CompanyId, DepartmentId, PositionId, Title, Description, Requirements, Location, WorkType, EmploymentType, ExperienceLevel, Status, PublishedAt, ApplicationDeadline, NumberOfPositions, CreatedAt, UpdatedAt, CreatedById)
VALUES 
    ('job-001', 'comp-001', 'dept-001', 'pos-001', 'Senior Software Engineer', 'We are looking for an experienced software engineer to join our development team.', 
     '5+ years experience, C#, .NET, SQL Server, React', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Senior', 'Active', GETDATE(), DATEADD(day, 30, GETDATE()), 2, GETDATE(), GETDATE(), 'user-001'),
    
    ('job-002', 'comp-001', 'dept-001', 'pos-002', 'Frontend Developer', 'Join our frontend team to build amazing user experiences.', 
     '3+ years experience, React, TypeScript, CSS, HTML', 'Ha Noi', 'Full-time', 'Permanent', 'Mid', 'Active', GETDATE(), DATEADD(day, 25, GETDATE()), 3, GETDATE(), GETDATE(), 'user-001'),
    
    ('job-003', 'comp-001', 'dept-002', 'pos-003', 'Marketing Manager', 'Lead our marketing initiatives and drive growth.', 
     '5+ years marketing experience, Digital marketing, Analytics', 'Da Nang', 'Full-time', 'Permanent', 'Senior', 'Draft', NULL, DATEADD(day, 20, GETDATE()), 1, GETDATE(), GETDATE(), 'user-001'),
    
    ('job-004', 'comp-001', 'dept-003', 'pos-004', 'Data Analyst', 'Analyze data to provide business insights and recommendations.', 
     '3+ years experience, SQL, Python, Excel, Statistics', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Mid', 'Active', GETDATE(), DATEADD(day, 35, GETDATE()), 2, GETDATE(), GETDATE(), 'user-001'),
    
    ('job-005', 'comp-001', 'dept-004', 'pos-005', 'UX Designer', 'Design intuitive and beautiful user interfaces.', 
     '4+ years UX/UI experience, Figma, Adobe Creative Suite', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Senior', 'Active', GETDATE(), DATEADD(day, 28, GETDATE()), 1, GETDATE(), GETDATE(), 'user-001');

-- Display summary
SELECT 'Job postings data added successfully!' AS Message;
SELECT 'Total Job Postings: ' + CAST(COUNT(*) AS VARCHAR) AS JobPostings FROM JobPostings;
