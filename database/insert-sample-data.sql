-- Insert sample data for HR Management System
USE hr_management_system;

-- Insert sample CV Analysis data
INSERT INTO CVAnalysis (
  candidateName, email, phone, position, aiScore, status, source, sourceName,
  appliedDate, skills, experience, education, expectedSalary, tags,
  isStarCandidate, isReapplicant, applicationCount, lastInterviewDate,
  lastInterviewResult, notes, cvUrl, jobMatch, cvQuality, strengths,
  weaknesses, missingSkills, redFlags, recommendations
) VALUES 
(
  'Nguyễn Văn A', 'nguyen.van.a@email.com', '0901234567', 'Frontend Developer', 92, 'analyzed', 'vietnamworks', 'VietnamWorks',
  '2024-01-20', '["React", "TypeScript", "Node.js", "MongoDB"]', '3 years', 'Đại học Bách Khoa', '15-20 triệu', '["High potential", "Technical expert"]',
  true, false, 1, '2024-01-25', 'Passed', 'Ứng viên tiềm năng, có kinh nghiệm React tốt', '/cvs/nguyen-van-a.pdf', 95, 88,
  '["Strong technical skills", "Relevant experience", "Good education"]', '["Limited leadership experience"]', '["Docker", "Kubernetes"]', '[]',
  '["Consider for technical lead role", "Schedule technical interview"]'
),
(
  'Trần Thị B', 'tran.thi.b@email.com', '0901234568', 'Backend Developer', 78, 'processing', 'topcv', 'TopCV',
  '2024-01-19', '["Java", "Spring Boot", "MySQL", "Docker"]', '2 years', 'Đại học Công nghệ', '12-18 triệu', '["Culture fit"]',
  false, true, 3, '2024-01-15', 'Failed', 'Đã nộp CV 3 lần, cần xem xét kỹ', '/cvs/tran-thi-b.pdf', 75, 70,
  '["Good technical foundation", "Team player"]', '["Limited experience", "Needs more technical depth"]', '["Microservices", "Cloud platforms"]', '["Multiple applications"]',
  '["Consider for junior role", "Provide mentorship"]'
),
(
  'Lê Văn C', 'le.van.c@email.com', '0901234569', 'Full-stack Developer', 85, 'pending', 'linkedin', 'LinkedIn',
  '2024-01-18', '["React", "Node.js", "PostgreSQL", "AWS"]', '4 years', 'Đại học Khoa học Tự nhiên', '20-25 triệu', '["Leadership material"]',
  false, false, 1, NULL, NULL, 'Có kinh nghiệm leadership, phù hợp vị trí senior', '/cvs/le-van-c.pdf', 80, 75,
  '["Full-stack experience", "Good technical skills"]', '["Limited modern framework experience"]', '["Vue.js", "TypeScript"]', '[]',
  '["Consider for senior role", "Schedule technical interview"]'
),
(
  'Phạm Thị D', 'pham.thi.d@email.com', '0901234570', 'UI/UX Designer', 88, 'analyzed', 'email', 'Email trực tiếp',
  '2024-01-17', '["Figma", "Adobe XD", "Sketch", "Prototyping"]', '3 years', 'Đại học Mỹ thuật', '18-22 triệu', '["High potential", "Culture fit"]',
  true, false, 1, '2024-01-22', 'Passed', 'Portfolio ấn tượng, có kinh nghiệm làm việc với startup', '/cvs/pham-thi-d.pdf', 90, 85,
  '["Strong design skills", "Good portfolio", "User-focused"]', '["Limited technical knowledge"]', '["HTML/CSS", "JavaScript"]', '[]',
  '["Consider for senior designer role", "Schedule design review"]'
),
(
  'Hoàng Văn E', 'hoang.van.e@email.com', '0901234571', 'DevOps Engineer', 82, 'analyzed', 'referral', 'Nhân viên giới thiệu',
  '2024-01-16', '["Docker", "Kubernetes", "AWS", "Jenkins"]', '5 years', 'Đại học Bách Khoa', '25-30 triệu', '["Senior level", "Infrastructure expert"]',
  false, false, 1, '2024-01-20', 'Passed', 'Kinh nghiệm DevOps tốt, phù hợp với yêu cầu', '/cvs/hoang-van-e.pdf', 95, 90,
  '["Strong DevOps skills", "Cloud experience", "Automation"]', '["Limited development experience"]', '["Terraform", "Ansible"]', '[]',
  '["Consider for senior role", "Schedule technical interview"]'
);

-- Insert sample Job Postings data
INSERT INTO JobPostings (
  Title, Department, Description, Requirements, Location, EmploymentType, ExperienceLevel, Status,
  ApplicationDeadline, CreatedBy
) VALUES 
(
  'Senior Software Engineer',
  'Engineering',
  'We are looking for an experienced software engineer to join our development team.',
  '5+ years experience, C#, .NET, SQL Server, React',
  'Ho Chi Minh City',
  'Full-time',
  'Senior',
  'Published',
  '2025-02-15',
  1
),
(
  'Frontend Developer',
  'Engineering',
  'Join our frontend team to build amazing user experiences.',
  '3+ years experience, React, TypeScript, CSS, HTML',
  'Ha Noi',
  'Full-time',
  'Mid',
  'Published',
  '2025-02-20',
  1
),
(
  'Marketing Manager',
  'Marketing',
  'Lead our marketing initiatives and drive growth.',
  '5+ years marketing experience, Digital marketing, Analytics',
  'Da Nang',
  'Full-time',
  'Senior',
  'Draft',
  '2025-02-10',
  1
);

-- Insert sample Employees data
INSERT INTO Employees (
  firstName, lastName, email, phone, position, department, manager,
  hireDate, salary, status, employeeType, workLocation, emergencyContact,
  emergencyPhone, address, skills, certifications, performance, attendance, benefits
) VALUES 
(
  'Nguyễn', 'Văn A', 'nguyen.van.a.employee@company.com', '0901234567', 'Senior Frontend Developer', 'Engineering', 'Trần Thị B',
  '2023-01-15', 25000000, 'active', 'full-time', 'Ho Chi Minh City', 'Nguyễn Thị C',
  '0901234568', '123 Đường ABC, Quận 1, TP.HCM', '["React", "TypeScript", "Node.js", "MongoDB"]', '["AWS Certified Developer", "Google Cloud Professional"]',
  '{"rating": 4.5, "lastReview": "2024-01-15", "goals": ["Lead 2 major projects", "Mentor junior developers"]}',
  '{"totalDays": 250, "presentDays": 240, "absentDays": 5, "lateDays": 5}',
  '{"healthInsurance": true, "dentalInsurance": true, "retirementPlan": true, "paidTimeOff": 20}'
),
(
  'Trần', 'Thị B', 'tran.thi.b.employee@company.com', '0901234568', 'Engineering Manager', 'Engineering', 'Giám đốc CTO',
  '2022-06-01', 35000000, 'active', 'full-time', 'Ho Chi Minh City', 'Trần Văn D',
  '0901234569', '456 Đường DEF, Quận 2, TP.HCM', '["Leadership", "Project Management", "Agile", "Scrum"]', '["PMP Certified", "Scrum Master"]',
  '{"rating": 4.8, "lastReview": "2024-01-15", "goals": ["Improve team productivity", "Implement new processes"]}',
  '{"totalDays": 250, "presentDays": 245, "absentDays": 2, "lateDays": 3}',
  '{"healthInsurance": true, "dentalInsurance": true, "retirementPlan": true, "paidTimeOff": 25}'
),
(
  'Lê', 'Văn C', 'le.van.c.employee@company.com', '0901234569', 'Backend Developer', 'Engineering', 'Trần Thị B',
  '2023-03-10', 20000000, 'active', 'full-time', 'Ha Noi', 'Lê Thị E',
  '0901234570', '789 Đường GHI, Quận Ba Đình, Hà Nội', '["Java", "Spring Boot", "MySQL", "Redis"]', '["Oracle Certified Professional"]',
  '{"rating": 4.2, "lastReview": "2024-01-15", "goals": ["Learn microservices", "Improve code quality"]}',
  '{"totalDays": 250, "presentDays": 235, "absentDays": 8, "lateDays": 7}',
  '{"healthInsurance": true, "dentalInsurance": true, "retirementPlan": true, "paidTimeOff": 20}'
);

-- Insert sample Interview Rounds data
INSERT INTO InterviewRounds (
  candidateId, roundNumber, roundName, status, scheduledDate, interviewer, notes, score, feedback
) VALUES 
(1, 1, 'Technical Interview', 'completed', '2024-01-25 10:00:00', 'Nguyễn Văn A', 'Good technical skills', 4.25, 'Strong React knowledge'),
(1, 2, 'HR Interview', 'completed', '2024-01-26 14:00:00', 'Trần Thị B', 'Good cultural fit', 4.50, 'Excellent communication'),
(2, 1, 'Technical Interview', 'completed', '2024-01-15 09:00:00', 'Lê Văn C', 'Needs improvement', 3.25, 'Basic Java knowledge'),
(3, 1, 'Technical Interview', 'scheduled', '2024-01-30 10:00:00', 'Phạm Thị D', NULL, NULL, NULL),
(4, 1, 'Design Review', 'completed', '2024-01-22 15:00:00', 'Hoàng Văn E', 'Excellent portfolio', 4.75, 'Outstanding design skills'),
(5, 1, 'Technical Interview', 'completed', '2024-01-20 11:00:00', 'Nguyễn Văn A', 'Strong DevOps skills', 4.40, 'Good infrastructure knowledge');

-- Insert sample Calendar Events data
INSERT INTO CalendarEvents (
  Title, Description, EventType, StartTime, EndTime, Location, Attendees, CandidateId, Status, Priority, CreatedBy
) VALUES 
(
  'Interview - Nguyễn Văn A',
  'Technical interview for Frontend Developer position',
  'Interview',
  '2024-01-25 10:00:00',
  '2024-01-25 11:00:00',
  'Meeting Room A',
  'nguyen.van.a@email.com, interviewer@company.com',
  1,
  'Completed',
  'High',
  1
),
(
  'Team Meeting',
  'Weekly team standup meeting',
  'Meeting',
  '2024-01-30 09:00:00',
  '2024-01-30 09:30:00',
  'Conference Room B',
  'team@company.com',
  NULL,
  'Scheduled',
  'Medium',
  1
),
(
  'Interview - Lê Văn C',
  'Technical interview for Full-stack Developer position',
  'Interview',
  '2024-01-30 10:00:00',
  '2024-01-30 11:00:00',
  'Meeting Room A',
  'le.van.c@email.com, interviewer@company.com',
  3,
  'Scheduled',
  'High',
  1
);

COMMIT;
