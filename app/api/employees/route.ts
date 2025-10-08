import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') || ''
    const status = searchParams.get('status') || ''

    const offset = (page - 1) * limit

    // Build WHERE clause
    let whereConditions = []
    let params = []

    if (search) {
      whereConditions.push('(firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR position LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (department) {
      whereConditions.push('department = ?')
      params.push(department)
    }

    if (status) {
      whereConditions.push('status = ?')
      params.push(status)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countResult = await executeQuery(`
      SELECT COUNT(*) as total
      FROM Employees e
      ${whereClause}
    `, params)

    const total = countResult[0]?.total || 0

    // Get employees with pagination
    const employees = await executeQuery(`
      SELECT 
        e.id,
        e.firstName,
        e.lastName,
        e.email,
        e.phone,
        e.position,
        e.department,
        e.manager,
        e.hireDate,
        e.salary,
        e.status,
        e.employeeType,
        e.workLocation,
        e.emergencyContact,
        e.emergencyPhone,
        e.address,
        e.skills,
        e.certifications,
        e.performance,
        e.attendance,
        e.benefits,
        e.createdAt,
        e.updatedAt
      FROM Employees e
      ${whereClause}
      ORDER BY e.createdAt DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    return NextResponse.json({
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      manager,
      hireDate,
      salary,
      status,
      employeeType,
      workLocation,
      emergencyContact,
      emergencyPhone,
      address,
      skills,
      certifications,
      performance,
      attendance,
      benefits
    } = body

    const result = await executeQuery(`
      INSERT INTO Employees (
        firstName, lastName, email, phone, position, department, manager,
        hireDate, salary, status, employeeType, workLocation, emergencyContact,
        emergencyPhone, address, skills, certifications, performance, attendance, benefits
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      firstName, lastName, email, phone, position, department, manager,
      hireDate, salary, status || 'active', employeeType, workLocation, emergencyContact,
      emergencyPhone, address, JSON.stringify(skills || []), JSON.stringify(certifications || []), 
      JSON.stringify(performance || {}), JSON.stringify(attendance || {}), JSON.stringify(benefits || {})
    ])

    return NextResponse.json({
      success: true,
      id: (result as any).insertId
    })

  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}




