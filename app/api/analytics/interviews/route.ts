import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { requireAuth, requirePermission } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 })
    }

    // Kiểm tra permission
    const permissionResult = await requirePermission(request, 'reports.view')
    if (!permissionResult.success) {
      return NextResponse.json(permissionResult, { status: 403 })
    }

    // Lấy thống kê tổng quan
    const totalInterviewsQuery = `
      SELECT COUNT(*) as total
      FROM InterviewRounds
    `
    const totalResult = await executeQuery(totalInterviewsQuery, [])
    const totalInterviews = totalResult[0].total

    // Lấy thống kê theo trạng thái
    const statusQuery = `
      SELECT 
        Status,
        COUNT(*) as count
      FROM InterviewRounds
      GROUP BY Status
    `
    const statusResult = await executeQuery(statusQuery, [])
    
    let completedInterviews = 0
    let pendingInterviews = 0
    let passedInterviews = 0
    let failedInterviews = 0

    statusResult.forEach((row: any) => {
      switch (row.Status) {
        case 'passed':
          passedInterviews = row.count
          completedInterviews += row.count
          break
        case 'failed':
          failedInterviews = row.count
          completedInterviews += row.count
          break
        case 'current':
        case 'pending':
          pendingInterviews += row.count
          break
      }
    })

    // Tính tỷ lệ thành công
    const successRate = completedInterviews > 0 
      ? Math.round((passedInterviews / completedInterviews) * 100) 
      : 0

    // Lấy thống kê theo vị trí
    const positionsQuery = `
      SELECT 
        c.Position,
        COUNT(ir.Id) as count
      FROM InterviewRounds ir
      JOIN Candidates c ON ir.CandidateId = c.Id
      GROUP BY c.Position
      ORDER BY count DESC
      LIMIT 5
    `
    const positionsResult = await executeQuery(positionsQuery, [])
    const topPositions = positionsResult.map((row: any) => ({
      position: row.Position,
      count: row.count
    }))

    // Lấy thống kê theo tháng (6 tháng gần nhất)
    const monthlyQuery = `
      SELECT 
        DATE_FORMAT(ir.CreatedAt, '%Y-%m') as month,
        COUNT(*) as interviews,
        SUM(CASE WHEN ir.Status = 'passed' THEN 1 ELSE 0 END) as passed
      FROM InterviewRounds ir
      WHERE ir.CreatedAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(ir.CreatedAt, '%Y-%m')
      ORDER BY month DESC
    `
    const monthlyResult = await executeQuery(monthlyQuery, [])
    const monthlyTrends = monthlyResult.map((row: any) => ({
      month: row.month,
      interviews: row.interviews,
      passed: row.passed
    }))

    // Lấy hiệu suất phỏng vấn viên
    const interviewerQuery = `
      SELECT 
        ir.Interviewer,
        COUNT(*) as interviews,
        SUM(CASE WHEN ir.Status = 'passed' THEN 1 ELSE 0 END) as passed
      FROM InterviewRounds ir
      WHERE ir.Interviewer IS NOT NULL
      GROUP BY ir.Interviewer
      ORDER BY interviews DESC
      LIMIT 5
    `
    const interviewerResult = await executeQuery(interviewerQuery, [])
    const interviewerPerformance = interviewerResult.map((row: any) => ({
      interviewer: row.Interviewer,
      interviews: row.interviews,
      successRate: row.interviews > 0 ? Math.round((row.passed / row.interviews) * 100) : 0
    }))

    // Tính thời gian phỏng vấn trung bình từ CalendarEvents
    const durationQuery = `
      SELECT 
        AVG(TIMESTAMPDIFF(MINUTE, StartTime, EndTime)) as avgDuration
      FROM CalendarEvents 
      WHERE Title LIKE '%Phỏng vấn%'
        AND StartTime IS NOT NULL 
        AND EndTime IS NOT NULL
    `
    const durationResult = await executeQuery(durationQuery, [])
    const averageInterviewDuration = Math.round(durationResult[0]?.avgDuration || 45)

    const analyticsData = {
      totalInterviews,
      completedInterviews,
      pendingInterviews,
      passedInterviews,
      failedInterviews,
      averageInterviewDuration,
      successRate,
      topPositions,
      monthlyTrends,
      interviewerPerformance
    }

    return NextResponse.json({
      success: true,
      data: analyticsData
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching interview analytics:', error)
    return NextResponse.json({
      success: false,
      message: "Failed to fetch interview analytics"
    }, { status: 500 })
  }
}





