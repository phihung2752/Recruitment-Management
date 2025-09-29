import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Call backend API
    const backendResponse = await fetch('http://localhost:5000/api/cv/collect-from-job-sites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (backendResponse.ok) {
      const result = await backendResponse.json()
      return NextResponse.json(result)
    } else {
      throw new Error('Backend API call failed')
    }
  } catch (error) {
    console.error('Error collecting CVs:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to collect CVs' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Call backend API
    const backendResponse = await fetch('http://localhost:5000/api/cv/collected-cvs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (backendResponse.ok) {
      const result = await backendResponse.json()
      return NextResponse.json(result)
    } else {
      throw new Error('Backend API call failed')
    }
  } catch (error) {
    console.error('Error getting collected CVs:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to get collected CVs' },
      { status: 500 }
    )
  }
}
