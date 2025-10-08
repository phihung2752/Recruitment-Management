import sql from 'mssql'

// SQL Server Database configuration
const dbConfig = {
  server: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '1433'),
  user: process.env.DATABASE_USER || 'sa',
  password: process.env.DATABASE_PASSWORD || 'YourStrong@Passw0rd',
  database: process.env.DATABASE_NAME || 'HRManagementDB',
  options: {
    encrypt: false, // Use true if you're on Windows Azure
    trustServerCertificate: true, // Use true if you're on Windows Azure
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}

let pool: sql.ConnectionPool | null = null

async function connectDb() {
  try {
    if (pool && pool.connected) {
      return pool
    }
    pool = await sql.connect(dbConfig)
    console.log('✅ SQL Server Database connected successfully')
    return pool
  } catch (error) {
    console.error('❌ SQL Server Database connection failed:', error)
    throw error
  }
}

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const dbPool = await connectDb()
    const request = dbPool.request()
    params.forEach((param, index) => {
      request.input(`param${index}`, param)
    })
    const result = await request.query(query)
    return result.recordset as T[]
  } catch (error) {
    console.error('❌ SQL Server Database query error:', error)
    throw error
  }
}

export async function executeSingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
  try {
    const dbPool = await connectDb()
    const request = dbPool.request()
    params.forEach((param, index) => {
      request.input(`param${index}`, param)
    })
    const result = await request.query(query)
    const rows = result.recordset as T[]
    return rows.length > 0 ? rows[0] : null
  } catch (error) {
    console.error('❌ SQL Server Database single query error:', error)
    throw error
  }
}

export async function executeTransaction(queries: { query: string; params: any[] }[]) {
  const dbPool = await connectDb()
  const transaction = new sql.Transaction(dbPool)
  try {
    await transaction.begin()
    for (const { query, params } of queries) {
      const request = new sql.Request(transaction)
      params.forEach((param, index) => {
        request.input(`param${index}`, param)
      })
      await request.query(query)
    }
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    console.error('❌ SQL Server Transaction failed:', error)
    throw error
  }
}

export async function closePool() {
  if (pool && pool.connected) {
    await pool.close()
    pool = null
    console.log('✅ SQL Server Database connection pool closed.')
  }
}