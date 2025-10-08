const sql = require('mssql');

const config = {
    server: 'localhost',
    port: 1433,
    user: 'sa',
    password: 'YourStrong@Passw0rd',
    database: 'HRManagementSystem',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function testConnection() {
    try {
        console.log('🔍 Testing SQL Server connection...');
        
        await sql.connect(config);
        console.log('✅ Connected to SQL Server successfully');
        
        // Test query
        const result = await sql.query('SELECT COUNT(*) as userCount FROM Users');
        console.log('📊 Users in database:', result.recordset[0].userCount);
        
        // Test admin user
        const adminResult = await sql.query("SELECT Username, Email FROM Users WHERE Username = 'admin'");
        console.log('👤 Admin user:', adminResult.recordset[0]);
        
        await sql.close();
        console.log('✅ Connection test completed successfully');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testConnection();
