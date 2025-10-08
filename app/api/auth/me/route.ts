import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    // For now, return a mock user based on token
    // In a real app, you would verify the JWT token and get user from database
    if (token.startsWith('admin-token-')) {
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
          'job.create', 'job.read', 'job.update', 'job.delete', 'job.approve',
          'report.create', 'report.read', 'report.export',
          'system.settings', 'system.admin',
          'recruitment.manage', 'recruitment.approve',
          'dashboard.view', 'analytics.view',
          'notification.send', 'email.send',
          'ai.analyze', 'ai.classify', 'ai.filter'
        ]
      }
      
      return NextResponse.json({ success: true, user })
    }
    
    if (token.startsWith('hr-token-')) {
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
          'job.create', 'job.read', 'job.update', 'job.approve',
          'report.read', 'report.export',
          'recruitment.manage', 'recruitment.approve',
          'dashboard.view', 'analytics.view',
          'notification.send', 'email.send',
          'ai.analyze', 'ai.classify', 'ai.filter'
        ]
      }
      
      return NextResponse.json({ success: true, user })
    }
    
    if (token.startsWith('recruiter-token-')) {
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
      
      return NextResponse.json({ success: true, user })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid token' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}