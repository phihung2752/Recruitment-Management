const mysql = require('mysql2/promise');

async function setupAdminPermissions() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'hr_admin',
      password: 'HRAdmin123!',
      database: 'hr_management_system'
    });

    console.log('🔧 Setting up admin permissions...');

    // Get admin user ID
    const [adminUser] = await connection.execute(
      'SELECT Id FROM Users WHERE Username = ?',
      ['admin']
    );

    if (adminUser.length === 0) {
      console.log('❌ Admin user not found!');
      return;
    }

    const adminId = adminUser[0].Id;
    console.log('👤 Admin user ID:', adminId);

    // Get Admin role ID
    const [adminRole] = await connection.execute(
      'SELECT Id FROM Roles WHERE RoleName = ?',
      ['Admin']
    );

    if (adminRole.length === 0) {
      console.log('❌ Admin role not found!');
      return;
    }

    const adminRoleId = adminRole[0].Id;
    console.log('🔑 Admin role ID:', adminRoleId);

    // Assign Admin role to user
    await connection.execute(
      'INSERT IGNORE INTO UserRoles (UserId, RoleId) VALUES (?, ?)',
      [adminId, adminRoleId]
    );
    console.log('✅ Admin role assigned to user');

    // Get all permissions
    const [permissions] = await connection.execute(
      'SELECT Id FROM Permissions'
    );

    console.log('📋 Found', permissions.length, 'permissions');

    // Assign all permissions to Admin role
    for (const permission of permissions) {
      await connection.execute(
        'INSERT IGNORE INTO RolePermissions (RoleId, PermissionId) VALUES (?, ?)',
        [adminRoleId, permission.Id]
      );
    }
    console.log('✅ All permissions assigned to Admin role');

    // Verify setup
    const [userRoles] = await connection.execute(`
      SELECT r.RoleName, GROUP_CONCAT(p.PermissionName) as permissions
      FROM Users u
      JOIN UserRoles ur ON u.Id = ur.UserId
      JOIN Roles r ON ur.RoleId = r.Id
      LEFT JOIN RolePermissions rp ON r.Id = rp.RoleId
      LEFT JOIN Permissions p ON rp.PermissionId = p.Id
      WHERE u.Username = 'admin'
      GROUP BY r.Id, r.RoleName
    `);

    console.log('🎯 Final setup:');
    userRoles.forEach(role => {
      console.log(`  Role: ${role.RoleName}`);
      console.log(`  Permissions: ${role.permissions}`);
    });

    await connection.end();
    console.log('🎉 Admin permissions setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setupAdminPermissions();





