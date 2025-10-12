import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'All'

    console.log('🔥 Getting candidates from backend...')
    console.log('📊 Params:', { page, pageSize, search, status })

    // Generate mock candidates data
    const mockCandidates = generateMockCandidates(pageSize)
    
    console.log('✅ Mock candidates data generated:', mockCandidates.length, 'candidates')
    
    return NextResponse.json({
      success: true,
      candidates: mockCandidates,
      totalCount: 50, // Mock total count
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(50 / pageSize)
    })
  } catch (error) {
    console.error('❌ Get candidates error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch candidates',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function generateMockCandidates(count: number) {
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
    'Vũ Thị F', 'Đặng Văn G', 'Bùi Thị H', 'Ngô Văn I', 'Dương Thị J',
    'Cao Văn K', 'Lý Thị L', 'Đinh Văn M', 'Ngô Thị N', 'Phan Văn O'
  ]

  return Array.from({ length: count }, (_, index) => {
    const id = `cand-${String(index + 1).padStart(3, '0')}`
    const name = names[index % names.length]
    const position = positions[index % positions.length]
    const skill = skills[index % skills.length]
    const status = statuses[index % statuses.length]

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
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  })
}