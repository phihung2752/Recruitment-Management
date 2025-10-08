-- =============================================
-- Sample Candidates Data for HR Management System
-- =============================================

USE HRManagementDB;
GO

-- Clear existing data (optional)
-- DELETE FROM Candidates;
-- DELETE FROM JobPostings;
-- DELETE FROM Interviews;
-- DELETE FROM Users;

-- Insert sample users first
INSERT INTO Users (Id, Username, Email, PasswordHash, FirstName, LastName, Role, IsActive, CreatedAt, UpdatedAt)
VALUES 
    ('user-001', 'admin', 'admin@company.com', 'hashed_password_1', 'Admin', 'User', 'Admin', 1, GETDATE(), GETDATE()),
    ('user-002', 'hr_manager', 'hr@company.com', 'hashed_password_2', 'HR', 'Manager', 'HR', 1, GETDATE(), GETDATE()),
    ('user-003', 'recruiter1', 'recruiter1@company.com', 'hashed_password_3', 'John', 'Smith', 'Recruiter', 1, GETDATE(), GETDATE()),
    ('user-004', 'recruiter2', 'recruiter2@company.com', 'hashed_password_4', 'Jane', 'Doe', 'Recruiter', 1, GETDATE(), GETDATE()),
    ('user-005', 'interviewer1', 'interviewer1@company.com', 'hashed_password_5', 'Mike', 'Johnson', 'Interviewer', 1, GETDATE(), GETDATE());

-- Insert sample job postings
INSERT INTO JobPostings (Id, Title, Description, Requirements, Location, Department, Salary, Status, CreatedBy, CreatedAt, UpdatedAt, Deadline)
VALUES 
    ('job-001', 'Senior Software Engineer', 'We are looking for an experienced software engineer to join our development team.', 
     '5+ years experience, C#, .NET, SQL Server, React', 'Ho Chi Minh City', 'IT', 25000000, 'Active', 'user-002', GETDATE(), GETDATE(), DATEADD(day, 30, GETDATE())),
    
    ('job-002', 'Frontend Developer', 'Join our frontend team to build amazing user experiences.', 
     '3+ years experience, React, TypeScript, CSS, HTML', 'Ha Noi', 'IT', 18000000, 'Active', 'user-002', GETDATE(), GETDATE(), DATEADD(day, 25, GETDATE())),
    
    ('job-003', 'Marketing Manager', 'Lead our marketing initiatives and drive growth.', 
     '5+ years marketing experience, Digital marketing, Analytics', 'Da Nang', 'Marketing', 20000000, 'Active', 'user-002', GETDATE(), GETDATE(), DATEADD(day, 20, GETDATE())),
    
    ('job-004', 'Data Analyst', 'Analyze data to provide business insights and recommendations.', 
     '3+ years experience, SQL, Python, Excel, Statistics', 'Ho Chi Minh City', 'Analytics', 15000000, 'Active', 'user-002', GETDATE(), GETDATE(), DATEADD(day, 35, GETDATE())),
    
    ('job-005', 'UX Designer', 'Design intuitive and beautiful user interfaces.', 
     '4+ years UX/UI experience, Figma, Adobe Creative Suite', 'Ho Chi Minh City', 'Design', 22000000, 'Active', 'user-002', GETDATE(), GETDATE(), DATEADD(day, 28, GETDATE()));

-- Insert sample candidates
INSERT INTO Candidates (Id, FirstName, LastName, Email, Phone, Position, Experience, Skills, Education, CurrentCompany, ExpectedSalary, Status, Source, Notes, CreatedAt, UpdatedAt, JobPostingId)
VALUES 
    -- Software Engineers
    ('cand-001', 'Nguyễn', 'Văn An', 'nguyen.van.an@email.com', '0901234567', 'Senior Software Engineer', 
     '6 years', 'C#, .NET Core, SQL Server, React, Azure', 'Bachelor in Computer Science - HCMUT', 'FPT Software', 28000000, 'Applied', 'LinkedIn', 
     'Strong technical background, good communication skills', GETDATE(), GETDATE(), 'job-001'),
    
    ('cand-002', 'Trần', 'Thị Bình', 'tran.thi.binh@email.com', '0901234568', 'Senior Software Engineer', 
     '7 years', 'C#, .NET, Entity Framework, Angular, Docker', 'Master in Software Engineering - VNU', 'TMA Solutions', 30000000, 'Interviewed', 'JobStreet', 
     'Excellent problem-solving skills, team player', GETDATE(), GETDATE(), 'job-001'),
    
    ('cand-003', 'Lê', 'Minh Cường', 'le.minh.cuong@email.com', '0901234569', 'Senior Software Engineer', 
     '5 years', 'C#, ASP.NET, SQL Server, JavaScript, Git', 'Bachelor in IT - UIT', 'CMC Corporation', 26000000, 'Hired', 'Company Website', 
     'Passed all technical interviews, ready to start', GETDATE(), GETDATE(), 'job-001'),
    
    -- Frontend Developers
    ('cand-004', 'Phạm', 'Thị Dung', 'pham.thi.dung@email.com', '0901234570', 'Frontend Developer', 
     '4 years', 'React, TypeScript, Next.js, Tailwind CSS, Redux', 'Bachelor in Computer Science - HUST', 'Viettel Solutions', 20000000, 'Applied', 'Facebook', 
     'Creative designer with strong coding skills', GETDATE(), GETDATE(), 'job-002'),
    
    ('cand-005', 'Hoàng', 'Văn Em', 'hoang.van.em@email.com', '0901234571', 'Frontend Developer', 
     '3 years', 'Vue.js, JavaScript, HTML5, CSS3, Webpack', 'Bachelor in IT - PTIT', 'Tiki', 18000000, 'Interviewed', 'LinkedIn', 
     'Good understanding of modern frontend frameworks', GETDATE(), GETDATE(), 'job-002'),
    
    ('cand-006', 'Vũ', 'Thị Phương', 'vu.thi.phuong@email.com', '0901234572', 'Frontend Developer', 
     '2 years', 'React, JavaScript, CSS, Bootstrap, jQuery', 'Bachelor in Computer Science - UET', 'Shopee', 16000000, 'Rejected', 'JobStreet', 
     'Junior level, needs more experience', GETDATE(), GETDATE(), 'job-002'),
    
    -- Marketing Manager
    ('cand-007', 'Đặng', 'Văn Giang', 'dang.van.giang@email.com', '0901234573', 'Marketing Manager', 
     '6 years', 'Digital Marketing, Google Ads, Facebook Ads, Analytics', 'MBA in Marketing - UEH', 'Vingroup', 25000000, 'Applied', 'LinkedIn', 
     'Proven track record in digital marketing campaigns', GETDATE(), GETDATE(), 'job-003'),
    
    ('cand-008', 'Bùi', 'Thị Hoa', 'bui.thi.hoa@email.com', '0901234574', 'Marketing Manager', 
     '5 years', 'Brand Management, Content Marketing, SEO, SEM', 'Master in Marketing - FTU', 'Vinamilk', 23000000, 'Interviewed', 'Company Website', 
     'Strong analytical and creative thinking', GETDATE(), GETDATE(), 'job-003'),
    
    -- Data Analyst
    ('cand-009', 'Phan', 'Văn Ích', 'phan.van.ich@email.com', '0901234575', 'Data Analyst', 
     '4 years', 'Python, R, SQL, Tableau, Power BI, Statistics', 'Master in Data Science - HUST', 'Vietcombank', 18000000, 'Applied', 'LinkedIn', 
     'Strong analytical and statistical skills', GETDATE(), GETDATE(), 'job-004'),
    
    ('cand-010', 'Ngô', 'Thị Kim', 'ngo.thi.kim@email.com', '0901234576', 'Data Analyst', 
     '3 years', 'SQL, Excel, Python, Machine Learning, Pandas', 'Bachelor in Statistics - HCMUS', 'ACB Bank', 16000000, 'Interviewed', 'JobStreet', 
     'Good with data visualization and reporting', GETDATE(), GETDATE(), 'job-004'),
    
    -- UX Designer
    ('cand-011', 'Đinh', 'Văn Long', 'dinh.van.long@email.com', '0901234577', 'UX Designer', 
     '5 years', 'Figma, Adobe XD, Sketch, User Research, Prototyping', 'Bachelor in Design - HCMUS', 'Grab', 24000000, 'Applied', 'Behance', 
     'Creative designer with user-centered approach', GETDATE(), GETDATE(), 'job-005'),
    
    ('cand-012', 'Lý', 'Thị Mai', 'ly.thi.mai@email.com', '0901234578', 'UX Designer', 
     '4 years', 'UI/UX Design, Adobe Creative Suite, Figma, InVision', 'Bachelor in Graphic Design - VNU', 'MoMo', 22000000, 'Interviewed', 'Dribbble', 
     'Strong portfolio, good understanding of user psychology', GETDATE(), GETDATE(), 'job-005'),
    
    -- Additional candidates for variety
    ('cand-013', 'Võ', 'Văn Nam', 'vo.van.nam@email.com', '0901234579', 'Senior Software Engineer', 
     '8 years', 'Java, Spring Boot, Microservices, AWS, Docker', 'Master in Computer Science - HUST', 'Samsung', 32000000, 'Applied', 'LinkedIn', 
     'Senior developer with cloud experience', GETDATE(), GETDATE(), 'job-001'),
    
    ('cand-014', 'Cao', 'Thị Oanh', 'cao.thi.oanh@email.com', '0901234580', 'Frontend Developer', 
     '3 years', 'React Native, Flutter, JavaScript, TypeScript', 'Bachelor in Mobile Development - FPT', 'Zalo', 19000000, 'Applied', 'Company Website', 
     'Mobile app development experience', GETDATE(), GETDATE(), 'job-002'),
    
    ('cand-015', 'Tôn', 'Văn Phúc', 'ton.van.phuc@email.com', '0901234581', 'Data Analyst', 
     '5 years', 'Python, SQL, Apache Spark, Hadoop, Machine Learning', 'Master in Data Science - HUST', 'Viettel', 20000000, 'Hired', 'LinkedIn', 
     'Advanced analytics and machine learning skills', GETDATE(), GETDATE(), 'job-004');

-- Insert sample interviews
INSERT INTO Interviews (Id, CandidateId, JobPostingId, ScheduledDate, Interviewer, InterviewType, Status, Feedback, Score, CreatedAt, UpdatedAt)
VALUES 
    ('int-001', 'cand-002', 'job-001', DATEADD(day, 2, GETDATE()), 'user-005', 'Technical', 'Completed', 
     'Excellent technical skills, good problem-solving approach. Strong in C# and .NET. Recommended for next round.', 8.5, GETDATE(), GETDATE()),
    
    ('int-002', 'cand-005', 'job-002', DATEADD(day, 1, GETDATE()), 'user-005', 'Technical', 'Completed', 
     'Good understanding of React and modern frontend development. Needs improvement in TypeScript.', 7.0, GETDATE(), GETDATE()),
    
    ('int-003', 'cand-008', 'job-003', DATEADD(day, 3, GETDATE()), 'user-002', 'Behavioral', 'Completed', 
     'Strong leadership skills, good strategic thinking. Excellent communication and presentation skills.', 9.0, GETDATE(), GETDATE()),
    
    ('int-004', 'cand-010', 'job-004', DATEADD(day, 4, GETDATE()), 'user-005', 'Technical', 'Completed', 
     'Good analytical skills, strong in SQL and Python. Good understanding of data visualization.', 7.5, GETDATE(), GETDATE()),
    
    ('int-005', 'cand-012', 'job-005', DATEADD(day, 5, GETDATE()), 'user-002', 'Portfolio Review', 'Completed', 
     'Excellent design portfolio, strong user research skills. Good understanding of design principles.', 8.0, GETDATE(), GETDATE()),
    
    ('int-006', 'cand-013', 'job-001', DATEADD(day, 6, GETDATE()), 'user-005', 'Technical', 'Scheduled', 
     'Upcoming technical interview for senior software engineer position.', NULL, GETDATE(), GETDATE()),
    
    ('int-007', 'cand-014', 'job-002', DATEADD(day, 7, GETDATE()), 'user-005', 'Technical', 'Scheduled', 
     'Upcoming technical interview for frontend developer position.', NULL, GETDATE(), GETDATE());

-- Update some candidates status based on interview results
UPDATE Candidates SET Status = 'Hired' WHERE Id = 'cand-003';
UPDATE Candidates SET Status = 'Hired' WHERE Id = 'cand-015';
UPDATE Candidates SET Status = 'Rejected' WHERE Id = 'cand-006';
UPDATE Candidates SET Status = 'Interviewed' WHERE Id IN ('cand-002', 'cand-005', 'cand-008', 'cand-010', 'cand-012');

-- Insert sample employees (hired candidates)
INSERT INTO Employees (Id, EmployeeCode, FirstName, LastName, Email, PhoneNumber, Department, Position, Manager, HireDate, Status, Salary, Location, WorkType, Avatar, CreatedAt, UpdatedAt)
VALUES 
    ('emp-001', 'EMP001', 'Lê', 'Minh Cường', 'le.minh.cuong@company.com', '0901234569', 'IT', 'Senior Software Engineer', 'user-002', GETDATE(), 'Active', 26000000, 'Ho Chi Minh City', 'Full-time', NULL, GETDATE(), GETDATE()),
    ('emp-002', 'EMP002', 'Tôn', 'Văn Phúc', 'ton.van.phuc@company.com', '0901234581', 'Analytics', 'Data Analyst', 'user-002', GETDATE(), 'Active', 20000000, 'Ho Chi Minh City', 'Full-time', NULL, GETDATE(), GETDATE());

-- Display summary
SELECT 'Sample data inserted successfully!' AS Message;
SELECT 'Total Users: ' + CAST(COUNT(*) AS VARCHAR) AS Users FROM Users;
SELECT 'Total Job Postings: ' + CAST(COUNT(*) AS VARCHAR) AS JobPostings FROM JobPostings;
SELECT 'Total Candidates: ' + CAST(COUNT(*) AS VARCHAR) AS Candidates FROM Candidates;
SELECT 'Total Interviews: ' + CAST(COUNT(*) AS VARCHAR) AS Interviews FROM Interviews;
SELECT 'Total Employees: ' + CAST(COUNT(*) AS VARCHAR) AS Employees FROM Employees;
