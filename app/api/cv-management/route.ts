import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔥 Getting CVs from backend...')

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'All'
    const source = searchParams.get('source') || 'All'
    const aiScoreMin = searchParams.get('aiScoreMin') || '0'
    const aiScoreMax = searchParams.get('aiScoreMax') || '100'
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

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

    // Call backend API
    const backendUrl = `http://localhost:5000/api/admin/candidates?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`
    console.log('🌐 Backend URL:', backendUrl)

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('❌ Backend response not ok:', response.status, response.statusText)
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Backend response:', data)

    // Transform data to include CV management specific fields
    const transformedCvs = (data.candidates || []).map((candidate: any, index: number) => ({
      ...candidate,
      source: getRandomSource(),
      isBlacklisted: Math.random() < 0.05, // 5% chance
      blacklistReason: Math.random() < 0.05 ? 'Not qualified for position' : undefined,
      isReapplicant: Math.random() < 0.15, // 15% chance
      applicationCount: Math.random() < 0.15 ? Math.floor(Math.random() * 3) + 2 : 1,
      isStarCandidate: Math.random() < 0.1, // 10% chance
      isFastTrack: Math.random() < 0.08, // 8% chance
      isReferral: Math.random() < 0.12, // 12% chance
      isUrgent: Math.random() < 0.05, // 5% chance
      tags: {
        auto: generateAutoTags(candidate.skills),
        manual: generateManualTags()
      },
      duplicates: Math.random() < 0.1 ? generateMockDuplicates() : undefined, // 10% chance
      aiAnalysis: Math.random() < 0.3 ? { // 30% chance of having AI analysis
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        strengths: ['Strong technical skills', 'Good communication', 'Relevant experience'],
        weaknesses: ['Limited leadership experience', 'Needs more certifications'],
        recommendedLabels: ['High Potential', 'Technical Expert', 'Fast Learner'],
        matchPercentage: Math.floor(Math.random() * 30) + 70 // 70-100
      } : undefined
    }))

    // Apply source filter
    let filteredCvs = transformedCvs
    if (source !== 'All') {
      filteredCvs = transformedCvs.filter(cv => cv.source === source)
    }

    // Apply AI score filter
    filteredCvs = filteredCvs.filter(cv => {
      if (!cv.aiAnalysis) return true
      return cv.aiAnalysis.score >= parseInt(aiScoreMin) && cv.aiAnalysis.score <= parseInt(aiScoreMax)
    })

    // Apply sorting
    filteredCvs.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'score':
          aValue = a.aiAnalysis?.score || 0
          bValue = b.aiAnalysis?.score || 0
          break
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
          break
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(pageSize)
    const endIndex = startIndex + parseInt(pageSize)
    const paginatedCvs = filteredCvs.slice(startIndex, endIndex)

    const result = {
      cvs: paginatedCvs,
      totalCount: filteredCvs.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(filteredCvs.length / parseInt(pageSize))
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Get CVs error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch CVs', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function getRandomSource(): string {
  const sources = [
    'VietnamWorks',
    'TopCV', 
    'Indeed',
    'LinkedIn',
    'CareerLink',
    'Website',
    'Email',
    'Employee Referral'
  ]
  return sources[Math.floor(Math.random() * sources.length)]
}

function generateAutoTags(skills: string): string[] {
  const skillArray = skills.split(',').map(s => s.trim().toLowerCase())
  const tags = []
  
  if (skillArray.some(s => s.includes('react') || s.includes('vue') || s.includes('angular'))) {
    tags.push('Frontend Expert')
  }
  if (skillArray.some(s => s.includes('node') || s.includes('python') || s.includes('java'))) {
    tags.push('Backend Developer')
  }
  if (skillArray.some(s => s.includes('docker') || s.includes('kubernetes') || s.includes('aws'))) {
    tags.push('DevOps Ready')
  }
  if (skillArray.some(s => s.includes('lead') || s.includes('manager') || s.includes('team'))) {
    tags.push('Leadership Potential')
  }
  
  return tags
}

function generateManualTags(): Array<{id: string, label: string, color: string}> {
  const manualTags = [
    { id: '1', label: 'High Priority', color: 'red' },
    { id: '2', label: 'Follow Up', color: 'blue' },
    { id: '3', label: 'Technical Lead', color: 'green' },
    { id: '4', label: 'Fresh Graduate', color: 'purple' }
  ]
  
  // Return 0-2 random manual tags
  const count = Math.floor(Math.random() * 3)
  return manualTags.sort(() => 0.5 - Math.random()).slice(0, count)
}

function generateMockDuplicates(): Array<any> {
  const sources = ['VietnamWorks', 'TopCV', 'Indeed', 'LinkedIn']
  const statuses = ['Applied', 'Interviewed', 'Rejected', 'Hired']
  
  const count = Math.floor(Math.random() * 3) + 1 // 1-3 duplicates
  const duplicates = []
  
  for (let i = 0; i < count; i++) {
    duplicates.push({
      id: `dup-${i + 1}`,
      submissionNumber: i + 2,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      position: 'Frontend Developer',
      source: sources[Math.floor(Math.random() * sources.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      statusText: statuses[Math.floor(Math.random() * statuses.length)],
      rejectionReason: Math.random() < 0.3 ? 'Not enough experience' : undefined,
      changes: Math.random() < 0.5 ? [
        { field: 'Skills', oldValue: 'React, Vue', newValue: 'React, Vue, Angular' },
        { field: 'Experience', oldValue: '2 years', newValue: '3 years' }
      ] : undefined,
      notes: Math.random() < 0.4 ? 'Improved skills since last application' : undefined
    })
  }
  
  return duplicates
}