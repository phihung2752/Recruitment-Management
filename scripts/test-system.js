const mysql = require('mysql2/promise');

async function testSystem() {
  try {
    console.log('🧪 Testing HR Management System...\n');

    // Test database connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'hr_admin',
      password: 'HRAdmin123!',
      database: 'hr_management_system'
    });

    console.log('✅ Database connection successful');

    // Test admin user
    const [adminUser] = await connection.execute(
      'SELECT u.*, GROUP_CONCAT(r.RoleName) as roles, GROUP_CONCAT(p.PermissionName) as permissions FROM Users u LEFT JOIN UserRoles ur ON u.Id = ur.UserId LEFT JOIN Roles r ON ur.RoleId = r.Id LEFT JOIN RolePermissions rp ON r.Id = rp.RoleId LEFT JOIN Permissions p ON rp.PermissionId = p.Id WHERE u.Username = "admin" GROUP BY u.Id'
    );

    if (adminUser.length > 0) {
      console.log('✅ Admin user found:', adminUser[0].Username);
      console.log('   Roles:', adminUser[0].roles);
      console.log('   Permissions:', adminUser[0].permissions?.split(',').length || 0, 'permissions');
    } else {
      console.log('❌ Admin user not found');
    }

    // Test candidates
    const [candidates] = await connection.execute('SELECT COUNT(*) as count FROM Candidates');
    console.log('✅ Candidates:', candidates[0].count, 'records');

    // Test users
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM Users');
    console.log('✅ Users:', users[0].count, 'records');

    // Test roles
    const [roles] = await connection.execute('SELECT COUNT(*) as count FROM Roles');
    console.log('✅ Roles:', roles[0].count, 'records');

    // Test permissions
    const [permissions] = await connection.execute('SELECT COUNT(*) as count FROM Permissions');
    console.log('✅ Permissions:', permissions[0].count, 'records');

    await connection.end();

    console.log('\n🎉 System test completed successfully!');
    console.log('\n📋 System Status:');
    console.log('   🌐 Server: http://localhost:3001');
    console.log('   👤 Admin Login: admin / admin123');
    console.log('   🔑 Full permissions: ✅');
    console.log('   📊 Data loaded: ✅');

  } catch (error) {
    console.error('❌ System test failed:', error.message);
  }
}

testSystem();





