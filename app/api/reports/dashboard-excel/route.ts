import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔥 API: Exporting dashboard Excel report...')
    
    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/reports/dashboard-excel`, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })

    if (!response.ok) {
      console.error('❌ Backend API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to generate Excel report' },
        { status: response.status }
      )
    }

    // Get the Excel file data
    const excelBuffer = await response.arrayBuffer()
    
    // Get filename from backend response headers
    const contentDisposition = response.headers.get('content-disposition')
    let filename = 'dashboard-report.xlsx'
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    } else {
      // Fallback to default filename with date
      filename = `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`
    }

    console.log('✅ API: Excel report generated successfully')

    // Return the Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error while generating Excel report' },
      { status: 500 }
    )
  }
}

