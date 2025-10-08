import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Mock analytics data
    const analytics = {
      overview: {
        totalCandidates: 150,
        totalInterviews: 45,
        totalHires: 25,
        totalEmployees: 120,
        hireRate: 16.67,
        timeToHire: 18,
        costPerHire: 3200000,
        candidateSatisfaction: 4.3
      },
      trends: {
        monthlyApplications: [
          { month: '2024-01', count: 25 },
          { month: '2024-02', count: 30 },
          { month: '2024-03', count: 22 },
          { month: '2024-04', count: 28 },
          { month: '2024-05', count: 35 },
          { month: '2024-06', count: 32 }
        ],
        monthlyHires: [
          { month: '2024-01', count: 4 },
          { month: '2024-02', count: 5 },
          { month: '2024-03', count: 3 },
          { month: '2024-04', count: 4 },
          { month: '2024-05', count: 6 },
          { month: '2024-06', count: 5 }
        ],
        monthlyInterviews: [
          { month: '2024-01', count: 8 },
          { month: '2024-02', count: 10 },
          { month: '2024-03', count: 7 },
          { month: '2024-04', count: 9 },
          { month: '2024-05', count: 12 },
          { month: '2024-06', count: 11 }
        ]
      },
      departmentStats: [
        { department: 'Engineering', positions: 45, avgSalary: 15000000, activeEmployees: 40 },
        { department: 'Marketing', positions: 20, avgSalary: 12000000, activeEmployees: 18 },
        { department: 'Sales', positions: 25, avgSalary: 13000000, activeEmployees: 22 },
        { department: 'HR', positions: 15, avgSalary: 10000000, activeEmployees: 12 }
      ],
      sourceStats: [
        { source: 'LinkedIn', count: 60, hires: 12, conversionRate: 20 },
        { source: 'Indeed', count: 40, hires: 6, conversionRate: 15 },
        { source: 'Company Website', count: 30, hires: 5, conversionRate: 17 },
        { source: 'Referral', count: 20, hires: 2, conversionRate: 10 }
      ],
      interviewStats: [
        { status: 'completed', count: 35 },
        { status: 'scheduled', count: 8 },
        { status: 'cancelled', count: 2 }
      ],
      performanceMetrics: {
        avgAIScore: 78.5,
        avgJobMatch: 82.3,
        avgCVQuality: 75.8
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