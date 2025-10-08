import { NextRequest, NextResponse } from 'next/server'

async function getCandidates(request: NextRequest) {
  try {
    console.log('🔥 Getting candidates from backend...')
    
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'All'
    
    console.log('📊 Params:', { page, pageSize, search, status })
    
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
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Get candidates error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch candidates', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function createCandidate(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, position, experience, skills, expectedSalary, source, notes } = body
    
    // Call backend API to create candidate
    const response = await fetch('http://localhost:5000/api/admin/candidates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        position,
        experience,
        skills,
        expectedSalary,
        source,
        notes
      })
    })
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Candidate created successfully',
      data
    })
  } catch (error) {
    console.error('Create candidate error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create candidate' },
      { status: 500 }
    )
  }
}

export const GET = getCandidates
export const POST = createCandidate