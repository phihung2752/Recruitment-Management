const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'HRManagementSystem',
  ssl: false
});

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Check if Users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Users'
      );
    `);
    
    console.log('📊 Users table exists:', tableCheck.rows[0].exists);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Users table does not exist. Database not initialized.');
      return;
    }
    
    // Check users
    const users = await client.query('SELECT "Username", "Email" FROM "Users"');
    console.log('👥 Users in database:', users.rows);
    
    // Create admin user if not exists
    const adminExists = await client.query('SELECT "UserId" FROM "Users" WHERE "Username" = $1', ['admin']);
    
    if (adminExists.rows.length === 0) {
      console.log('🔧 Creating admin user...');
      const passwordHash = bcrypt.hashSync('123456', 12);
      
      await client.query(`
        INSERT INTO "Users" ("Username", "Email", "PasswordHash", "FirstName", "LastName", "RoleId", "Status", "CreatedAt", "UpdatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        'admin',
        'admin@hrmanagement.com',
        passwordHash,
        'System',
        'Administrator',
        1, // Admin role
        'Active',
        new Date(),
        new Date()
      ]);
      
      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await pool.end();
  }
}

testDatabase();

