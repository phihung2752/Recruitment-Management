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
    const dateRange = searchParams.get('dateRange') || '6months'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (dateRange) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case '3months':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6months':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 6)
    }

    // Get overview stats
    const [candidatesResult, interviewsResult, hiresResult, employeesResult] = await Promise.all([
      executeQuery('SELECT COUNT(*) as total FROM Candidates WHERE createdAt >= ?', [startDate]),
      executeQuery('SELECT COUNT(*) as total FROM InterviewRounds WHERE createdAt >= ?', [startDate]),
      executeQuery('SELECT COUNT(*) as total FROM Candidates WHERE status = "Hired" AND createdAt >= ?', [startDate]),
      executeQuery('SELECT COUNT(*) as total FROM Employees WHERE status = "active"')
    ])

    const totalCandidates = candidatesResult[0]?.total || 0
    const totalInterviews = interviewsResult[0]?.total || 0
    const totalHires = hiresResult[0]?.total || 0
    const totalEmployees = employeesResult[0]?.total || 0

    // Calculate rates
    const hireRate = totalCandidates > 0 ? (totalHires / totalCandidates) * 100 : 0
    const timeToHire = totalHires > 0 ? Math.round(totalInterviews / totalHires) : 0
    const costPerHire = totalHires > 0 ? 3200000 : 0 // Mock cost
    const candidateSatisfaction = 4.3 // Mock satisfaction

    // Get monthly trends
    const monthlyApplications = await executeQuery(`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        COUNT(*) as count
      FROM Candidates 
      WHERE createdAt >= ?
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month
    `, [startDate])

    const monthlyHires = await executeQuery(`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        COUNT(*) as count
      FROM Candidates 
      WHERE status = 'Hired' AND createdAt >= ?
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month
    `, [startDate])

    const monthlyInterviews = await executeQuery(`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        COUNT(*) as count
      FROM InterviewRounds 
      WHERE createdAt >= ?
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month
    `, [startDate])

    // Get department stats
    const departmentStats = await executeQuery(`
      SELECT 
        department,
        COUNT(*) as positions,
        AVG(salary) as avgSalary,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as activeEmployees
      FROM Employees 
      GROUP BY department
      ORDER BY positions DESC
    `)

    // Get source analytics
    const sourceStats = await executeQuery(`
      SELECT 
        source,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'Hired' THEN 1 END) as hires
      FROM Candidates 
      WHERE createdAt >= ?
      GROUP BY source
      ORDER BY count DESC
    `, [startDate])

    // Get interview analytics
    const interviewStats = await executeQuery(`
      SELECT 
        status,
        COUNT(*) as count
      FROM InterviewRounds 
      WHERE createdAt >= ?
      GROUP BY status
    `, [startDate])

    // Get performance metrics
    const performanceMetrics = await executeQuery(`
      SELECT 
        AVG(aiScore) as avgAIScore,
        AVG(jobMatch) as avgJobMatch,
        AVG(cvQuality) as avgCVQuality
      FROM CVAnalysis 
      WHERE createdAt >= ?
    `, [startDate])

    const analytics = {
      overview: {
        totalCandidates,
        totalInterviews,
        totalHires,
        totalEmployees,
        hireRate: Math.round(hireRate * 100) / 100,
        timeToHire,
        costPerHire,
        candidateSatisfaction
      },
      trends: {
        monthlyApplications: monthlyApplications.map((item: any) => ({
          month: item.month,
          count: item.count
        })),
        monthlyHires: monthlyHires.map((item: any) => ({
          month: item.month,
          count: item.count
        })),
        monthlyInterviews: monthlyInterviews.map((item: any) => ({
          month: item.month,
          count: item.count
        }))
      },
      departmentStats: departmentStats.map((item: any) => ({
        department: item.department,
        positions: item.positions,
        avgSalary: Math.round(item.avgSalary || 0),
        activeEmployees: item.activeEmployees
      })),
      sourceStats: sourceStats.map((item: any) => ({
        source: item.source,
        count: item.count,
        hires: item.hires,
        conversionRate: item.count > 0 ? Math.round((item.hires / item.count) * 100) : 0
      })),
      interviewStats: interviewStats.map((item: any) => ({
        status: item.status,
        count: item.count
      })),
      performanceMetrics: {
        avgAIScore: Math.round((performanceMetrics[0]?.avgAIScore || 0) * 100) / 100,
        avgJobMatch: Math.round((performanceMetrics[0]?.avgJobMatch || 0) * 100) / 100,
        avgCVQuality: Math.round((performanceMetrics[0]?.avgCVQuality || 0) * 100) / 100
      }
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}




