import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔥 API: Analyzing CV with AI...', { candidateName: body.candidateName })

    // Call backend AI analysis API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/ai-cv/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: AI analysis completed successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock analysis')
      
      // Mock AI analysis result
      const mockAnalysis = {
        overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
        skillsMatch: Math.floor(Math.random() * 30) + 70,
        experienceMatch: Math.floor(Math.random() * 30) + 70,
        educationMatch: Math.floor(Math.random() * 30) + 70,
        recommendedLabels: ["Senior", "React Expert", "Team Lead"],
        strengths: [
          "5+ năm kinh nghiệm React",
          "Có kinh nghiệm quản lý team",
          "Thành thạo TypeScript",
          "Có kinh nghiệm với testing"
        ],
        weaknesses: [
          "Thiếu kinh nghiệm với Node.js",
          "Chưa có kinh nghiệm với AWS"
        ],
        recommendation: "Strong Match",
        interviewQuestions: [
          "Bạn có thể chia sẻ về dự án React phức tạp nhất mà bạn đã làm?",
          "Làm thế nào bạn quản lý team trong dự án trước đây?",
          "Bạn có kinh nghiệm gì với testing trong React?",
          "Bạn có kinh nghiệm gì với performance optimization?",
          "Bạn có thể giải thích về state management trong React?"
        ],
        suggestedSalary: "25-35 triệu VND",
        priority: "High"
      }

      return NextResponse.json(mockAnalysis)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze CV' },
      { status: 500 }
    )
  }
}




















