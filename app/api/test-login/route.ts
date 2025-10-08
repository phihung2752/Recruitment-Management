import { NextRequest, NextResponse } from "next/server"
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'HRManagementSystem',
  ssl: false
})

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    console.log('🔍 Test login for:', username)
    
    // Get user from database
    const result = await pool.query(
      'SELECT "Username", "PasswordHash", "Status" FROM "Users" WHERE "Username" = $1',
      [username]
    )
    
    if (result.rows.length === 0) {
      console.log('❌ User not found')
      return NextResponse.json({ success: false, message: 'User not found' })
    }
    
    const user = result.rows[0]
    console.log('👤 User found:', user.Username)
    console.log('🔐 Password hash:', user.PasswordHash)
    console.log('📊 Status:', user.Status)
    
    // Verify password
    const isValidPassword = bcrypt.compareSync(password, user.PasswordHash)
    console.log('✅ Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      console.log('❌ Invalid password')
      return NextResponse.json({ success: false, message: 'Invalid password' })
    }
    
    console.log('✅ Login successful')
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        username: user.Username,
        status: user.Status
      }
    })
    
  } catch (error) {
    console.error('❌ Test login error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Login failed',
      error: error instanceof Error ? error.message : "Unknown error" 
    })
  }
}

