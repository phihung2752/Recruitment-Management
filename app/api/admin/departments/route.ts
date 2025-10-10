import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://localhost:5000/api/admin/departments')
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}
