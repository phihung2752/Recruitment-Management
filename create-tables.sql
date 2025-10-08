-- Create Users table
CREATE TABLE "Users" (
    "UserId" SERIAL PRIMARY KEY,
    "Username" VARCHAR(50) NOT NULL UNIQUE,
    "Email" VARCHAR(100) NOT NULL UNIQUE,
    "PasswordHash" VARCHAR(255) NOT NULL,
    "FirstName" VARCHAR(50) NOT NULL,
    "LastName" VARCHAR(50) NOT NULL,
    "RoleId" INTEGER NOT NULL,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'Active',
    "LastLoginAt" TIMESTAMP WITH TIME ZONE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "CreatedBy" INTEGER
);

-- Create Roles table
CREATE TABLE "Roles" (
    "RoleId" SERIAL PRIMARY KEY,
    "RoleName" VARCHAR(50) NOT NULL,
    "Description" VARCHAR(255),
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create Permissions table
CREATE TABLE "Permissions" (
    "PermissionId" SERIAL PRIMARY KEY,
    "PermissionName" VARCHAR(100) NOT NULL,
    "Description" VARCHAR(255),
    "Module" VARCHAR(50),
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create RolePermissions table
CREATE TABLE "RolePermissions" (
    "RoleId" INTEGER NOT NULL,
    "PermissionId" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("RoleId", "PermissionId"),
    FOREIGN KEY ("PermissionId") REFERENCES "Permissions" ("PermissionId") ON DELETE CASCADE,
    FOREIGN KEY ("RoleId") REFERENCES "Roles" ("RoleId") ON DELETE CASCADE
);

-- Insert default roles
INSERT INTO "Roles" ("RoleId", "RoleName", "Description", "CreatedAt", "UpdatedAt") VALUES
(1, 'Admin', 'System Administrator with full access', NOW(), NOW()),
(2, 'HR', 'Human Resources Manager', NOW(), NOW()),
(3, 'Manager', 'Department Manager', NOW(), NOW()),
(4, 'Employee', 'Regular Employee', NOW(), NOW()),
(5, 'Interviewer', 'Interview Panel Member', NOW(), NOW());

-- Insert default permissions
INSERT INTO "Permissions" ("PermissionId", "PermissionName", "Description", "Module", "CreatedAt") VALUES
(1, 'users.view', 'View users', 'Users', NOW()),
(2, 'users.create', 'Create users', 'Users', NOW()),
(3, 'users.edit', 'Edit users', 'Users', NOW()),
(4, 'users.delete', 'Delete users', 'Users', NOW()),
(5, 'users.reset_password', 'Reset user passwords', 'Users', NOW()),
(6, 'employees.view', 'View employees', 'Employees', NOW()),
(7, 'employees.create', 'Create employees', 'Employees', NOW()),
(8, 'employees.edit', 'Edit employees', 'Employees', NOW()),
(9, 'employees.delete', 'Delete employees', 'Employees', NOW()),
(10, 'candidates.view', 'View candidates', 'Candidates', NOW()),
(11, 'candidates.create', 'Create candidates', 'Candidates', NOW()),
(12, 'candidates.edit', 'Edit candidates', 'Candidates', NOW()),
(13, 'candidates.delete', 'Delete candidates', 'Candidates', NOW()),
(14, 'interviews.view', 'View interviews', 'Interviews', NOW()),
(15, 'interviews.create', 'Create interviews', 'Interviews', NOW()),
(16, 'interviews.edit', 'Edit interviews', 'Interviews', NOW()),
(17, 'interviews.delete', 'Delete interviews', 'Interviews', NOW()),
(18, 'jobs.view', 'View job postings', 'Jobs', NOW()),
(19, 'jobs.create', 'Create job postings', 'Jobs', NOW()),
(20, 'jobs.edit', 'Edit job postings', 'Jobs', NOW()),
(21, 'jobs.delete', 'Delete job postings', 'Jobs', NOW()),
(22, 'reports.view', 'View reports', 'Reports', NOW()),
(23, 'reports.export', 'Export reports', 'Reports', NOW()),
(24, 'system.admin', 'System administration', 'System', NOW()),
(25, 'system.settings', 'System settings', 'System', NOW()),
(26, 'calendar.view', 'View calendar', 'Calendar', NOW()),
(27, 'calendar.edit', 'Edit calendar', 'Calendar', NOW()),
(28, 'notifications.view', 'View notifications', 'Notifications', NOW()),
(29, 'notifications.send', 'Send notifications', 'Notifications', NOW());

-- Insert role permissions (Admin gets all permissions)
INSERT INTO "RolePermissions" ("RoleId", "PermissionId", "CreatedAt") VALUES
(1, 1, NOW()), (1, 2, NOW()), (1, 3, NOW()), (1, 4, NOW()), (1, 5, NOW()),
(1, 6, NOW()), (1, 7, NOW()), (1, 8, NOW()), (1, 9, NOW()),
(1, 10, NOW()), (1, 11, NOW()), (1, 12, NOW()), (1, 13, NOW()),
(1, 14, NOW()), (1, 15, NOW()), (1, 16, NOW()), (1, 17, NOW()),
(1, 18, NOW()), (1, 19, NOW()), (1, 20, NOW()), (1, 21, NOW()),
(1, 22, NOW()), (1, 23, NOW()), (1, 24, NOW()), (1, 25, NOW()),
(1, 26, NOW()), (1, 27, NOW()), (1, 28, NOW()), (1, 29, NOW());

-- Insert admin user
INSERT INTO "Users" ("Username", "Email", "PasswordHash", "FirstName", "LastName", "RoleId", "Status", "CreatedAt", "UpdatedAt") VALUES
('admin', 'admin@hrmanagement.com', '$2b$12$1x6NwO0IckcJcCsC4hv44./8Rdkcy1hhwnWTPnjVuv8vBYwVqXcDS', 'System', 'Administrator', 1, 'Active', NOW(), NOW());

-- Create indexes
CREATE INDEX "IX_Users_RoleId" ON "Users" ("RoleId");
CREATE INDEX "IX_Users_Email" ON "Users" ("Email");
CREATE INDEX "IX_Users_Username" ON "Users" ("Username");
CREATE INDEX "IX_RolePermissions_PermissionId" ON "RolePermissions" ("PermissionId");

