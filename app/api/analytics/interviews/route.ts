import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Mock interview analytics data
    const analytics = {
      overview: {
        totalInterviews: 45,
        completedInterviews: 35,
        scheduledInterviews: 8,
        cancelledInterviews: 2,
        averageRating: 4.2,
        successRate: 77.8
      },
      byRound: [
        { round: 'Initial Screening', total: 45, passed: 35, failed: 10, passRate: 77.8 },
        { round: 'Technical Interview', total: 35, passed: 25, failed: 10, passRate: 71.4 },
        { round: 'Final Interview', total: 25, passed: 20, failed: 5, passRate: 80.0 }
      ],
      byInterviewer: [
        { interviewer: 'Nguyễn Văn A', total: 15, averageRating: 4.5, successRate: 80.0 },
        { interviewer: 'Trần Thị B', total: 12, averageRating: 4.1, successRate: 75.0 },
        { interviewer: 'Lê Văn C', total: 10, averageRating: 4.3, successRate: 70.0 },
        { interviewer: 'Phạm Thị D', total: 8, averageRating: 4.0, successRate: 75.0 }
      ],
      monthlyTrends: [
        { month: '2024-01', interviews: 8, successRate: 75.0 },
        { month: '2024-02', interviews: 10, successRate: 80.0 },
        { month: '2024-03', interviews: 7, successRate: 71.4 },
        { month: '2024-04', interviews: 9, successRate: 77.8 },
        { month: '2024-05', interviews: 12, successRate: 83.3 },
        { month: '2024-06', interviews: 11, successRate: 72.7 }
      ],
      feedback: {
        positive: [
          'Strong technical skills',
          'Good communication',
          'Cultural fit',
          'Problem-solving ability'
        ],
        negative: [
          'Lack of experience',
          'Poor communication',
          'Technical gaps',
          'Not a good cultural fit'
        ]
      }
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Error fetching interview analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interview analytics' },
      { status: 500 }
    )
  }
}