import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // Mock candidate data
    const candidate = {
      id,
      firstName: 'Nguyễn Văn',
      lastName: 'A',
      email: 'a.nguyen@example.com',
      phone: '0901234567',
      position: 'Senior Developer',
      experience: '5 years',
      skills: ['React', 'Node.js', 'TypeScript'],
      status: 'pending',
      aiScore: 85,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(candidate)

  } catch (error) {
    console.error('Error fetching candidate:', error)
    return NextResponse.json(
      { error: 'Failed to fetch candidate' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Mock update
    const updatedCandidate = {
      id,
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(updatedCandidate)

  } catch (error) {
    console.error('Error updating candidate:', error)
    return NextResponse.json(
      { error: 'Failed to update candidate' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // Mock delete
    return NextResponse.json({ message: 'Candidate deleted successfully' })

  } catch (error) {
    console.error('Error deleting candidate:', error)
    return NextResponse.json(
      { error: 'Failed to delete candidate' },
      { status: 500 }
    )
  }
}