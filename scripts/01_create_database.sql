-- Create HR Management System Database
CREATE DATABASE IF NOT EXISTS hr_system;
USE hr_system;

-- Set charset and collation
ALTER DATABASE hr_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create admin user if not exists
CREATE USER IF NOT EXISTS 'hr_admin'@'%' IDENTIFIED BY 'HRAdmin123!';
GRANT ALL PRIVILEGES ON hr_system.* TO 'hr_admin'@'%';
FLUSH PRIVILEGES;

-- Verify connection
SELECT 'Database hr_system created successfully!' as message;
