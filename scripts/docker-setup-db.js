const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DATABASE_HOST || 'mysql',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER || 'hr_admin',
  password: process.env.DATABASE_PASSWORD || 'HRAdmin123!',
  database: process.env.DATABASE_NAME || 'hr_management_system',
  charset: 'utf8mb4',
  timezone: '+00:00'
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔧 Setting up HR Management Database in Docker...');
    
    // Wait for database to be ready
    let retries = 30;
    while (retries > 0) {
      try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Database connection successful');
        break;
      } catch (error) {
        console.log(`⏳ Waiting for database... (${retries} retries left)`);
        retries--;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!connection) {
      throw new Error('❌ Could not connect to database after 30 retries');
    }

    // Check if admin user exists
    const [adminUsers] = await connection.execute(
      'SELECT Id FROM Users WHERE Username = "admin"'
    );

    if (adminUsers.length === 0) {
      console.log('👤 Creating admin user...');
      
      // Create admin user
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await connection.execute(
        `INSERT INTO Users (Username, Email, FirstName, LastName, PasswordHash, Status, CreatedAt) 
         VALUES (?, ?, ?, ?, ?, 'Active', NOW())`,
        ['admin', 'admin@company.com', 'Admin', 'User', hashedPassword]
      );

      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Setup admin permissions
    console.log('🔑 Setting up admin permissions...');
    
    // Find admin user ID
    const [adminUsers2] = await connection.execute(
      'SELECT Id FROM Users WHERE Username = "admin"'
    );
    const adminUserId = adminUsers2[0].Id;

    // Find Admin role ID
    const [adminRoles] = await connection.execute(
      'SELECT Id FROM Roles WHERE RoleName = "Admin"'
    );
    const adminRoleId = adminRoles[0].Id;

    // Assign Admin role to admin user if not already assigned
    const [userRoles] = await connection.execute(
      'SELECT * FROM UserRoles WHERE UserId = ? AND RoleId = ?',
      [adminUserId, adminRoleId]
    );

    if (userRoles.length === 0) {
      await connection.execute(
        'INSERT INTO UserRoles (UserId, RoleId) VALUES (?, ?)',
        [adminUserId, adminRoleId]
      );
      console.log('✅ Admin role assigned to user');
    } else {
      console.log('✅ Admin role already assigned to user');
    }

    // Get all permissions and assign to Admin role
    const [allPermissions] = await connection.execute(
      'SELECT Id, PermissionName FROM Permissions'
    );

    for (const perm of allPermissions) {
      const [rolePermissions] = await connection.execute(
        'SELECT * FROM RolePermissions WHERE RoleId = ? AND PermissionId = ?',
        [adminRoleId, perm.Id]
      );

      if (rolePermissions.length === 0) {
        await connection.execute(
          'INSERT INTO RolePermissions (RoleId, PermissionId) VALUES (?, ?)',
          [adminRoleId, perm.Id]
        );
      }
    }

    console.log('✅ All permissions assigned to Admin role');

    // Verify setup
    const [finalAdminUser] = await connection.execute(`
      SELECT u.Username, r.RoleName, GROUP_CONCAT(p.PermissionName) as Permissions
      FROM Users u
      LEFT JOIN UserRoles ur ON u.Id = ur.UserId
      LEFT JOIN Roles r ON ur.RoleId = r.Id
      LEFT JOIN RolePermissions rp ON r.Id = rp.RoleId
      LEFT JOIN Permissions p ON rp.PermissionId = p.Id
      WHERE u.Id = ?
      GROUP BY u.Id, r.RoleName
    `, [adminUserId]);

    console.log('🎯 Final setup:');
    console.log('  Username:', finalAdminUser[0].Username);
    console.log('  Role:', finalAdminUser[0].RoleName);
    console.log('  Permissions:', finalAdminUser[0].Permissions?.split(',').length || 0, 'permissions');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Login Information:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  Role: Admin (Full access)');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();




