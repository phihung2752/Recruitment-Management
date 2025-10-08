import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Mock users data - replace with real database connection
const mockUsers = [
  {
    UserId: 1,
    Username: 'admin',
    Email: 'admin@company.com',
    FirstName: 'System',
    LastName: 'Administrator',
    Status: 'Active',
    RoleName: 'SuperAdmin',
    CreatedAt: '2024-01-01T00:00:00Z'
  },
  {
    UserId: 2,
    Username: 'hr_manager',
    Email: 'hr@company.com',
    FirstName: 'Nguyễn Văn',
    LastName: 'A',
    Status: 'Active',
    RoleName: 'HR Manager',
    CreatedAt: '2024-01-15T00:00:00Z'
  },
  {
    UserId: 3,
    Username: 'manager1',
    Email: 'manager@company.com',
    FirstName: 'Trần Thị',
    LastName: 'B',
    Status: 'Active',
    RoleName: 'Manager',
    CreatedAt: '2024-02-01T00:00:00Z'
  },
  {
    UserId: 4,
    Username: 'employee1',
    Email: 'employee@company.com',
    FirstName: 'Lê Văn',
    LastName: 'C',
    Status: 'Pending',
    RoleName: 'Employee',
    CreatedAt: '2024-02-15T00:00:00Z'
  },
  {
    UserId: 5,
    Username: 'employee2',
    Email: 'employee2@company.com',
    FirstName: 'Phạm Thị',
    LastName: 'D',
    Status: 'Inactive',
    RoleName: 'Employee',
    CreatedAt: '2024-03-01T00:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with real database query
    // const users = await db.query('SELECT * FROM Users')
    
    return NextResponse.json({
      success: true,
      users: mockUsers
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, firstName, lastName } = body

    // TODO: Replace with real database insert
    // const newUser = await db.query(
    //   'INSERT INTO Users (Username, Email, Password, FirstName, LastName) VALUES (?, ?, ?, ?, ?)',
    //   [username, email, password, firstName, lastName]
    // )

    const newUser = {
      UserId: mockUsers.length + 1,
      Username: username,
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      Status: 'Active',
      RoleName: 'Employee',
      CreatedAt: new Date().toISOString()
    }

    mockUsers.push(newUser)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // TODO: Replace with real database delete
    // await db.query('DELETE FROM Users WHERE UserId = ?', [userId])

    const userIndex = mockUsers.findIndex(user => user.UserId === parseInt(userId))
    if (userIndex > -1) {
      mockUsers.splice(userIndex, 1)
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    )
  }
}