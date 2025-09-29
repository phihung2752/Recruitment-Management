-- Dữ liệu mẫu tiếng Việt cho hệ thống HR Management

-- Thêm dữ liệu Companies
INSERT INTO Companies (Name, Address, Phone, Email, Website, Industry, Size, Description) VALUES
('Công ty TNHH Công nghệ ABC', '123 Đường Nguyễn Huệ, Quận 1, TP.HCM', '+84 28 1234 5678', 'contact@abc-tech.vn', 'https://abc-tech.vn', 'Công nghệ thông tin', 'Medium', 'Công ty phát triển phần mềm hàng đầu Việt Nam'),
('Tập đoàn XYZ', '456 Đường Lê Lợi, Quận 3, TP.HCM', '+84 28 8765 4321', 'info@xyz-group.vn', 'https://xyz-group.vn', 'Thương mại điện tử', 'Large', 'Tập đoàn thương mại điện tử lớn nhất Đông Nam Á');

-- Thêm dữ liệu Departments
INSERT INTO Departments (CompanyId, Name, Description, ManagerId, Budget, Location) VALUES
(1, 'Phòng Nhân sự', 'Quản lý nhân sự và tuyển dụng', NULL, 500000000, 'Tầng 2'),
(1, 'Phòng Công nghệ thông tin', 'Phát triển và bảo trì hệ thống', NULL, 2000000000, 'Tầng 3-4'),
(1, 'Phòng Marketing', 'Tiếp thị và quảng bá thương hiệu', NULL, 800000000, 'Tầng 5'),
(1, 'Phòng Bán hàng', 'Kinh doanh và chăm sóc khách hàng', NULL, 1200000000, 'Tầng 6'),
(1, 'Phòng Thiết kế', 'Thiết kế UI/UX và đồ họa', NULL, 600000000, 'Tầng 7');

-- Thêm dữ liệu Positions
INSERT INTO Positions (DepartmentId, Title, Description, Level, MinSalary, MaxSalary, RequiredSkills, RequiredExperience) VALUES
(1, 'Chuyên viên Nhân sự', 'Tuyển dụng và quản lý nhân viên', 'Mid-level', 15000000, 25000000, 'Tuyển dụng, Quản lý nhân sự, Giao tiếp', 2),
(1, 'Trưởng phòng Nhân sự', 'Quản lý toàn bộ hoạt động nhân sự', 'Senior', 30000000, 50000000, 'Lãnh đạo, Quản lý, Chiến lược HR', 5),
(2, 'Lập trình viên Frontend', 'Phát triển giao diện người dùng', 'Mid-level', 20000000, 35000000, 'React, JavaScript, HTML/CSS', 2),
(2, 'Lập trình viên Backend', 'Phát triển API và hệ thống backend', 'Mid-level', 22000000, 38000000, 'Node.js, .NET, SQL Server', 3),
(2, 'Tech Lead', 'Dẫn dắt team kỹ thuật', 'Senior', 40000000, 70000000, 'Lãnh đạo kỹ thuật, Architecture, Mentoring', 5),
(3, 'Chuyên viên Marketing Digital', 'Quản lý marketing online', 'Mid-level', 18000000, 30000000, 'SEO, Google Ads, Social Media', 2),
(4, 'Nhân viên Kinh doanh', 'Tìm kiếm và chăm sóc khách hàng', 'Junior', 12000000, 20000000, 'Bán hàng, Giao tiếp, CRM', 1),
(5, 'UI/UX Designer', 'Thiết kế giao diện và trải nghiệm người dùng', 'Mid-level', 18000000, 32000000, 'Figma, Adobe XD, User Research', 2);

-- Thêm dữ liệu Users
INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, Role, IsActive, CreatedAt) VALUES
('admin', 'admin@abc-tech.vn', 'hashed_password_123', 'Nguyễn', 'Văn Admin', 'Admin', 1, GETDATE()),
('hr.manager', 'hr.manager@abc-tech.vn', 'hashed_password_456', 'Trần', 'Thị Hương', 'HR_Manager', 1, GETDATE()),
('recruiter1', 'recruiter1@abc-tech.vn', 'hashed_password_789', 'Lê', 'Văn Tuyển', 'Recruiter', 1, GETDATE()),
('recruiter2', 'recruiter2@abc-tech.vn', 'hashed_password_101', 'Phạm', 'Thị Mai', 'Recruiter', 1, GETDATE()),
('employee1', 'employee1@abc-tech.vn', 'hashed_password_112', 'Hoàng', 'Văn Đức', 'Employee', 1, GETDATE());

-- Thêm dữ liệu Employees
INSERT INTO Employees (UserId, EmployeeId, CompanyId, DepartmentId, PositionId, FirstName, LastName, Email, Phone, Address, HireDate, Salary, Status, ManagerId) VALUES
(1, 'EMP001', 1, 1, 2, 'Nguyễn', 'Văn Admin', 'admin@abc-tech.vn', '+84 901 234 567', '123 Đường ABC, Quận 1, TP.HCM', '2020-01-15', 45000000, 'Active', NULL),
(2, 'EMP002', 1, 1, 2, 'Trần', 'Thị Hương', 'hr.manager@abc-tech.vn', '+84 902 345 678', '456 Đường DEF, Quận 3, TP.HCM', '2020-03-01', 40000000, 'Active', 1),
(3, 'EMP003', 1, 1, 1, 'Lê', 'Văn Tuyển', 'recruiter1@abc-tech.vn', '+84 903 456 789', '789 Đường GHI, Quận 5, TP.HCM', '2021-06-15', 22000000, 'Active', 2),
(4, 'EMP004', 1, 1, 1, 'Phạm', 'Thị Mai', 'recruiter2@abc-tech.vn', '+84 904 567 890', '321 Đường JKL, Quận 7, TP.HCM', '2021-08-01', 20000000, 'Active', 2),
(5, 'EMP005', 1, 2, 3, 'Hoàng', 'Văn Đức', 'employee1@abc-tech.vn', '+84 905 678 901', '654 Đường MNO, Quận 2, TP.HCM', '2022-01-10', 28000000, 'Active', NULL);

-- Thêm dữ liệu JobPostings
INSERT INTO JobPostings (CompanyId, DepartmentId, PositionId, Title, Description, Requirements, Benefits, Status, PostedDate, ExpirationDate, CreatedBy, Salary, Location, JobType, ExperienceLevel) VALUES
(1, 2, 3, 'Lập trình viên Frontend Senior', 'Tìm kiếm lập trình viên Frontend có kinh nghiệm để tham gia dự án phát triển ứng dụng web hiện đại', 'React, TypeScript, HTML/CSS, Git, 3+ năm kinh nghiệm', 'Lương cạnh tranh, bảo hiểm đầy đủ, môi trường làm việc năng động', 'Published', '2024-01-15', '2024-02-15', 3, 30000000, 'TP.HCM', 'Full-time', 'Senior'),
(1, 2, 4, 'Lập trình viên Backend .NET', 'Phát triển và bảo trì hệ thống backend sử dụng .NET Core', '.NET Core, SQL Server, API Design, 2+ năm kinh nghiệm', 'Lương từ 22-38 triệu, thưởng hiệu suất, đào tạo nâng cao', 'Published', '2024-01-10', '2024-02-10', 3, 30000000, 'TP.HCM', 'Full-time', 'Mid-level'),
(1, 3, 6, 'Chuyên viên Marketing Digital', 'Quản lý và thực hiện các chiến dịch marketing online', 'SEO, Google Ads, Facebook Ads, Analytics, 2+ năm kinh nghiệm', 'Lương 18-30 triệu, hoa hồng hấp dẫn, cơ hội thăng tiến', 'Published', '2024-01-20', '2024-02-20', 4, 24000000, 'TP.HCM', 'Full-time', 'Mid-level'),
(1, 4, 7, 'Nhân viên Kinh doanh B2B', 'Tìm kiếm và phát triển khách hàng doanh nghiệp', 'Kỹ năng bán hàng, giao tiếp tốt, am hiểu thị trường B2B', 'Lương cơ bản + hoa hồng cao, xe công ty, laptop', 'Published', '2024-01-12', '2024-02-12', 4, 16000000, 'TP.HCM', 'Full-time', 'Junior'),
(1, 5, 8, 'UI/UX Designer', 'Thiết kế giao diện và trải nghiệm người dùng cho các sản phẩm digital', 'Figma, Adobe XD, User Research, Portfolio mạnh', 'Lương 18-32 triệu, môi trường sáng tạo, công cụ thiết kế hiện đại', 'Published', '2024-01-18', '2024-02-18', 3, 25000000, 'TP.HCM', 'Full-time', 'Mid-level');

-- Thêm dữ liệu Candidates
INSERT INTO Candidates (FirstName, LastName, Email, Phone, Address, DateOfBirth, Gender, Education, Experience, Skills, ResumeUrl, Status, Source, AppliedDate, Notes) VALUES
('Nguyễn', 'Văn Anh', 'nguyenvananh@email.com', '+84 911 111 111', '123 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM', '1995-05-15', 'Male', 'Đại học Bách Khoa TP.HCM - Khoa CNTT', 3, 'React, JavaScript, TypeScript, Node.js', 'https://drive.google.com/file/d/abc123', 'Interview', 'LinkedIn', '2024-01-16', 'Ứng viên có kinh nghiệm tốt với React'),
('Trần', 'Thị Bình', 'tranthibinh@email.com', '+84 922 222 222', '456 Đường Võ Văn Tần, Quận 3, TP.HCM', '1993-08-20', 'Female', 'Đại học Kinh tế TP.HCM - Marketing', 4, 'SEO, Google Ads, Facebook Marketing, Analytics', 'https://drive.google.com/file/d/def456', 'Screening', 'VietnamWorks', '2024-01-21', 'Có kinh nghiệm quản lý chiến dịch lớn'),
('Lê', 'Hoàng Cường', 'lehoangcuong@email.com', '+84 933 333 333', '789 Đường Lý Tự Trọng, Quận 1, TP.HCM', '1992-12-10', 'Male', 'Đại học FPT - Công nghệ phần mềm', 5, '.NET Core, SQL Server, Azure, Microservices', 'https://drive.google.com/file/d/ghi789', 'Offer', 'TopCV', '2024-01-11', 'Ứng viên xuất sắc, có kinh nghiệm với hệ thống lớn'),
('Phạm', 'Thị Dung', 'phamthidung@email.com', '+84 944 444 444', '321 Đường Nguyễn Thị Minh Khai, Quận 1, TP.HCM', '1996-03-25', 'Female', 'Đại học Mỹ thuật TP.HCM - Thiết kế đồ họa', 2, 'Figma, Adobe XD, Photoshop, User Research', 'https://drive.google.com/file/d/jkl012', 'New', 'JobStreet', '2024-01-19', 'Portfolio ấn tượng, thiết kế sáng tạo'),
('Hoàng', 'Văn Em', 'hoangvanem@email.com', '+84 955 555 555', '654 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM', '1994-07-08', 'Male', 'Đại học Ngoại thương - Quản trị kinh doanh', 3, 'Bán hàng B2B, CRM, Đàm phán, Quản lý khách hàng', 'https://drive.google.com/file/d/mno345', 'Interview', 'Referral', '2024-01-13', 'Có mạng lưới khách hàng rộng');

-- Thêm dữ liệu JobApplications
INSERT INTO JobApplications (JobPostingId, CandidateId, ApplicationDate, Status, CoverLetter, ResumeUrl, Notes) VALUES
(1, 1, '2024-01-16', 'Interview', 'Tôi rất quan tâm đến vị trí Frontend Developer tại công ty...', 'https://drive.google.com/file/d/abc123', 'Ứng viên phù hợp với yêu cầu'),
(2, 3, '2024-01-11', 'Offer', 'Với 5 năm kinh nghiệm .NET, tôi tin rằng...', 'https://drive.google.com/file/d/ghi789', 'Ứng viên xuất sắc'),
(3, 2, '2024-01-21', 'Screening', 'Tôi có 4 năm kinh nghiệm trong lĩnh vực marketing digital...', 'https://drive.google.com/file/d/def456', 'Đang sàng lọc hồ sơ'),
(4, 5, '2024-01-13', 'Interview', 'Với kinh nghiệm bán hàng B2B, tôi muốn đóng góp...', 'https://drive.google.com/file/d/mno345', 'Lịch phỏng vấn đã được sắp xếp'),
(5, 4, '2024-01-19', 'New', 'Portfolio của tôi thể hiện khả năng thiết kế UI/UX...', 'https://drive.google.com/file/d/jkl012', 'Hồ sơ mới, cần đánh giá');

-- Thêm dữ liệu Interviews
INSERT INTO Interviews (JobApplicationId, InterviewDate, InterviewType, Location, InterviewerIds, Status, Notes, Round, Duration, MeetingLink) VALUES
(1, '2024-01-25 14:00:00', 'Technical', 'Phòng họp A - Tầng 3', '2,5', 'Scheduled', 'Phỏng vấn kỹ thuật về React và JavaScript', 1, 60, 'https://meet.google.com/abc-defg-hij'),
(2, '2024-01-22 10:00:00', 'Final', 'Phòng họp B - Tầng 2', '1,2', 'Completed', 'Phỏng vấn cuối với Ban Giám đốc', 3, 45, 'https://zoom.us/j/123456789'),
(4, '2024-01-26 15:30:00', 'HR', 'Phòng HR - Tầng 2', '3', 'Scheduled', 'Phỏng vấn HR về văn hóa công ty', 1, 30, 'https://teams.microsoft.com/l/meetup-join/xyz');

-- Thêm dữ liệu InterviewFeedback
INSERT INTO InterviewFeedback (InterviewId, InterviewerId, Rating, Comments, Recommendation, TechnicalSkills, CommunicationSkills, CulturalFit, OverallScore) VALUES
(2, 1, 9, 'Ứng viên có kiến thức sâu về .NET và kinh nghiệm thực tế tốt. Giao tiếp rõ ràng và tự tin.', 'Hire', 9, 8, 9, 87),
(2, 2, 8, 'Kỹ năng kỹ thuật tốt, phù hợp với văn hóa công ty. Có thể làm việc độc lập.', 'Hire', 8, 8, 8, 80);

-- Thêm dữ liệu CalendarEvents
INSERT INTO CalendarEvents (Title, Description, StartDate, EndDate, EventType, Location, CreatedBy, Attendees, Status, Priority, MeetingLink, Recurring) VALUES
('Phỏng vấn Nguyễn Văn Anh - Frontend Developer', 'Phỏng vấn kỹ thuật cho vị trí Frontend Developer', '2024-01-25 14:00:00', '2024-01-25 15:00:00', 'Interview', 'Phòng họp A - Tầng 3', 3, '2,5', 'Scheduled', 'High', 'https://meet.google.com/abc-defg-hij', 0),
('Họp đánh giá ứng viên tuần', 'Họp đánh giá và thảo luận về các ứng viên đã phỏng vấn trong tuần', '2024-01-26 09:00:00', '2024-01-26 10:00:00', 'Meeting', 'Phòng họp HR - Tầng 2', 2, '1,2,3,4', 'Scheduled', 'Medium', 'https://teams.microsoft.com/l/meetup-join/weekly-review', 1),
('Phỏng vấn Hoàng Văn Em - Sales', 'Phỏng vấn HR cho vị trí nhân viên kinh doanh', '2024-01-26 15:30:00', '2024-01-26 16:00:00', 'Interview', 'Phòng HR - Tầng 2', 3, '3', 'Scheduled', 'Medium', 'https://teams.microsoft.com/l/meetup-join/xyz', 0),
('Đào tạo quy trình tuyển dụng mới', 'Đào tạo cho team HR về quy trình tuyển dụng được cập nhật', '2024-01-29 10:00:00', '2024-01-29 12:00:00', 'Training', 'Phòng đào tạo - Tầng 1', 2, '2,3,4', 'Scheduled', 'High', NULL, 0);

-- Thêm dữ liệu AttendanceRecords
INSERT INTO AttendanceRecords (EmployeeId, Date, CheckInTime, CheckOutTime, Status, Notes, WorkingHours, OvertimeHours) VALUES
(1, '2024-01-22', '08:30:00', '17:30:00', 'Present', 'Làm việc bình thường', 8.0, 0.0),
(2, '2024-01-22', '08:45:00', '17:45:00', 'Present', 'Họp với team tuyển dụng', 8.0, 0.0),
(3, '2024-01-22', '09:00:00', '18:00:00', 'Present', 'Phỏng vấn ứng viên', 8.0, 1.0),
(4, '2024-01-22', '08:30:00', '17:30:00', 'Present', 'Sàng lọc CV', 8.0, 0.0),
(5, '2024-01-22', '09:15:00', '17:30:00', 'Late', 'Đến muộn do kẹt xe', 7.25, 0.0);

-- Thêm dữ liệu LeaveRequests
INSERT INTO LeaveRequests (EmployeeId, LeaveType, StartDate, EndDate, Reason, Status, ApprovedBy, RequestDate, Days) VALUES
(3, 'Annual', '2024-02-05', '2024-02-07', 'Nghỉ phép thường niên về quê ăn Tết', 'Pending', NULL, '2024-01-20', 3),
(4, 'Sick', '2024-01-23', '2024-01-23', 'Bị cảm lạnh, cần nghỉ dưỡng bệnh', 'Approved', 2, '2024-01-22', 1),
(5, 'Personal', '2024-02-01', '2024-02-01', 'Có việc cá nhân cần giải quyết', 'Pending', NULL, '2024-01-21', 1);

-- Thêm dữ liệu PerformanceReviews
INSERT INTO PerformanceReviews (EmployeeId, ReviewerId, ReviewPeriod, OverallRating, Goals, Achievements, AreasForImprovement, Comments, ReviewDate, Status) VALUES
(3, 2, '2023-Q4', 8.5, 'Tuyển dụng 15 ứng viên chất lượng cho các vị trí IT', 'Đã tuyển được 12 ứng viên, vượt 80% mục tiêu', 'Cần cải thiện kỹ năng đánh giá kỹ thuật', 'Nhân viên có tinh thần trách nhiệm cao, cần đào tạo thêm về kỹ thuật', '2024-01-15', 'Completed'),
(4, 2, '2023-Q4', 7.8, 'Quản lý 20 tin tuyển dụng và sàng lọc 200 CV', 'Hoàn thành tốt việc đăng tin và sàng lọc CV', 'Cần cải thiện kỹ năng phỏng vấn', 'Nhân viên chăm chỉ, cần hỗ trợ thêm về kỹ năng mềm', '2024-01-10', 'Completed');

-- Thêm dữ liệu Notifications
INSERT INTO Notifications (UserId, Title, Message, Type, IsRead, CreatedAt, RelatedEntityType, RelatedEntityId) VALUES
(2, 'Đơn xin nghỉ phép mới', 'Lê Văn Tuyển đã gửi đơn xin nghỉ phép từ 05/02 đến 07/02', 'Leave_Request', 0, GETDATE(), 'LeaveRequest', 1),
(1, 'Ứng viên mới ứng tuyển', 'Có ứng viên mới ứng tuyển vào vị trí UI/UX Designer', 'New_Application', 0, GETDATE(), 'JobApplication', 5),
(3, 'Lịch phỏng vấn hôm nay', 'Bạn có lịch phỏng vấn với Nguyễn Văn Anh lúc 14:00', 'Interview_Reminder', 0, GETDATE(), 'Interview', 1),
(2, 'Báo cáo tuyển dụng tháng', 'Báo cáo tuyển dụng tháng 1 đã sẵn sàng để xem xét', 'Report', 1, DATEADD(day, -1, GETDATE()), 'Report', NULL);

-- Thêm dữ liệu AuditLogs
INSERT INTO AuditLogs (UserId, Action, EntityType, EntityId, OldValues, NewValues, IPAddress, UserAgent, Timestamp) VALUES
(2, 'CREATE', 'JobPosting', 1, NULL, '{"title":"Lập trình viên Frontend Senior","status":"Published"}', '192.168.1.100', 'Mozilla/5.0 Chrome/120.0', GETDATE()),
(3, 'UPDATE', 'Candidate', 1, '{"status":"New"}', '{"status":"Interview"}', '192.168.1.101', 'Mozilla/5.0 Chrome/120.0', GETDATE()),
(2, 'APPROVE', 'LeaveRequest', 2, '{"status":"Pending"}', '{"status":"Approved"}', '192.168.1.100', 'Mozilla/5.0 Chrome/120.0', GETDATE());

-- Thêm dữ liệu EmailTemplates
INSERT INTO EmailTemplates (Name, Subject, Body, Type, IsActive, CreatedBy, Variables) VALUES
('Interview_Invitation', 'Thư mời phỏng vấn - {{position}}', 'Chào {{candidate_name}},\n\nChúng tôi rất vui mừng thông báo rằng hồ sơ của bạn đã được chọn để tham gia vòng phỏng vấn cho vị trí {{position}}.\n\nThời gian: {{interview_date}}\nĐịa điểm: {{location}}\nLink meeting: {{meeting_link}}\n\nVui lòng xác nhận tham gia.\n\nTrân trọng,\nTeam HR', 'Interview', 1, 2, 'candidate_name,position,interview_date,location,meeting_link'),
('Job_Offer', 'Thư mời làm việc - {{position}}', 'Chào {{candidate_name}},\n\nChúng tôi rất vui mừng thông báo rằng bạn đã được chọn cho vị trí {{position}} tại công ty chúng tôi.\n\nMức lương: {{salary}}\nNgày bắt đầu: {{start_date}}\n\nVui lòng phản hồi trong vòng 3 ngày làm việc.\n\nTrân trọng,\nTeam HR', 'Offer', 1, 2, 'candidate_name,position,salary,start_date'),
('Application_Received', 'Xác nhận nhận được đơn ứng tuyển', 'Chào {{candidate_name}},\n\nCảm ơn bạn đã ứng tuyển vào vị trí {{position}} tại công ty chúng tôi.\n\nChúng tôi sẽ xem xét hồ sơ và liên hệ lại trong thời gian sớm nhất.\n\nTrân trọng,\nTeam HR', 'Application', 1, 2, 'candidate_name,position');
