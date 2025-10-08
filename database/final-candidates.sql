-- =============================================
-- Final Candidates Data Insert
-- =============================================

USE HRManagementDB;
GO

-- Insert sample candidates only
INSERT INTO Candidates (Id, FirstName, LastName, Email, Phone, CurrentPosition, CurrentCompany, Location, Skills, Education, ExpectedSalary, Currency, Status, Source, Notes, CreatedAt, UpdatedAt)
VALUES 
    -- Software Engineers
    ('cand-001', 'Nguyễn', 'Văn An', 'nguyen.van.an@email.com', '0901234567', 'Senior Software Engineer', 
     'FPT Software', 'Ho Chi Minh City', 'C#, .NET Core, SQL Server, React, Azure', 'Bachelor in Computer Science - HCMUT', 28000000, 'VND', 'Applied', 'LinkedIn', 
     'Strong technical background, good communication skills', GETDATE(), GETDATE()),
    
    ('cand-002', 'Trần', 'Thị Bình', 'tran.thi.binh@email.com', '0901234568', 'Senior Software Engineer', 
     'TMA Solutions', 'Ho Chi Minh City', 'C#, .NET, Entity Framework, Angular, Docker', 'Master in Software Engineering - VNU', 30000000, 'VND', 'Interviewed', 'JobStreet', 
     'Excellent problem-solving skills, team player', GETDATE(), GETDATE()),
    
    ('cand-003', 'Lê', 'Minh Cường', 'le.minh.cuong@email.com', '0901234569', 'Senior Software Engineer', 
     'CMC Corporation', 'Ho Chi Minh City', 'C#, ASP.NET, SQL Server, JavaScript, Git', 'Bachelor in IT - UIT', 26000000, 'VND', 'Hired', 'Company Website', 
     'Passed all technical interviews, ready to start', GETDATE(), GETDATE()),
    
    -- Frontend Developers
    ('cand-004', 'Phạm', 'Thị Dung', 'pham.thi.dung@email.com', '0901234570', 'Frontend Developer', 
     'Viettel Solutions', 'Ha Noi', 'React, TypeScript, Next.js, Tailwind CSS, Redux', 'Bachelor in Computer Science - HUST', 20000000, 'VND', 'Applied', 'Facebook', 
     'Creative designer with strong coding skills', GETDATE(), GETDATE()),
    
    ('cand-005', 'Hoàng', 'Văn Em', 'hoang.van.em@email.com', '0901234571', 'Frontend Developer', 
     'Tiki', 'Ho Chi Minh City', 'Vue.js, JavaScript, HTML5, CSS3, Webpack', 'Bachelor in IT - PTIT', 18000000, 'VND', 'Interviewed', 'LinkedIn', 
     'Good understanding of modern frontend frameworks', GETDATE(), GETDATE()),
    
    ('cand-006', 'Vũ', 'Thị Phương', 'vu.thi.phuong@email.com', '0901234572', 'Frontend Developer', 
     'Shopee', 'Ho Chi Minh City', 'React, JavaScript, CSS, Bootstrap, jQuery', 'Bachelor in Computer Science - UET', 16000000, 'VND', 'Rejected', 'JobStreet', 
     'Junior level, needs more experience', GETDATE(), GETDATE()),
    
    -- Marketing Manager
    ('cand-007', 'Đặng', 'Văn Giang', 'dang.van.giang@email.com', '0901234573', 'Marketing Manager', 
     'Vingroup', 'Da Nang', 'Digital Marketing, Google Ads, Facebook Ads, Analytics', 'MBA in Marketing - UEH', 25000000, 'VND', 'Applied', 'LinkedIn', 
     'Proven track record in digital marketing campaigns', GETDATE(), GETDATE()),
    
    ('cand-008', 'Bùi', 'Thị Hoa', 'bui.thi.hoa@email.com', '0901234574', 'Marketing Manager', 
     'Vinamilk', 'Ho Chi Minh City', 'Brand Management, Content Marketing, SEO, SEM', 'Master in Marketing - FTU', 23000000, 'VND', 'Interviewed', 'Company Website', 
     'Strong analytical and creative thinking', GETDATE(), GETDATE()),
    
    -- Data Analyst
    ('cand-009', 'Phan', 'Văn Ích', 'phan.van.ich@email.com', '0901234575', 'Data Analyst', 
     'Vietcombank', 'Ho Chi Minh City', 'Python, R, SQL, Tableau, Power BI, Statistics', 'Master in Data Science - HUST', 18000000, 'VND', 'Applied', 'LinkedIn', 
     'Strong analytical and statistical skills', GETDATE(), GETDATE()),
    
    ('cand-010', 'Ngô', 'Thị Kim', 'ngo.thi.kim@email.com', '0901234576', 'Data Analyst', 
     'ACB Bank', 'Ho Chi Minh City', 'SQL, Excel, Python, Machine Learning, Pandas', 'Bachelor in Statistics - HCMUS', 16000000, 'VND', 'Interviewed', 'JobStreet', 
     'Good with data visualization and reporting', GETDATE(), GETDATE()),
    
    -- UX Designer
    ('cand-011', 'Đinh', 'Văn Long', 'dinh.van.long@email.com', '0901234577', 'UX Designer', 
     'Grab', 'Ho Chi Minh City', 'Figma, Adobe XD, Sketch, User Research, Prototyping', 'Bachelor in Design - HCMUS', 24000000, 'VND', 'Applied', 'Behance', 
     'Creative designer with user-centered approach', GETDATE(), GETDATE()),
    
    ('cand-012', 'Lý', 'Thị Mai', 'ly.thi.mai@email.com', '0901234578', 'UX Designer', 
     'MoMo', 'Ho Chi Minh City', 'UI/UX Design, Adobe Creative Suite, Figma, InVision', 'Bachelor in Graphic Design - VNU', 22000000, 'VND', 'Interviewed', 'Dribbble', 
     'Strong portfolio, good understanding of user psychology', GETDATE(), GETDATE()),
    
    -- Additional candidates for variety
    ('cand-013', 'Võ', 'Văn Nam', 'vo.van.nam@email.com', '0901234579', 'Senior Software Engineer', 
     'Samsung', 'Ho Chi Minh City', 'Java, Spring Boot, Microservices, AWS, Docker', 'Master in Computer Science - HUST', 32000000, 'VND', 'Applied', 'LinkedIn', 
     'Senior developer with cloud experience', GETDATE(), GETDATE()),
    
    ('cand-014', 'Cao', 'Thị Oanh', 'cao.thi.oanh@email.com', '0901234580', 'Frontend Developer', 
     'Zalo', 'Ho Chi Minh City', 'React Native, Flutter, JavaScript, TypeScript', 'Bachelor in Mobile Development - FPT', 19000000, 'VND', 'Applied', 'Company Website', 
     'Mobile app development experience', GETDATE(), GETDATE()),
    
    ('cand-015', 'Tôn', 'Văn Phúc', 'ton.van.phuc@email.com', '0901234581', 'Data Analyst', 
     'Viettel', 'Ho Chi Minh City', 'Python, SQL, Apache Spark, Hadoop, Machine Learning', 'Master in Data Science - HUST', 20000000, 'VND', 'Hired', 'LinkedIn', 
     'Advanced analytics and machine learning skills', GETDATE(), GETDATE());

-- Display summary
SELECT 'Candidates data inserted successfully!' AS Message;
SELECT 'Total Candidates: ' + CAST(COUNT(*) AS VARCHAR) AS Candidates FROM Candidates;

