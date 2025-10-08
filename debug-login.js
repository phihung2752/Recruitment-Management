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

async function debugLogin() {
  try {
    console.log('🔍 Debugging login...');
    
    // Get user from database
    const result = await pool.query(
      'SELECT "Username", "PasswordHash", "Status" FROM "Users" WHERE "Username" = $1',
      ['admin']
    );
    
    console.log('📊 Query result:', result.rows);
    
    if (result.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const user = result.rows[0];
    console.log('👤 User:', user.Username);
    console.log('🔐 Password hash length:', user.PasswordHash.length);
    console.log('🔐 Password hash:', user.PasswordHash);
    console.log('📊 Status:', user.Status);
    
    // Test password verification
    const password = '123456';
    console.log('🔑 Testing password:', password);
    
    const isValidPassword = bcrypt.compareSync(password, user.PasswordHash);
    console.log('✅ Password valid:', isValidPassword);
    
    // Generate new hash and test
    const newHash = bcrypt.hashSync(password, 12);
    console.log('🔧 New hash:', newHash);
    
    const isValidNew = bcrypt.compareSync(password, newHash);
    console.log('✅ New hash valid:', isValidNew);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

debugLogin();

