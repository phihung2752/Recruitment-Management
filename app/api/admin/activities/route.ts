import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data that matches the backend response
    // This will be replaced with actual API call once SSL issues are resolved
    const mockData = [
      {
        id: 1,
        type: "Tuyển dụng",
        description: "Đăng tin tuyển dụng mới 'Senior Software Engineer'",
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        type: "Ứng viên",
        description: "Ứng viên Nguyễn Văn A đã cập nhật hồ sơ",
        timestamp: new Date(Date.now() - 10800000).toISOString()
      },
      {
        id: 3,
        type: "Hệ thống",
        description: "Cấu hình hệ thống được cập nhật bởi Admin",
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ]

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Error fetching admin activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin activities' },
      { status: 500 }
    )
  }
}
