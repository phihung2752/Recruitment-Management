-- Fixed Vietnamese Sample Data for HR Management System
-- This data matches the fixed schema structure

-- Insert System Roles
INSERT INTO Roles (Id, Name, NormalizedName, Description, IsSystemRole) VALUES
(NEWID(), 'SuperAdmin', 'SUPERADMIN', 'System Super Administrator with full access', 1),
(NEWID(), 'Admin', 'ADMIN', 'System Administrator', 1),
(NEWID(), 'HRManager', 'HRMANAGER', 'HR Manager with full HR access', 1),
(NEWID(), 'HRSpecialist', 'HRSPECIALIST', 'HR Specialist with limited HR access', 1),
(NEWID(), 'Recruiter', 'RECRUITER', 'Recruiter with recruitment access', 1),
(NEWID(), 'Manager', 'MANAGER', 'Department Manager', 1),
(NEWID(), 'Employee', 'EMPLOYEE', 'Regular Employee', 1),
(NEWID(), 'Interviewer', 'INTERVIEWER', 'Interview Participant', 1);

-- Insert System Permissions
INSERT INTO Permissions (Id, Name, NormalizedName, Description, Module, Action, Resource) VALUES
-- User Management
(NEWID(), 'users.view', 'USERS.VIEW', 'View users', 'UserManagement', 'View', 'Users'),
(NEWID(), 'users.create', 'USERS.CREATE', 'Create users', 'UserManagement', 'Create', 'Users'),
(NEWID(), 'users.edit', 'USERS.EDIT', 'Edit users', 'UserManagement', 'Edit', 'Users'),
(NEWID(), 'users.delete', 'USERS.DELETE', 'Delete users', 'UserManagement', 'Delete', 'Users'),

-- Employee Management
(NEWID(), 'employees.view', 'EMPLOYEES.VIEW', 'View employees', 'EmployeeManagement', 'View', 'Employees'),
(NEWID(), 'employees.create', 'EMPLOYEES.CREATE', 'Create employees', 'EmployeeManagement', 'Create', 'Employees'),
(NEWID(), 'employees.edit', 'EMPLOYEES.EDIT', 'Edit employees', 'EmployeeManagement', 'Edit', 'Employees'),
(NEWID(), 'employees.delete', 'EMPLOYEES.DELETE', 'Delete employees', 'EmployeeManagement', 'Delete', 'Employees'),

-- Recruitment
(NEWID(), 'jobs.view', 'JOBS.VIEW', 'View job postings', 'Recruitment', 'View', 'JobPostings'),
(NEWID(), 'jobs.create', 'JOBS.CREATE', 'Create job postings', 'Recruitment', 'Create', 'JobPostings'),
(NEWID(), 'jobs.edit', 'JOBS.EDIT', 'Edit job postings', 'Recruitment', 'Edit', 'JobPostings'),
(NEWID(), 'jobs.delete', 'JOBS.DELETE', 'Delete job postings', 'Recruitment', 'Delete', 'JobPostings'),

-- Candidates
(NEWID(), 'candidates.view', 'CANDIDATES.VIEW', 'View candidates', 'Recruitment', 'View', 'Candidates'),
(NEWID(), 'candidates.create', 'CANDIDATES.CREATE', 'Create candidates', 'Recruitment', 'Create', 'Candidates'),
(NEWID(), 'candidates.edit', 'CANDIDATES.EDIT', 'Edit candidates', 'Recruitment', 'Edit', 'Candidates'),
(NEWID(), 'candidates.delete', 'CANDIDATES.DELETE', 'Delete candidates', 'Recruitment', 'Delete', 'Candidates'),

-- Interviews
(NEWID(), 'interviews.view', 'INTERVIEWS.VIEW', 'View interviews', 'Interviews', 'View', 'Interviews'),
(NEWID(), 'interviews.schedule', 'INTERVIEWS.SCHEDULE', 'Schedule interviews', 'Interviews', 'Schedule', 'Interviews'),
(NEWID(), 'interviews.conduct', 'INTERVIEWS.CONDUCT', 'Conduct interviews', 'Interviews', 'Conduct', 'Interviews'),
(NEWID(), 'interviews.feedback', 'INTERVIEWS.FEEDBACK', 'Provide interview feedback', 'Interviews', 'Feedback', 'Interviews'),

-- Calendar
(NEWID(), 'calendar.view', 'CALENDAR.VIEW', 'View calendar', 'Calendar', 'View', 'Calendar'),
(NEWID(), 'calendar.create', 'CALENDAR.CREATE', 'Create calendar events', 'Calendar', 'Create', 'CalendarEvents'),
(NEWID(), 'calendar.edit', 'CALENDAR.EDIT', 'Edit calendar events', 'Calendar', 'Edit', 'CalendarEvents'),
(NEWID(), 'calendar.delete', 'CALENDAR.DELETE', 'Delete calendar events', 'Calendar', 'Delete', 'CalendarEvents'),

-- Analytics
(NEWID(), 'analytics.view', 'ANALYTICS.VIEW', 'View analytics', 'Analytics', 'View', 'Analytics'),
(NEWID(), 'analytics.export', 'ANALYTICS.EXPORT', 'Export analytics data', 'Analytics', 'Export', 'Analytics'),

-- System Settings
(NEWID(), 'settings.view', 'SETTINGS.VIEW', 'View system settings', 'Settings', 'View', 'Settings'),
(NEWID(), 'settings.edit', 'SETTINGS.EDIT', 'Edit system settings', 'Settings', 'Edit', 'Settings');

-- Insert Default Company
INSERT INTO Companies (Id, Name, LegalName, Industry, Address, City, Country, Phone, Email, Website, CreatedAt) VALUES
(NEWID(), 'Công ty TNHH Công nghệ ABC', 'Công ty TNHH Công nghệ ABC', 'Công nghệ thông tin', '123 Đường Nguyễn Huệ, Quận 1', 'TP.HCM', 'Việt Nam', '+84 28 1234 5678', 'contact@abc-tech.vn', 'https://abc-tech.vn', GETDATE());

-- Get Company ID for foreign keys
DECLARE @CompanyId NVARCHAR(36) = (SELECT TOP 1 Id FROM Companies);

-- Insert Departments
INSERT INTO Departments (Id, CompanyId, Name, Description, Budget, Location, CreatedAt) VALUES
(NEWID(), @CompanyId, 'Phòng Nhân sự', 'Quản lý nhân sự và tuyển dụng', 500000000, 'Tầng 2', GETDATE()),
(NEWID(), @CompanyId, 'Phòng Công nghệ thông tin', 'Phát triển và bảo trì hệ thống', 2000000000, 'Tầng 3-4', GETDATE()),
(NEWID(), @CompanyId, 'Phòng Marketing', 'Tiếp thị và quảng bá thương hiệu', 800000000, 'Tầng 5', GETDATE()),
(NEWID(), @CompanyId, 'Phòng Bán hàng', 'Kinh doanh và chăm sóc khách hàng', 1200000000, 'Tầng 6', GETDATE()),
(NEWID(), @CompanyId, 'Phòng Thiết kế', 'Thiết kế UI/UX và đồ họa', 600000000, 'Tầng 7', GETDATE());

-- Get Department IDs
DECLARE @HRDeptId NVARCHAR(36) = (SELECT Id FROM Departments WHERE Name = 'Phòng Nhân sự');
DECLARE @ITDeptId NVARCHAR(36) = (SELECT Id FROM Departments WHERE Name = 'Phòng Công nghệ thông tin');
DECLARE @MarketingDeptId NVARCHAR(36) = (SELECT Id FROM Departments WHERE Name = 'Phòng Marketing');
DECLARE @SalesDeptId NVARCHAR(36) = (SELECT Id FROM Departments WHERE Name = 'Phòng Bán hàng');
DECLARE @DesignDeptId NVARCHAR(36) = (SELECT Id FROM Departments WHERE Name = 'Phòng Thiết kế');

-- Insert Positions
INSERT INTO Positions (Id, DepartmentId, Title, Description, Level, MinSalary, MaxSalary, RequiredSkills, RequiredExperience, CreatedAt) VALUES
(NEWID(), @HRDeptId, 'Chuyên viên Nhân sự', 'Tuyển dụng và quản lý nhân viên', 'Mid-level', 15000000, 25000000, 'Tuyển dụng, Quản lý nhân sự, Giao tiếp', 2, GETDATE()),
(NEWID(), @HRDeptId, 'Trưởng phòng Nhân sự', 'Quản lý toàn bộ hoạt động nhân sự', 'Senior', 30000000, 50000000, 'Lãnh đạo, Quản lý, Chiến lược HR', 5, GETDATE()),
(NEWID(), @ITDeptId, 'Lập trình viên Frontend', 'Phát triển giao diện người dùng', 'Mid-level', 20000000, 35000000, 'React, JavaScript, HTML/CSS', 2, GETDATE()),
(NEWID(), @ITDeptId, 'Lập trình viên Backend', 'Phát triển API và hệ thống backend', 'Mid-level', 22000000, 38000000, 'Node.js, .NET, SQL Server', 3, GETDATE()),
(NEWID(), @ITDeptId, 'Tech Lead', 'Dẫn dắt team kỹ thuật', 'Senior', 40000000, 70000000, 'Lãnh đạo kỹ thuật, Architecture, Mentoring', 5, GETDATE()),
(NEWID(), @MarketingDeptId, 'Chuyên viên Marketing Digital', 'Quản lý marketing online', 'Mid-level', 18000000, 30000000, 'SEO, Google Ads, Social Media', 2, GETDATE()),
(NEWID(), @SalesDeptId, 'Nhân viên Kinh doanh', 'Tìm kiếm và chăm sóc khách hàng', 'Junior', 12000000, 20000000, 'Bán hàng, Giao tiếp, CRM', 1, GETDATE()),
(NEWID(), @DesignDeptId, 'UI/UX Designer', 'Thiết kế giao diện và trải nghiệm người dùng', 'Mid-level', 18000000, 32000000, 'Figma, Adobe XD, User Research', 2, GETDATE());

-- Get Position IDs
DECLARE @HRSpecialistPosId NVARCHAR(36) = (SELECT Id FROM Positions WHERE Title = 'Chuyên viên Nhân sự');
DECLARE @HRManagerPosId NVARCHAR(36) = (SELECT Id FROM Positions WHERE Title = 'Trưởng phòng Nhân sự');
DECLARE @FrontendDevPosId NVARCHAR(36) = (SELECT Id FROM Positions WHERE Title = 'Lập trình viên Frontend');
DECLARE @BackendDevPosId NVARCHAR(36) = (SELECT Id FROM Positions WHERE Title = 'Lập trình viên Backend');
DECLARE @TechLeadPosId NVARCHAR(36) = (SELECT Id FROM Positions WHERE Title = 'Tech Lead');
DECLARE @MarketingPosId NVARCHAR(36) = (SELECT Id FROM Positions WHERE Title = 'Chuyên viên Marketing Digital');
DECLARE @SalesPosId NVARCHAR(36) = (SELECT Id FROM Positions WHERE Title = 'Nhân viên Kinh doanh');
DECLARE @DesignerPosId NVARCHAR(36) = (SELECT Id FROM Positions WHERE Title = 'UI/UX Designer');

-- Insert Users
INSERT INTO Users (Id, Username, Email, PasswordHash, Salt, FirstName, LastName, PhoneNumber, IsActive, CreatedAt) VALUES
(NEWID(), 'admin', 'admin@abc-tech.vn', 'AQAAAAIAAYagAAAAELTUqpep1pOsWvkUjgXUTiZPiVhGRwHmHSIVxLOwiOxBzqKc5qRqiQpD0+5Q5TPBAQ==', 'randomsalt123', 'Nguyễn', 'Văn Admin', '+84 901 234 567', 1, GETDATE()),
(NEWID(), 'hr.manager', 'hr.manager@abc-tech.vn', 'AQAAAAIAAYagAAAAELTUqpep1pOsWvkUjgXUTiZPiVhGRwHmHSIVxLOwiOxBzqKc5qRqiQpD0+5Q5TPBAQ==', 'randomsalt456', 'Trần', 'Thị Hương', '+84 902 345 678', 1, GETDATE()),
(NEWID(), 'recruiter1', 'recruiter1@abc-tech.vn', 'AQAAAAIAAYagAAAAELTUqpep1pOsWvkUjgXUTiZPiVhGRwHmHSIVxLOwiOxBzqKc5qRqiQpD0+5Q5TPBAQ==', 'randomsalt789', 'Lê', 'Văn Tuyển', '+84 903 456 789', 1, GETDATE()),
(NEWID(), 'recruiter2', 'recruiter2@abc-tech.vn', 'AQAAAAIAAYagAAAAELTUqpep1pOsWvkUjgXUTiZPiVhGRwHmHSIVxLOwiOxBzqKc5qRqiQpD0+5Q5TPBAQ==', 'randomsalt101', 'Phạm', 'Thị Mai', '+84 904 567 890', 1, GETDATE()),
(NEWID(), 'employee1', 'employee1@abc-tech.vn', 'AQAAAAIAAYagAAAAELTUqpep1pOsWvkUjgXUTiZPiVhGRwHmHSIVxLOwiOxBzqKc5qRqiQpD0+5Q5TPBAQ==', 'randomsalt112', 'Hoàng', 'Văn Đức', '+84 905 678 901', 1, GETDATE());

-- Get User IDs
DECLARE @AdminUserId NVARCHAR(36) = (SELECT Id FROM Users WHERE Username = 'admin');
DECLARE @HRManagerUserId NVARCHAR(36) = (SELECT Id FROM Users WHERE Username = 'hr.manager');
DECLARE @Recruiter1UserId NVARCHAR(36) = (SELECT Id FROM Users WHERE Username = 'recruiter1');
DECLARE @Recruiter2UserId NVARCHAR(36) = (SELECT Id FROM Users WHERE Username = 'recruiter2');
DECLARE @Employee1UserId NVARCHAR(36) = (SELECT Id FROM Users WHERE Username = 'employee1');

-- Insert Employees
INSERT INTO Employees (Id, UserId, EmployeeId, CompanyId, DepartmentId, PositionId, HireDate, EmploymentType, WorkLocation, Salary, Currency, Status, CreatedAt) VALUES
(NEWID(), @AdminUserId, 'EMP001', @CompanyId, @HRDeptId, @HRManagerPosId, '2020-01-15', 'Full-time', 'TP.HCM', 45000000, 'VND', 'Active', GETDATE()),
(NEWID(), @HRManagerUserId, 'EMP002', @CompanyId, @HRDeptId, @HRManagerPosId, '2020-03-01', 'Full-time', 'TP.HCM', 40000000, 'VND', 'Active', GETDATE()),
(NEWID(), @Recruiter1UserId, 'EMP003', @CompanyId, @HRDeptId, @HRSpecialistPosId, '2021-06-15', 'Full-time', 'TP.HCM', 22000000, 'VND', 'Active', GETDATE()),
(NEWID(), @Recruiter2UserId, 'EMP004', @CompanyId, @HRDeptId, @HRSpecialistPosId, '2021-08-01', 'Full-time', 'TP.HCM', 20000000, 'VND', 'Active', GETDATE()),
(NEWID(), @Employee1UserId, 'EMP005', @CompanyId, @ITDeptId, @FrontendDevPosId, '2022-01-10', 'Full-time', 'TP.HCM', 28000000, 'VND', 'Active', GETDATE());

-- Insert Job Postings
INSERT INTO JobPostings (Id, CompanyId, DepartmentId, PositionId, Title, Description, Requirements, Benefits, SalaryMin, SalaryMax, Currency, Location, WorkType, EmploymentType, ExperienceLevel, Status, PublishedAt, CreatedAt, CreatedById) VALUES
(NEWID(), @CompanyId, @ITDeptId, @FrontendDevPosId, 'Lập trình viên Frontend Senior', 'Tìm kiếm lập trình viên Frontend có kinh nghiệm để tham gia dự án phát triển ứng dụng web hiện đại', 'React, TypeScript, HTML/CSS, Git, 3+ năm kinh nghiệm', 'Lương cạnh tranh, bảo hiểm đầy đủ, môi trường làm việc năng động', 30000000, 35000000, 'VND', 'TP.HCM', 'On-site', 'Full-time', 'Senior', 'Published', GETDATE(), GETDATE(), @Recruiter1UserId),
(NEWID(), @CompanyId, @ITDeptId, @BackendDevPosId, 'Lập trình viên Backend .NET', 'Phát triển và bảo trì hệ thống backend sử dụng .NET Core', '.NET Core, SQL Server, API Design, 2+ năm kinh nghiệm', 'Lương từ 22-38 triệu, thưởng hiệu suất, đào tạo nâng cao', 22000000, 38000000, 'VND', 'TP.HCM', 'On-site', 'Full-time', 'Mid-level', 'Published', GETDATE(), GETDATE(), @Recruiter1UserId),
(NEWID(), @CompanyId, @MarketingDeptId, @MarketingPosId, 'Chuyên viên Marketing Digital', 'Quản lý và thực hiện các chiến dịch marketing online', 'SEO, Google Ads, Facebook Ads, Analytics, 2+ năm kinh nghiệm', 'Lương 18-30 triệu, hoa hồng hấp dẫn, cơ hội thăng tiến', 18000000, 30000000, 'VND', 'TP.HCM', 'On-site', 'Full-time', 'Mid-level', 'Published', GETDATE(), GETDATE(), @Recruiter2UserId),
(NEWID(), @CompanyId, @SalesDeptId, @SalesPosId, 'Nhân viên Kinh doanh B2B', 'Tìm kiếm và phát triển khách hàng doanh nghiệp', 'Kỹ năng bán hàng, giao tiếp tốt, am hiểu thị trường B2B', 'Lương cơ bản + hoa hồng cao, xe công ty, laptop', 12000000, 20000000, 'VND', 'TP.HCM', 'On-site', 'Full-time', 'Junior', 'Published', GETDATE(), GETDATE(), @Recruiter2UserId),
(NEWID(), @CompanyId, @DesignDeptId, @DesignerPosId, 'UI/UX Designer', 'Thiết kế giao diện và trải nghiệm người dùng cho các sản phẩm digital', 'Figma, Adobe XD, User Research, Portfolio mạnh', 'Lương 18-32 triệu, môi trường sáng tạo, công cụ thiết kế hiện đại', 18000000, 32000000, 'VND', 'TP.HCM', 'On-site', 'Full-time', 'Mid-level', 'Published', GETDATE(), GETDATE(), @Recruiter1UserId);

-- Insert Candidates
INSERT INTO Candidates (Id, FirstName, LastName, Email, Phone, CurrentPosition, CurrentCompany, Location, ExpectedSalary, Currency, YearsOfExperience, Skills, Status, Source, CreatedAt) VALUES
(NEWID(), 'Nguyễn', 'Văn Anh', 'nguyenvananh@email.com', '+84 911 111 111', 'Frontend Developer', 'Công ty ABC', 'TP.HCM', 30000000, 'VND', 3, 'React, JavaScript, TypeScript, Node.js', 'Interview', 'LinkedIn', GETDATE()),
(NEWID(), 'Trần', 'Thị Bình', 'tranthibinh@email.com', '+84 922 222 222', 'Marketing Specialist', 'Công ty XYZ', 'TP.HCM', 25000000, 'VND', 4, 'SEO, Google Ads, Facebook Marketing, Analytics', 'Screening', 'VietnamWorks', GETDATE()),
(NEWID(), 'Lê', 'Hoàng Cường', 'lehoangcuong@email.com', '+84 933 333 333', 'Backend Developer', 'Công ty DEF', 'TP.HCM', 35000000, 'VND', 5, '.NET Core, SQL Server, Azure, Microservices', 'Offer', 'TopCV', GETDATE()),
(NEWID(), 'Phạm', 'Thị Dung', 'phamthidung@email.com', '+84 944 444 444', 'UI/UX Designer', 'Công ty GHI', 'TP.HCM', 25000000, 'VND', 2, 'Figma, Adobe XD, Photoshop, User Research', 'New', 'JobStreet', GETDATE()),
(NEWID(), 'Hoàng', 'Văn Em', 'hoangvanem@email.com', '+84 955 555 555', 'Sales Executive', 'Công ty JKL', 'TP.HCM', 18000000, 'VND', 3, 'Bán hàng B2B, CRM, Đàm phán, Quản lý khách hàng', 'Interview', 'Referral', GETDATE());

-- Insert System Settings
INSERT INTO SystemSettings (Id, Category, [Key], Value, DataType, Description, UpdatedById) VALUES
(NEWID(), 'General', 'CompanyName', 'Công ty TNHH Công nghệ ABC', 'String', 'Tên công ty hiển thị trong hệ thống', @AdminUserId),
(NEWID(), 'General', 'TimeZone', 'Asia/Ho_Chi_Minh', 'String', 'Múi giờ mặc định của hệ thống', @AdminUserId),
(NEWID(), 'General', 'DateFormat', 'dd/MM/yyyy', 'String', 'Định dạng ngày tháng mặc định', @AdminUserId),
(NEWID(), 'General', 'Currency', 'VND', 'String', 'Tiền tệ mặc định', @AdminUserId),
(NEWID(), 'Email', 'SMTPServer', 'smtp.gmail.com', 'String', 'Máy chủ SMTP để gửi email', @AdminUserId),
(NEWID(), 'Email', 'SMTPPort', '587', 'Integer', 'Cổng máy chủ SMTP', @AdminUserId),
(NEWID(), 'Recruitment', 'AutoRejectAfterDays', '30', 'Integer', 'Tự động từ chối đơn ứng tuyển sau X ngày', @AdminUserId),
(NEWID(), 'Recruitment', 'RequireApprovalForOffers', 'true', 'Boolean', 'Yêu cầu phê duyệt cho lời mời làm việc', @AdminUserId),
(NEWID(), 'Calendar', 'DefaultMeetingDuration', '60', 'Integer', 'Thời gian họp mặc định (phút)', @AdminUserId),
(NEWID(), 'Calendar', 'WorkingHoursStart', '08:00', 'String', 'Giờ bắt đầu làm việc', @AdminUserId),
(NEWID(), 'Calendar', 'WorkingHoursEnd', '17:00', 'String', 'Giờ kết thúc làm việc', @AdminUserId),
(NEWID(), 'Security', 'PasswordMinLength', '8', 'Integer', 'Độ dài tối thiểu của mật khẩu', @AdminUserId),
(NEWID(), 'Security', 'SessionTimeoutMinutes', '60', 'Integer', 'Thời gian hết hạn phiên (phút)', @AdminUserId);
