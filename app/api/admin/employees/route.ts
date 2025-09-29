import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'
    const search = searchParams.get('search') || null
    const department = searchParams.get('department') || null
    const status = searchParams.get('status') || null

    // Build query parameters
    const queryParams = new URLSearchParams({
      page,
      pageSize,
      ...(search && { search }),
      ...(department && { department }),
      ...(status && { status })
    })

    // For now, return mock data that matches the backend response structure
    // This will be replaced with actual API call once SSL issues are resolved
    const mockData = {
      employees: [
        {
          Id: "emp-1",
          EmployeeCode: "EMP001",
          FirstName: "Nguyễn Văn",
          LastName: "An",
          Email: "nguyen.van.an@company.com",
          PhoneNumber: "+84 123 456 789",
          Avatar: null,
          Department: "Công nghệ thông tin",
          Position: "Lập trình viên Senior",
          Manager: "Trần Thị Bình",
          HireDate: "2022-01-15",
          TerminationDate: null,
          Salary: 25000000,
          Status: "Active",
          WorkType: "Full-time",
          Location: "Hồ Chí Minh",
          CreatedAt: "2022-01-15T00:00:00Z",
          UpdatedAt: "2024-01-15T00:00:00Z"
        },
        {
          Id: "emp-2",
          EmployeeCode: "EMP002",
          FirstName: "Lê Thị",
          LastName: "Cẩm",
          Email: "le.thi.cam@company.com",
          PhoneNumber: "+84 987 654 321",
          Avatar: null,
          Department: "Nhân sự",
          Position: "Chuyên viên nhân sự",
          Manager: "Phạm Văn Đức",
          HireDate: "2021-03-20",
          TerminationDate: null,
          Salary: 18000000,
          Status: "Active",
          WorkType: "Full-time",
          Location: "Hà Nội",
          CreatedAt: "2021-03-20T00:00:00Z",
          UpdatedAt: "2024-01-15T00:00:00Z"
        },
        {
          Id: "emp-3",
          EmployeeCode: "EMP003",
          FirstName: "Hoàng Văn",
          LastName: "Dũng",
          Email: "hoang.van.dung@company.com",
          PhoneNumber: "+84 555 123 456",
          Avatar: null,
          Department: "Kế toán",
          Position: "Kế toán trưởng",
          Manager: "Nguyễn Thị Em",
          HireDate: "2020-06-10",
          TerminationDate: null,
          Salary: 22000000,
          Status: "Active",
          WorkType: "Full-time",
          Location: "Đà Nẵng",
          CreatedAt: "2020-06-10T00:00:00Z",
          UpdatedAt: "2024-01-15T00:00:00Z"
        }
      ],
      totalCount: 3,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: 1
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}
