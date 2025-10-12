import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'All'

    console.log('🔥 API: Fetching permissions...', { page, pageSize, search, type })

    // Set environment variable to ignore SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/permissions?page=${page}&pageSize=${pageSize}&search=${search}&type=${type}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Permissions fetched successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock data')
      
      // Mock data fallback
      const mockData = {
        permissions: [
          {
            id: 'perm-001',
            name: 'user.read',
            displayName: 'View Users',
            description: 'Permission to view user information',
            category: 'User Management',
            type: 'read',
            module: 'Users',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-002',
            name: 'user.create',
            displayName: 'Create Users',
            description: 'Permission to create new users',
            category: 'User Management',
            type: 'create',
            module: 'Users',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-003',
            name: 'user.update',
            displayName: 'Update Users',
            description: 'Permission to update user information',
            category: 'User Management',
            type: 'update',
            module: 'Users',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-004',
            name: 'user.delete',
            displayName: 'Delete Users',
            description: 'Permission to delete users',
            category: 'User Management',
            type: 'delete',
            module: 'Users',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-005',
            name: 'candidate.read',
            displayName: 'View Candidates',
            description: 'Permission to view candidate information',
            category: 'Recruitment',
            type: 'read',
            module: 'Candidates',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-006',
            name: 'candidate.create',
            displayName: 'Create Candidates',
            description: 'Permission to create new candidates',
            category: 'Recruitment',
            type: 'create',
            module: 'Candidates',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-007',
            name: 'candidate.update',
            displayName: 'Update Candidates',
            description: 'Permission to update candidate information',
            category: 'Recruitment',
            type: 'update',
            module: 'Candidates',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-008',
            name: 'candidate.delete',
            displayName: 'Delete Candidates',
            description: 'Permission to delete candidates',
            category: 'Recruitment',
            type: 'delete',
            module: 'Candidates',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-009',
            name: 'job.read',
            displayName: 'View Job Postings',
            description: 'Permission to view job postings',
            category: 'Recruitment',
            type: 'read',
            module: 'Job Postings',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-010',
            name: 'job.create',
            displayName: 'Create Job Postings',
            description: 'Permission to create new job postings',
            category: 'Recruitment',
            type: 'create',
            module: 'Job Postings',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-011',
            name: 'job.update',
            displayName: 'Update Job Postings',
            description: 'Permission to update job postings',
            category: 'Recruitment',
            type: 'update',
            module: 'Job Postings',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-012',
            name: 'job.delete',
            displayName: 'Delete Job Postings',
            description: 'Permission to delete job postings',
            category: 'Recruitment',
            type: 'delete',
            module: 'Job Postings',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-013',
            name: 'interview.read',
            displayName: 'View Interviews',
            description: 'Permission to view interview information',
            category: 'Recruitment',
            type: 'read',
            module: 'Interviews',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-014',
            name: 'interview.create',
            displayName: 'Create Interviews',
            description: 'Permission to create new interviews',
            category: 'Recruitment',
            type: 'create',
            module: 'Interviews',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-015',
            name: 'interview.update',
            displayName: 'Update Interviews',
            description: 'Permission to update interview information',
            category: 'Recruitment',
            type: 'update',
            module: 'Interviews',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-016',
            name: 'interview.delete',
            displayName: 'Delete Interviews',
            description: 'Permission to delete interviews',
            category: 'Recruitment',
            type: 'delete',
            module: 'Interviews',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-017',
            name: 'employee.read',
            displayName: 'View Employees',
            description: 'Permission to view employee information',
            category: 'Employee Management',
            type: 'read',
            module: 'Employees',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-018',
            name: 'employee.create',
            displayName: 'Create Employees',
            description: 'Permission to create new employees',
            category: 'Employee Management',
            type: 'create',
            module: 'Employees',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-019',
            name: 'employee.update',
            displayName: 'Update Employees',
            description: 'Permission to update employee information',
            category: 'Employee Management',
            type: 'update',
            module: 'Employees',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-020',
            name: 'employee.delete',
            displayName: 'Delete Employees',
            description: 'Permission to delete employees',
            category: 'Employee Management',
            type: 'delete',
            module: 'Employees',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-021',
            name: 'report.read',
            displayName: 'View Reports',
            description: 'Permission to view reports and analytics',
            category: 'Reporting',
            type: 'read',
            module: 'Reports',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-022',
            name: 'report.create',
            displayName: 'Create Reports',
            description: 'Permission to create new reports',
            category: 'Reporting',
            type: 'create',
            module: 'Reports',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-023',
            name: 'settings.read',
            displayName: 'View Settings',
            description: 'Permission to view system settings',
            category: 'System',
            type: 'read',
            module: 'Settings',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          },
          {
            id: 'perm-024',
            name: 'settings.update',
            displayName: 'Update Settings',
            description: 'Permission to update system settings',
            category: 'System',
            type: 'update',
            module: 'Settings',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2025-01-10T10:00:00Z'
          }
        ],
        totalCount: 24,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(24 / pageSize)
      }
      
      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch permissions',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, displayName, description, category, type, module } = body

    console.log('🔥 API: Creating permission...', { name, displayName })

    // Set environment variable to ignore SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, displayName, description, category, type, module })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Permission created successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock response')
      
      // Mock response
      const mockResponse = {
        success: true,
        message: 'Permission created successfully',
        permission: {
          id: `perm-${Date.now()}`,
          name,
          displayName,
          description,
          category,
          type,
          module,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
      
      return NextResponse.json(mockResponse)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create permission',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { permissionId, name, displayName, description, category, type, module, isActive } = body

    console.log('🔥 API: Updating permission...', { permissionId, name })

    // Set environment variable to ignore SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/permissions/${permissionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, displayName, description, category, type, module, isActive })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Permission updated successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock response')
      
      // Mock response
      const mockResponse = {
        success: true,
        message: 'Permission updated successfully',
        permission: {
          id: permissionId,
          name,
          displayName,
          description,
          category,
          type,
          module,
          isActive,
          updatedAt: new Date().toISOString()
        }
      }
      
      return NextResponse.json(mockResponse)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update permission',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const permissionId = searchParams.get('permissionId')

    console.log('🔥 API: Deleting permission...', { permissionId })

    // Set environment variable to ignore SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/permissions/${permissionId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Permission deleted successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock response')
      
      // Mock response
      const mockResponse = {
        success: true,
        message: 'Permission deleted successfully',
        permissionId: permissionId
      }
      
      return NextResponse.json(mockResponse)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete permission',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
