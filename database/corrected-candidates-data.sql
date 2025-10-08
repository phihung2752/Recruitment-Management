-- =============================================
-- Sample Candidates Data for HR Management System
-- Corrected for actual database schema
-- =============================================

USE HRManagementDB;
GO

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM Candidates;
-- DELETE FROM JobPostings;
-- DELETE FROM Interviews;
-- DELETE FROM Users;

-- Insert sample users first
INSERT INTO Users (Id, Username, Email, PasswordHash, Salt, FirstName, LastName, IsActive, CreatedAt, UpdatedAt)
VALUES 
    ('user-001', 'admin', 'admin@company.com', 'hashed_password_1', 'salt_1', 'Admin', 'User', 1, GETDATE(), GETDATE()),
    ('user-002', 'hr_manager', 'hr@company.com', 'hashed_password_2', 'salt_2', 'HR', 'Manager', 1, GETDATE(), GETDATE()),
    ('user-003', 'recruiter1', 'recruiter1@company.com', 'hashed_password_3', 'salt_3', 'John', 'Smith', 1, GETDATE(), GETDATE()),
    ('user-004', 'recruiter2', 'recruiter2@company.com', 'hashed_password_4', 'salt_4', 'Jane', 'Doe', 1, GETDATE(), GETDATE()),
    ('user-005', 'interviewer1', 'interviewer1@company.com', 'hashed_password_5', 'salt_5', 'Mike', 'Johnson', 1, GETDATE(), GETDATE());

-- Insert sample job postings
INSERT INTO JobPostings (Id, Title, Description, Requirements, Location, WorkType, EmploymentType, ExperienceLevel, Status, PublishedAt, ApplicationDeadline, NumberOfPositions, CreatedAt, UpdatedAt, CreatedById)
VALUES 
    ('job-001', 'Senior Software Engineer', 'We are looking for an experienced software engineer to join our development team.', 
     '5+ years experience, C#, .NET, SQL Server, React', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Senior', 'Active', GETDATE(), DATEADD(day, 30, GETDATE()), 2, GETDATE(), GETDATE(), 'user-002'),
    
    ('job-002', 'Frontend Developer', 'Join our frontend team to build amazing user experiences.', 
     '3+ years experience, React, TypeScript, CSS, HTML', 'Ha Noi', 'Full-time', 'Permanent', 'Mid', 'Active', GETDATE(), DATEADD(day, 25, GETDATE()), 3, GETDATE(), GETDATE(), 'user-002'),
    
    ('job-003', 'Marketing Manager', 'Lead our marketing initiatives and drive growth.', 
     '5+ years marketing experience, Digital marketing, Analytics', 'Da Nang', 'Full-time', 'Permanent', 'Senior', 'Active', GETDATE(), DATEADD(day, 20, GETDATE()), 1, GETDATE(), GETDATE(), 'user-002'),
    
    ('job-004', 'Data Analyst', 'Analyze data to provide business insights and recommendations.', 
     '3+ years experience, SQL, Python, Excel, Statistics', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Mid', 'Active', GETDATE(), DATEADD(day, 35, GETDATE()), 2, GETDATE(), GETDATE(), 'user-002'),
    
    ('job-005', 'UX Designer', 'Design intuitive and beautiful user interfaces.', 
     '4+ years UX/UI experience, Figma, Adobe Creative Suite', 'Ho Chi Minh City', 'Full-time', 'Permanent', 'Senior', 'Active', GETDATE(), DATEADD(day, 28, GETDATE()), 1, GETDATE(), GETDATE(), 'user-002');

-- Insert sample candidates
INSERT INTO Candidates (Id, FirstName, LastName, Email, Phone, CurrentPosition, CurrentCompany, Location, YearsOfExperience, Skills, Education, ExpectedSalary, Currency, Status, Source, Notes, CreatedAt, UpdatedAt)
VALUES 
    -- Software Engineers
    ('cand-001', 'Nguyễn', 'Văn An', 'nguyen.van.an@email.com', '0901234567', 'Senior Software Engineer', 
     'FPT Software', 'Ho Chi Minh City', '6 years', 'C#, .NET Core, SQL Server, React, Azure', 'Bachelor in Computer Science - HCMUT', 28000000, 'VND', 'Applied', 'LinkedIn', 
     'Strong technical background, good communication skills', GETDATE(), GETDATE()),
    
    ('cand-002', 'Trần', 'Thị Bình', 'tran.thi.binh@email.com', '0901234568', 'Senior Software Engineer', 
     'TMA Solutions', 'Ho Chi Minh City', '7 years', 'C#, .NET, Entity Framework, Angular, Docker', 'Master in Software Engineering - VNU', 30000000, 'VND', 'Interviewed', 'JobStreet', 
     'Excellent problem-solving skills, team player', GETDATE(), GETDATE()),
    
    ('cand-003', 'Lê', 'Minh Cường', 'le.minh.cuong@email.com', '0901234569', 'Senior Software Engineer', 
     'CMC Corporation', 'Ho Chi Minh City', '5 years', 'C#, ASP.NET, SQL Server, JavaScript, Git', 'Bachelor in IT - UIT', 26000000, 'VND', 'Hired', 'Company Website', 
     'Passed all technical interviews, ready to start', GETDATE(), GETDATE()),
    
    -- Frontend Developers
    ('cand-004', 'Phạm', 'Thị Dung', 'pham.thi.dung@email.com', '0901234570', 'Frontend Developer', 
     'Viettel Solutions', 'Ha Noi', '4 years', 'React, TypeScript, Next.js, Tailwind CSS, Redux', 'Bachelor in Computer Science - HUST', 20000000, 'VND', 'Applied', 'Facebook', 
     'Creative designer with strong coding skills', GETDATE(), GETDATE()),
    
    ('cand-005', 'Hoàng', 'Văn Em', 'hoang.van.em@email.com', '0901234571', 'Frontend Developer', 
     'Tiki', 'Ho Chi Minh City', '3 years', 'Vue.js, JavaScript, HTML5, CSS3, Webpack', 'Bachelor in IT - PTIT', 18000000, 'VND', 'Interviewed', 'LinkedIn', 
     'Good understanding of modern frontend frameworks', GETDATE(), GETDATE()),
    
    ('cand-006', 'Vũ', 'Thị Phương', 'vu.thi.phuong@email.com', '0901234572', 'Frontend Developer', 
     'Shopee', 'Ho Chi Minh City', '2 years', 'React, JavaScript, CSS, Bootstrap, jQuery', 'Bachelor in Computer Science - UET', 16000000, 'VND', 'Rejected', 'JobStreet', 
     'Junior level, needs more experience', GETDATE(), GETDATE()),
    
    -- Marketing Manager
    ('cand-007', 'Đặng', 'Văn Giang', 'dang.van.giang@email.com', '0901234573', 'Marketing Manager', 
     'Vingroup', 'Da Nang', '6 years', 'Digital Marketing, Google Ads, Facebook Ads, Analytics', 'MBA in Marketing - UEH', 25000000, 'VND', 'Applied', 'LinkedIn', 
     'Proven track record in digital marketing campaigns', GETDATE(), GETDATE()),
    
    ('cand-008', 'Bùi', 'Thị Hoa', 'bui.thi.hoa@email.com', '0901234574', 'Marketing Manager', 
     'Vinamilk', 'Ho Chi Minh City', '5 years', 'Brand Management, Content Marketing, SEO, SEM', 'Master in Marketing - FTU', 23000000, 'VND', 'Interviewed', 'Company Website', 
     'Strong analytical and creative thinking', GETDATE(), GETDATE()),
    
    -- Data Analyst
    ('cand-009', 'Phan', 'Văn Ích', 'phan.van.ich@email.com', '0901234575', 'Data Analyst', 
     'Vietcombank', 'Ho Chi Minh City', '4 years', 'Python, R, SQL, Tableau, Power BI, Statistics', 'Master in Data Science - HUST', 18000000, 'VND', 'Applied', 'LinkedIn', 
     'Strong analytical and statistical skills', GETDATE(), GETDATE()),
    
    ('cand-010', 'Ngô', 'Thị Kim', 'ngo.thi.kim@email.com', '0901234576', 'Data Analyst', 
     'ACB Bank', 'Ho Chi Minh City', '3 years', 'SQL, Excel, Python, Machine Learning, Pandas', 'Bachelor in Statistics - HCMUS', 16000000, 'VND', 'Interviewed', 'JobStreet', 
     'Good with data visualization and reporting', GETDATE(), GETDATE()),
    
    -- UX Designer
    ('cand-011', 'Đinh', 'Văn Long', 'dinh.van.long@email.com', '0901234577', 'UX Designer', 
     'Grab', 'Ho Chi Minh City', '5 years', 'Figma, Adobe XD, Sketch, User Research, Prototyping', 'Bachelor in Design - HCMUS', 24000000, 'VND', 'Applied', 'Behance', 
     'Creative designer with user-centered approach', GETDATE(), GETDATE()),
    
    ('cand-012', 'Lý', 'Thị Mai', 'ly.thi.mai@email.com', '0901234578', 'UX Designer', 
     'MoMo', 'Ho Chi Minh City', '4 years', 'UI/UX Design, Adobe Creative Suite, Figma, InVision', 'Bachelor in Graphic Design - VNU', 22000000, 'VND', 'Interviewed', 'Dribbble', 
     'Strong portfolio, good understanding of user psychology', GETDATE(), GETDATE()),
    
    -- Additional candidates for variety
    ('cand-013', 'Võ', 'Văn Nam', 'vo.van.nam@email.com', '0901234579', 'Senior Software Engineer', 
     'Samsung', 'Ho Chi Minh City', '8 years', 'Java, Spring Boot, Microservices, AWS, Docker', 'Master in Computer Science - HUST', 32000000, 'VND', 'Applied', 'LinkedIn', 
     'Senior developer with cloud experience', GETDATE(), GETDATE()),
    
    ('cand-014', 'Cao', 'Thị Oanh', 'cao.thi.oanh@email.com', '0901234580', 'Frontend Developer', 
     'Zalo', 'Ho Chi Minh City', '3 years', 'React Native, Flutter, JavaScript, TypeScript', 'Bachelor in Mobile Development - FPT', 19000000, 'VND', 'Applied', 'Company Website', 
     'Mobile app development experience', GETDATE(), GETDATE()),
    
    ('cand-015', 'Tôn', 'Văn Phúc', 'ton.van.phuc@email.com', '0901234581', 'Data Analyst', 
     'Viettel', 'Ho Chi Minh City', '5 years', 'Python, SQL, Apache Spark, Hadoop, Machine Learning', 'Master in Data Science - HUST', 20000000, 'VND', 'Hired', 'LinkedIn', 
     'Advanced analytics and machine learning skills', GETDATE(), GETDATE());

-- Insert sample interviews
INSERT INTO Interviews (Id, Title, Type, ScheduledStartTime, ScheduledEndTime, Location, Status, Notes, CreatedAt, UpdatedAt, ScheduledById)
VALUES 
    ('int-001', 'Technical Interview - Senior Software Engineer', 'Technical', 
     DATEADD(day, 2, GETDATE()), DATEADD(hour, 1, DATEADD(day, 2, GETDATE())), 'Office Room A', 'Completed', 
     'Excellent technical skills, good problem-solving approach. Strong in C# and .NET. Recommended for next round.', GETDATE(), GETDATE(), 'user-005'),
    
    ('int-002', 'Technical Interview - Frontend Developer', 'Technical', 
     DATEADD(day, 1, GETDATE()), DATEADD(hour, 1, DATEADD(day, 1, GETDATE())), 'Office Room B', 'Completed', 
     'Good understanding of React and modern frontend development. Needs improvement in TypeScript.', GETDATE(), GETDATE(), 'user-005'),
    
    ('int-003', 'Behavioral Interview - Marketing Manager', 'Behavioral', 
     DATEADD(day, 3, GETDATE()), DATEADD(hour, 1, DATEADD(day, 3, GETDATE())), 'Conference Room', 'Completed', 
     'Strong leadership skills, good strategic thinking. Excellent communication and presentation skills.', GETDATE(), GETDATE(), 'user-002'),
    
    ('int-004', 'Technical Interview - Data Analyst', 'Technical', 
     DATEADD(day, 4, GETDATE()), DATEADD(hour, 1, DATEADD(day, 4, GETDATE())), 'Office Room C', 'Completed', 
     'Good analytical skills, strong in SQL and Python. Good understanding of data visualization.', GETDATE(), GETDATE(), 'user-005'),
    
    ('int-005', 'Portfolio Review - UX Designer', 'Portfolio Review', 
     DATEADD(day, 5, GETDATE()), DATEADD(hour, 1, DATEADD(day, 5, GETDATE())), 'Design Studio', 'Completed', 
     'Excellent design portfolio, strong user research skills. Good understanding of design principles.', GETDATE(), GETDATE(), 'user-002'),
    
    ('int-006', 'Technical Interview - Senior Software Engineer', 'Technical', 
     DATEADD(day, 6, GETDATE()), DATEADD(hour, 1, DATEADD(day, 6, GETDATE())), 'Office Room A', 'Scheduled', 
     'Upcoming technical interview for senior software engineer position.', GETDATE(), GETDATE(), 'user-005'),
    
    ('int-007', 'Technical Interview - Frontend Developer', 'Technical', 
     DATEADD(day, 7, GETDATE()), DATEADD(hour, 1, DATEADD(day, 7, GETDATE())), 'Office Room B', 'Scheduled', 
     'Upcoming technical interview for frontend developer position.', GETDATE(), GETDATE(), 'user-005');

-- Insert sample employees (hired candidates)
INSERT INTO Employees (Id, EmployeeId, HireDate, EmploymentType, WorkLocation, Salary, Currency, Status, CreatedAt, UpdatedAt, CreatedById)
VALUES 
    ('emp-001', 'EMP001', GETDATE(), 'Permanent', 'Ho Chi Minh City', 26000000, 'VND', 'Active', GETDATE(), GETDATE(), 'user-002'),
    ('emp-002', 'EMP002', GETDATE(), 'Permanent', 'Ho Chi Minh City', 20000000, 'VND', 'Active', GETDATE(), GETDATE(), 'user-002');

-- Display summary
SELECT 'Sample data inserted successfully!' AS Message;
SELECT 'Total Users: ' + CAST(COUNT(*) AS VARCHAR) AS Users FROM Users;
SELECT 'Total Job Postings: ' + CAST(COUNT(*) AS VARCHAR) AS JobPostings FROM JobPostings;
SELECT 'Total Candidates: ' + CAST(COUNT(*) AS VARCHAR) AS Candidates FROM Candidates;
SELECT 'Total Interviews: ' + CAST(COUNT(*) AS VARCHAR) AS Interviews FROM Interviews;
SELECT 'Total Employees: ' + CAST(COUNT(*) AS VARCHAR) AS Employees FROM Employees;
