import { NextRequest, NextResponse } from "next/server"
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

// Test SQL Server connection via Node.js
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

export async function GET(request: NextRequest) {
    try {
        console.log('🔍 Testing SQL Server connection...');
        
        await sql.connect(config);
        console.log('✅ Connected to SQL Server successfully');
        
        // Test query
        const result = await sql.query('SELECT COUNT(*) as userCount FROM Users');
        console.log('📊 Users in database:', result.recordset[0].userCount);
        
        // Test admin user
        const adminResult = await sql.query("SELECT Username, Email, PasswordHash FROM Users WHERE Username = 'admin'");
        console.log('👤 Admin user:', adminResult.recordset[0]);
        
        await sql.close();
        
        return NextResponse.json({ 
            success: true, 
            message: 'SQL Server connection successful',
            userCount: result.recordset[0].userCount,
            adminUser: adminResult.recordset[0]
        });
        
    } catch (error) {
        console.error('❌ SQL Server connection failed:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'SQL Server connection failed',
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json()
        
        console.log('🔍 Testing login with SQL Server...');
        
        await sql.connect(config);
        
        // Get user from database
        const result = await sql.query(
            'SELECT Username, PasswordHash, Status FROM Users WHERE Username = @username',
            [{ name: 'username', value: username }]
        );
        
        if (result.recordset.length === 0) {
            await sql.close();
            return NextResponse.json({ success: false, message: 'User not found' })
        }
        
        const user = result.recordset[0];
        console.log('👤 User found:', user.Username);
        console.log('🔐 Password hash:', user.PasswordHash);
        console.log('📊 Status:', user.Status);
        
        // Verify password
        const isValidPassword = bcrypt.compareSync(password, user.PasswordHash);
        console.log('✅ Password valid:', isValidPassword);
        
        await sql.close();
        
        if (!isValidPassword) {
            return NextResponse.json({ success: false, message: 'Invalid password' })
        }
        
        return NextResponse.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                username: user.Username,
                status: user.Status
            }
        });
        
    } catch (error) {
        console.error('❌ Login test error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Login test failed',
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}

