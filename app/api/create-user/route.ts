import { NextRequest, NextResponse } from "next/server"

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

export async function POST(request: NextRequest) {
    try {
        const { username, password, passwordHash } = await request.json()
        
        console.log('🔍 Creating user:', username);
        
        await sql.connect(config);
        console.log('✅ Connected to SQL Server');
        
        // Check if user exists
        const checkResult = await sql.query(
            'SELECT Username FROM Users WHERE Username = @username',
            [{ name: 'username', value: username }]
        );
        
        if (checkResult.recordset.length > 0) {
            await sql.close();
            return NextResponse.json({ 
                success: false, 
                message: 'User already exists' 
            });
        }
        
        // Create user
        const result = await sql.query(`
            INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, RoleId, Status, CreatedAt, UpdatedAt, CreatedBy)
            VALUES (@username, @email, @passwordHash, @firstName, @lastName, 1, 'Active', GETDATE(), GETDATE(), 1)
        `, [
            { name: 'username', value: username },
            { name: 'email', value: username + '@hrmanagement.com' },
            { name: 'passwordHash', value: passwordHash },
            { name: 'firstName', value: 'System' },
            { name: 'lastName', value: 'Administrator' }
        ]);
        
        console.log('✅ User created successfully');
        
        await sql.close();
        
        return NextResponse.json({ 
            success: true, 
            message: 'User created successfully',
            username: username
        });
        
    } catch (error) {
        console.error('❌ User creation error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'User creation failed',
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}

