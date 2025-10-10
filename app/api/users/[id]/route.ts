import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    
    console.log('Fetching user profile for ID:', userId)

    // Forward to backend API
    const backendResponse = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await backendResponse.json()
    
    if (data.success) {
      return NextResponse.json({ 
        success: true, 
        user: data.user 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: data.message || 'Failed to fetch user profile' 
      }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}