import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log('🔍 Login attempt:', { username, password })

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Hardcoded user accounts with different permissions
    if (username === 'admin' && password === 'Admin123!') {
      const user = {
        id: 1,
        username: 'admin',
        email: 'admin@company.com',
        firstName: 'System',
        lastName: 'Administrator',
        status: 'Active',
        roles: ['SuperAdmin', 'Admin', 'HR', 'Manager'],
        permissions: [
          'user.create', 'user.read', 'user.update', 'user.delete',
          'employee.create', 'employee.read', 'employee.update', 'employee.delete',
          'candidate.create', 'candidate.read', 'candidate.update', 'candidate.delete',
          'interview.create', 'interview.read', 'interview.update', 'interview.delete',
          'job.create', 'job.read', 'job.update', 'job.delete',
          'report.create', 'report.read', 'report.export',
          'system.settings', 'system.admin',
          'recruitment.manage', 'recruitment.approve',
          'dashboard.view', 'analytics.view',
          'notification.send', 'email.send',
          'ai.analyze', 'ai.classify', 'ai.filter'
        ]
      }

      const token = 'admin-token-' + Date.now()

      console.log('✅ Login successful for admin')
      
      return NextResponse.json({
        success: true,
        user,
        token,
        message: 'Login successful'
      })
    }

    // HR Manager account
    if (username === 'hr.manager' && password === 'HR123!') {
      const user = {
        id: 2,
        username: 'hr.manager',
        email: 'hr.manager@company.com',
        firstName: 'HR',
        lastName: 'Manager',
        status: 'Active',
        roles: ['HR', 'Manager'],
        permissions: [
          'employee.read', 'employee.update',
          'candidate.create', 'candidate.read', 'candidate.update', 'candidate.delete',
          'interview.create', 'interview.read', 'interview.update', 'interview.delete',
          'job.create', 'job.read', 'job.update',
          'report.read', 'report.export',
          'recruitment.manage', 'recruitment.approve',
          'dashboard.view', 'analytics.view',
          'notification.send', 'email.send',
          'ai.analyze', 'ai.classify', 'ai.filter'
        ]
      }

      const token = 'hr-token-' + Date.now()
      console.log('✅ Login successful for HR Manager')
      
      return NextResponse.json({
        success: true,
        user,
        token,
        message: 'Login successful'
      })
    }

    // Recruiter account
    if (username === 'recruiter' && password === 'Rec123!') {
      const user = {
        id: 3,
        username: 'recruiter',
        email: 'recruiter@company.com',
        firstName: 'Senior',
        lastName: 'Recruiter',
        status: 'Active',
        roles: ['Recruiter'],
        permissions: [
          'candidate.create', 'candidate.read', 'candidate.update',
          'interview.create', 'interview.read', 'interview.update',
          'job.read',
          'dashboard.view',
          'ai.analyze', 'ai.classify', 'ai.filter'
        ]
      }

      const token = 'recruiter-token-' + Date.now()
      console.log('✅ Login successful for Recruiter')
      
      return NextResponse.json({
        success: true,
        user,
        token,
        message: 'Login successful'
      })
    }

    console.log('❌ Login failed - invalid credentials')
    return NextResponse.json({
      success: false,
      message: 'Invalid username or password'
    }, { status: 401 })

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}