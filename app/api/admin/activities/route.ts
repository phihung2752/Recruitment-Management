import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Mock recent activities data
    const activities = [
      {
        id: '1',
        type: 'candidate',
        title: 'Ứng viên mới đăng ký',
        description: 'Nguyễn Văn A đã đăng ký ứng tuyển vị trí Frontend Developer',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: 'success'
      },
      {
        id: '2',
        type: 'interview',
        title: 'Phỏng vấn hoàn thành',
        description: 'Phỏng vấn với Trần Thị B cho vị trí Backend Developer đã kết thúc',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: 'info'
      },
      {
        id: '3',
        type: 'job',
        title: 'Tin tuyển dụng mới',
        description: 'Đã tạo tin tuyển dụng cho vị trí Full Stack Developer',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        status: 'success'
      },
      {
        id: '4',
        type: 'system',
        title: 'Báo cáo được xuất',
        description: 'Báo cáo tháng 9/2025 đã được xuất thành công',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        status: 'success'
      },
      {
        id: '5',
        type: 'user',
        title: 'Người dùng mới',
        description: 'Tài khoản HR Manager đã được tạo',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        status: 'info'
      }
    ]

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}