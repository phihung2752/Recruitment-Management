import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const source = searchParams.get('source') || ''

    const offset = (page - 1) * limit

    // Build WHERE clause
    let whereConditions = []
    let params = []

    if (search) {
      whereConditions.push('(candidateName LIKE ? OR email LIKE ? OR position LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (status) {
      whereConditions.push('status = ?')
      params.push(status)
    }

    if (source) {
      whereConditions.push('source = ?')
      params.push(source)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countResult = await executeQuery(`
      SELECT COUNT(*) as total
      FROM CVAnalysis c
      ${whereClause}
    `, params)

    const total = countResult[0]?.total || 0

    // Get CVs with pagination
    const cvs = await executeQuery(`
      SELECT 
        c.id,
        c.candidateName,
        c.email,
        c.phone,
        c.position,
        c.aiScore,
        c.status,
        c.source,
        c.sourceName,
        c.appliedDate,
        c.skills,
        c.experience,
        c.education,
        c.expectedSalary,
        c.tags,
        c.isStarCandidate,
        c.isReapplicant,
        c.applicationCount,
        c.lastInterviewDate,
        c.lastInterviewResult,
        c.notes,
        c.cvUrl,
        c.jobMatch,
        c.cvQuality,
        c.strengths,
        c.weaknesses,
        c.missingSkills,
        c.redFlags,
        c.recommendations,
        c.createdAt,
        c.updatedAt
      FROM CVAnalysis c
      ${whereClause}
      ORDER BY c.createdAt DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    return NextResponse.json({
      cvs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching CVs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CVs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      candidateName,
      email,
      phone,
      position,
      aiScore,
      status,
      source,
      sourceName,
      appliedDate,
      skills,
      experience,
      education,
      expectedSalary,
      tags,
      isStarCandidate,
      isReapplicant,
      applicationCount,
      lastInterviewDate,
      lastInterviewResult,
      notes,
      cvUrl,
      jobMatch,
      cvQuality,
      strengths,
      weaknesses,
      missingSkills,
      redFlags,
      recommendations
    } = body

    const result = await executeQuery(`
      INSERT INTO CVAnalysis (
        candidateName, email, phone, position, aiScore, status, source, sourceName,
        appliedDate, skills, experience, education, expectedSalary, tags,
        isStarCandidate, isReapplicant, applicationCount, lastInterviewDate,
        lastInterviewResult, notes, cvUrl, jobMatch, cvQuality, strengths,
        weaknesses, missingSkills, redFlags, recommendations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      candidateName, email, phone, position, aiScore || 0, status || 'new', source, sourceName,
      appliedDate, JSON.stringify(skills || []), experience, education, expectedSalary, JSON.stringify(tags || []),
      isStarCandidate || false, isReapplicant || false, applicationCount || 1, lastInterviewDate,
      lastInterviewResult, notes, cvUrl, jobMatch || 0, cvQuality || 0, JSON.stringify(strengths || []),
      JSON.stringify(weaknesses || []), JSON.stringify(missingSkills || []), JSON.stringify(redFlags || []), JSON.stringify(recommendations || [])
    ])

    return NextResponse.json({
      success: true,
      id: (result as any).insertId
    })

  } catch (error) {
    console.error('Error creating CV:', error)
    return NextResponse.json(
      { error: 'Failed to create CV' },
      { status: 500 }
    )
  }
}




