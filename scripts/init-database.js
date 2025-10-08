const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // Thay đổi password MySQL của bạn
  charset: 'utf8mb4'
}

async function initDatabase() {
  let connection
  
  try {
    console.log('🔌 Connecting to MySQL...')
    connection = await mysql.createConnection(dbConfig)
    
    console.log('📖 Reading SQL file...')
    const sqlFile = path.join(__dirname, '01_create_database.sql')
    const sqlContent = fs.readFileSync(sqlFile, 'utf8')
    
    console.log('🚀 Executing SQL...')
    await connection.execute(sqlContent)
    
    console.log('✅ Database initialized successfully!')
    console.log('📊 Database: hr_system')
    console.log('👤 Admin user: admin / Admin123!')
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

initDatabase()




