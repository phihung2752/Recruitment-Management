import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'All'
    const source = searchParams.get('source') || 'All'
    const aiScoreMin = searchParams.get('aiScoreMin') || '0'
    const aiScoreMax = searchParams.get('aiScoreMax') || '100'
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    console.log('🔥 Getting CVs from backend...')
    console.log('📊 Params:', { 
      page, 
      pageSize, 
      search, 
      status, 
      source, 
      aiScoreMin, 
      aiScoreMax, 
      sortBy, 
      sortOrder 
    })

    // Generate mock CV data
    const mockCvs = generateMockCVs(pageSize)
    
    console.log('✅ Mock CV data generated:', mockCvs.length, 'CVs')
    
    return NextResponse.json({
      success: true,
      cvs: mockCvs,
      totalCount: 50, // Mock total count
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(50 / pageSize)
    })
  } catch (error) {
    console.error('❌ Get CVs error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch CVs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function generateMockCVs(count: number) {
  const sources = ['VietnamWorks', 'TopCV', 'Indeed', 'LinkedIn', 'CareerLink', 'Website', 'Email', 'Employee Referral']
  const positions = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UX Designer', 'Data Analyst', 'Marketing Manager', 'DevOps Engineer', 'Product Manager']
  const skills = [
    'React, JavaScript, TypeScript, Node.js',
    'Java, Spring Boot, Microservices, AWS',
    'Python, Django, PostgreSQL, Docker',
    'Vue.js, JavaScript, HTML5, CSS3',
    'Figma, Adobe Creative Suite, User Research',
    'SQL, Excel, Python, Machine Learning',
    'Digital Marketing, Google Ads, Analytics',
    'AWS, Docker, Kubernetes, CI/CD'
  ]
  const statuses = ['Applied', 'Interviewed', 'Hired', 'Rejected']
  const names = [
    'Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E',
    'Vũ Thị F', 'Đặng Văn G', 'Bùi Thị H', 'Ngô Văn I', 'Dương Thị J'
  ]

  return Array.from({ length: count }, (_, index) => {
    const id = `cv-${String(index + 1).padStart(3, '0')}`
    const name = names[index % names.length]
    const position = positions[index % positions.length]
    const skill = skills[index % skills.length]
    const status = statuses[index % statuses.length]
    const source = sources[index % sources.length]
    const aiScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60

    return {
      id,
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' '),
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: `090${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
      currentPosition: position,
      experience: `${Math.floor(Math.random() * 8) + 1} years`,
      skills: skill,
      status: status,
      source: source,
      aiScore: aiScore,
      isBlacklisted: Math.random() < 0.05,
      isStarCandidate: Math.random() < 0.1,
      isReapplicant: Math.random() < 0.15,
      applicationCount: Math.random() < 0.15 ? Math.floor(Math.random() * 3) + 2 : 1,
      tags: {
        auto: ['Technical', 'Experienced', 'Skilled'],
        manual: Math.random() < 0.3 ? ['High Priority', 'Fast Track'] : []
      },
      aiAnalysis: {
        score: aiScore,
        strengths: [
          'Strong technical background',
          'Excellent problem-solving skills',
          'Good communication abilities',
          'Relevant industry experience'
        ],
        weaknesses: [
          'Limited leadership experience',
          'Could improve on system design',
          'Needs more certifications'
        ],
        recommendedLabels: ['High Potential', 'Technical Expert', 'Fast Learner'],
        matchPercentage: Math.floor(Math.random() * 30) + 70
      },
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: Math.random() < 0.4 ? 'Strong candidate with relevant experience' : undefined,
      duplicateCount: Math.random() < 0.2 ? Math.floor(Math.random() * 3) + 1 : 0,
      isDuplicate: Math.random() < 0.2,
      version: 1,
      statusHistory: [
        { status: 'Applied', timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), note: 'Initial application' },
        { status: status, timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), note: 'Status updated' }
      ]
    }
  })
}