import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'

// SQL Server connection
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

// GET - Lấy danh sách người dùng
export async function GET(request: NextRequest) {
    try {
        console.log('🔍 Getting users list...');
        
        await sql.connect(config);
        
        const result = await sql.query(`
            SELECT u.UserId, u.Username, u.Email, u.FirstName, u.LastName, 
                   u.Status, u.CreatedAt, r.RoleName
            FROM Users u
            LEFT JOIN Roles r ON u.RoleId = r.RoleId
            ORDER BY u.CreatedAt DESC
        `);
        
        await sql.close();
        
        return NextResponse.json({ 
            success: true, 
            users: result.recordset 
        });
        
    } catch (error) {
        console.error('❌ Get users error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to get users',
            error: error instanceof Error ? error.message : "Unknown error" 
        });
    }
}

// POST - Tạo người dùng mới
export async function POST(request: NextRequest) {
    try {
        const { username, email, password, firstName, lastName, roleId = 4 } = await request.json();
        
        console.log('🔍 Creating new user:', username);
        
        // Generate password hash
        const passwordHash = bcrypt.hashSync(password, 12);
        
        await sql.connect(config);
        
        // Check if user exists
        const checkResult = await sql.query(
            'SELECT Username FROM Users WHERE Username = @username OR Email = @email',
            [
                { name: 'username', value: username },
                { name: 'email', value: email }
            ]
        );
        
        if (checkResult.recordset.length > 0) {
            await sql.close();
            return NextResponse.json({ 
                success: false, 
                message: 'Username or email already exists' 
            });
        }
        
        // Create user
        const result = await sql.query(`
            INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, RoleId, Status, CreatedAt, UpdatedAt, CreatedBy)
            VALUES (@username, @email, @passwordHash, @firstName, @lastName, @roleId, 'Active', GETDATE(), GETDATE(), 1)
        `, [
            { name: 'username', value: username },
            { name: 'email', value: email },
            { name: 'passwordHash', value: passwordHash },
            { name: 'firstName', value: firstName },
            { name: 'lastName', value: lastName },
            { name: 'roleId', value: roleId }
        ]);
        
        console.log('✅ User created successfully');
        
        await sql.close();
        
        return NextResponse.json({ 
            success: true, 
            message: 'User created successfully',
            user: { username, email, firstName, lastName }
        });
        
    } catch (error) {
        console.error('❌ Create user error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to create user',
            error: error instanceof Error ? error.message : "Unknown error" 
        });
    }
}

// PUT - Cập nhật người dùng
export async function PUT(request: NextRequest) {
    try {
        const { userId, username, email, firstName, lastName, status, roleId } = await request.json();
        
        console.log('🔍 Updating user:', userId);
        
        await sql.connect(config);
        
        const result = await sql.query(`
            UPDATE Users 
            SET Username = @username, Email = @email, FirstName = @firstName, 
                LastName = @lastName, Status = @status, RoleId = @roleId, UpdatedAt = GETDATE()
            WHERE UserId = @userId
        `, [
            { name: 'userId', value: userId },
            { name: 'username', value: username },
            { name: 'email', value: email },
            { name: 'firstName', value: firstName },
            { name: 'lastName', value: lastName },
            { name: 'status', value: status },
            { name: 'roleId', value: roleId }
        ]);
        
        console.log('✅ User updated successfully');
        
        await sql.close();
        
        return NextResponse.json({ 
            success: true, 
            message: 'User updated successfully'
        });
        
    } catch (error) {
        console.error('❌ Update user error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to update user',
            error: error instanceof Error ? error.message : "Unknown error" 
        });
    }
}

// DELETE - Xóa người dùng
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');
        
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }
        
        console.log('🔍 Deleting user:', userId);
        
        await sql.connect(config);
        
        const result = await sql.query(
            'DELETE FROM Users WHERE UserId = @userId',
            [{ name: 'userId', value: parseInt(userId) }]
        );
        
        console.log('✅ User deleted successfully');
        
        await sql.close();
        
        return NextResponse.json({ 
            success: true, 
            message: 'User deleted successfully'
        });
        
    } catch (error) {
        console.error('❌ Delete user error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to delete user',
            error: error instanceof Error ? error.message : "Unknown error" 
        });
    }
}