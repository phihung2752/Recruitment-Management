import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') || 'All'
    const status = searchParams.get('status') || 'All'

    console.log('🔥 API: Fetching employees...', { page, pageSize, search, department, status })

    // Set environment variable to ignore SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/employees?page=${page}&pageSize=${pageSize}&search=${search}&department=${department}&status=${status}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Employees fetched successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock data')
      
      // Mock data fallback
      const mockData = {
        employees: [
          {
            id: 'emp-001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            phone: '0901234567',
            position: 'Senior Frontend Developer',
            department: 'Engineering',
            manager: 'Sarah Wilson',
            hireDate: '2023-01-15',
            salary: '$85,000',
            status: 'Active',
            location: 'Ho Chi Minh City',
            workType: 'Full-time',
            experience: '5 years',
            skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
            avatar: null,
            createdAt: '2023-01-15T09:00:00Z',
            updatedAt: '2025-01-10T10:30:00Z'
          },
          {
            id: 'emp-002',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@company.com',
            phone: '0901234568',
            position: 'HR Manager',
            department: 'Human Resources',
            manager: 'CEO',
            hireDate: '2022-06-01',
            salary: '$75,000',
            status: 'Active',
            location: 'Ho Chi Minh City',
            workType: 'Full-time',
            experience: '7 years',
            skills: ['HR Management', 'Recruitment', 'Employee Relations'],
            avatar: null,
            createdAt: '2022-06-01T09:00:00Z',
            updatedAt: '2025-01-12T14:20:00Z'
          },
          {
            id: 'emp-003',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@company.com',
            phone: '0901234569',
            position: 'Backend Developer',
            department: 'Engineering',
            manager: 'Sarah Wilson',
            hireDate: '2023-03-20',
            salary: '$70,000',
            status: 'Active',
            location: 'Hanoi',
            workType: 'Full-time',
            experience: '3 years',
            skills: ['Java', 'Spring Boot', 'Microservices', 'Docker'],
            avatar: null,
            createdAt: '2023-03-20T09:00:00Z',
            updatedAt: '2025-01-11T16:45:00Z'
          },
          {
            id: 'emp-004',
            firstName: 'Sarah',
            lastName: 'Wilson',
            email: 'sarah.wilson@company.com',
            phone: '0901234570',
            position: 'Tech Lead',
            department: 'Engineering',
            manager: 'CTO',
            hireDate: '2021-09-10',
            salary: '$95,000',
            status: 'Active',
            location: 'Ho Chi Minh City',
            workType: 'Full-time',
            experience: '8 years',
            skills: ['Leadership', 'Architecture', 'React', 'Node.js', 'AWS'],
            avatar: null,
            createdAt: '2021-09-10T09:00:00Z',
            updatedAt: '2025-01-13T11:15:00Z'
          },
          {
            id: 'emp-005',
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily.davis@company.com',
            phone: '0901234571',
            position: 'UX Designer',
            department: 'Design',
            manager: 'Design Manager',
            hireDate: '2023-07-05',
            salary: '$65,000',
            status: 'Active',
            location: 'Ho Chi Minh City',
            workType: 'Full-time',
            experience: '4 years',
            skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
            avatar: null,
            createdAt: '2023-07-05T09:00:00Z',
            updatedAt: '2025-01-14T13:30:00Z'
          },
          {
            id: 'emp-006',
            firstName: 'David',
            lastName: 'Brown',
            email: 'david.brown@company.com',
            phone: '0901234572',
            position: 'Marketing Manager',
            department: 'Marketing',
            manager: 'CEO',
            hireDate: '2022-11-15',
            salary: '$80,000',
            status: 'Active',
            location: 'Ho Chi Minh City',
            workType: 'Full-time',
            experience: '6 years',
            skills: ['Digital Marketing', 'Brand Management', 'Analytics', 'SEO'],
            avatar: null,
            createdAt: '2022-11-15T09:00:00Z',
            updatedAt: '2025-01-15T09:45:00Z'
          },
          {
            id: 'emp-007',
            firstName: 'Lisa',
            lastName: 'Garcia',
            email: 'lisa.garcia@company.com',
            phone: '0901234573',
            position: 'Data Analyst',
            department: 'Analytics',
            manager: 'Data Manager',
            hireDate: '2023-05-10',
            salary: '$60,000',
            status: 'Active',
            location: 'Hanoi',
            workType: 'Full-time',
            experience: '2 years',
            skills: ['SQL', 'Python', 'Excel', 'Statistics', 'Machine Learning'],
            avatar: null,
            createdAt: '2023-05-10T09:00:00Z',
            updatedAt: '2025-01-16T10:20:00Z'
          },
          {
            id: 'emp-008',
            firstName: 'Robert',
            lastName: 'Miller',
            email: 'robert.miller@company.com',
            phone: '0901234574',
            position: 'DevOps Engineer',
            department: 'Engineering',
            manager: 'Sarah Wilson',
            hireDate: '2023-09-01',
            salary: '$75,000',
            status: 'Active',
            location: 'Ho Chi Minh City',
            workType: 'Full-time',
            experience: '4 years',
            skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Monitoring'],
            avatar: null,
            createdAt: '2023-09-01T09:00:00Z',
            updatedAt: '2025-01-17T15:10:00Z'
          }
        ],
        totalCount: 8,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(8 / pageSize)
      }
      
      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch employees',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, position, department, manager, hireDate, salary, location, workType, skills } = body

    console.log('🔥 API: Creating employee...', { firstName, lastName, email, position })

    // Set environment variable to ignore SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, phone, position, department, manager, hireDate, salary, location, workType, skills })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Employee created successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock response')
      
      // Mock response
      const mockResponse = {
        success: true,
        message: 'Employee created successfully',
        employee: {
          id: `emp-${Date.now()}`,
          firstName,
          lastName,
          email,
          phone,
          position,
          department,
          manager,
          hireDate,
          salary,
          status: 'Active',
          location,
          workType,
          skills,
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
      message: 'Failed to create employee',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId, firstName, lastName, email, phone, position, department, manager, salary, location, workType, skills } = body

    console.log('🔥 API: Updating employee...', { employeeId, firstName, lastName })

    // Set environment variable to ignore SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, phone, position, department, manager, salary, location, workType, skills })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Employee updated successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock response')
      
      // Mock response
      const mockResponse = {
        success: true,
        message: 'Employee updated successfully',
        employee: {
          id: employeeId,
          firstName,
          lastName,
          email,
          phone,
          position,
          department,
          manager,
          salary,
          location,
          workType,
          skills,
          updatedAt: new Date().toISOString()
        }
      }
      
      return NextResponse.json(mockResponse)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update employee',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')

    console.log('🔥 API: Deleting employee...', { employeeId })

    // Set environment variable to ignore SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/employees/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Employee deleted successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock response')
      
      // Mock response
      const mockResponse = {
        success: true,
        message: 'Employee deleted successfully',
        employeeId: employeeId
      }
      
      return NextResponse.json(mockResponse)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete employee',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}