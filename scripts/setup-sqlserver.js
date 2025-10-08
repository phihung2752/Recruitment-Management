const sql = require('mssql')
const fs = require('fs')
const path = require('path')

// SQL Server configuration
const config = {
  server: process.env.SQL_SERVER_HOST || 'localhost',
  port: parseInt(process.env.SQL_SERVER_PORT || '1433'),
  user: process.env.SQL_SERVER_USER || 'sa',
  password: process.env.SQL_SERVER_PASSWORD || 'YourStrong@Passw0rd',
  database: process.env.SQL_SERVER_DATABASE || 'HRManagementDB',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
}

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to SQL Server...')
    
    // Connect to master database first
    const masterConfig = { ...config, database: 'master' }
    await sql.connect(masterConfig)
    console.log('✅ Connected to SQL Server master database')
    
    // Read and execute schema file
    const schemaPath = path.join(__dirname, '..', 'database-schema-sqlserver.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📄 Executing database schema...')
    await sql.query(schema)
    console.log('✅ Database schema created successfully!')
    
    // Test connection to HRManagementDB
    await sql.close()
    await sql.connect(config)
    console.log('✅ Connected to HRManagementDB')
    
    // Test query
    const result = await sql.query('SELECT COUNT(*) as userCount FROM Users')
    console.log('👥 Users in database:', result.recordset[0].userCount)
    
    const candidates = await sql.query('SELECT COUNT(*) as candidateCount FROM Candidates')
    console.log('👤 Candidates in database:', candidates.recordset[0].candidateCount)
    
    const employees = await sql.query('SELECT COUNT(*) as employeeCount FROM Employees')
    console.log('👨‍💼 Employees in database:', employees.recordset[0].employeeCount)
    
    console.log('🎉 Database setup completed successfully!')
    console.log('📊 Database contains:')
    console.log(`   - ${result.recordset[0].userCount} users`)
    console.log(`   - ${candidates.recordset[0].candidateCount} candidates`)
    console.log(`   - ${employees.recordset[0].employeeCount} employees`)
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await sql.close()
  }
}

// Run setup
setupDatabase()

