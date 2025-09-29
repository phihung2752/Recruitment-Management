"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Phone,
  Mail,
  FileDown,
  Upload,
  Eye,
  MoreHorizontal,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Building,
  DollarSign,
  BarChart3,
  PieChart,
  Star,
  FileText,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for employees since the API service might not be available
const mockEmployees = [
  {
    id: "1",
    employeeId: "EMP001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    position: "Senior Software Engineer",
    manager: "Jane Smith",
    hireDate: "2022-01-15",
    status: "Active" as const,
    salary: 95000,
    location: "New York",
    workType: "Full-time" as const,
    avatar: "",
    performance: {
      rating: 4,
      lastReview: "2023-12-01",
      goals: ["Complete React migration", "Mentor junior developers"],
    },
    attendance: {
      totalDays: 250,
      presentDays: 240,
      absentDays: 5,
      leaveDays: 5,
    },
  },
  {
    id: "2",
    employeeId: "EMP002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    phone: "+1 (555) 234-5678",
    department: "Product",
    position: "Product Manager",
    manager: "Bob Johnson",
    hireDate: "2021-03-20",
    status: "Active" as const,
    salary: 110000,
    location: "San Francisco",
    workType: "Full-time" as const,
    avatar: "",
    performance: {
      rating: 5,
      lastReview: "2023-11-15",
      goals: ["Launch new feature", "Improve user engagement"],
    },
    attendance: {
      totalDays: 250,
      presentDays: 245,
      absentDays: 3,
      leaveDays: 2,
    },
  },
  {
    id: "3",
    employeeId: "EMP003",
    firstName: "Mike",
    lastName: "Wilson",
    email: "mike.wilson@company.com",
    phone: "+1 (555) 345-6789",
    department: "Design",
    position: "UX Designer",
    manager: "Sarah Davis",
    hireDate: "2023-06-10",
    status: "On Leave" as const,
    salary: 75000,
    location: "Remote",
    workType: "Full-time" as const,
    avatar: "",
    performance: {
      rating: 3,
      lastReview: "2023-10-01",
      goals: ["Complete design system", "User research"],
    },
    attendance: {
      totalDays: 120,
      presentDays: 110,
      absentDays: 5,
      leaveDays: 5,
    },
  },
]

export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position: string
  manager: string
  hireDate: string
  status: "Active" | "Inactive" | "On Leave" | "Terminated"
  salary: number
  location: string
  workType: "Full-time" | "Part-time" | "Contract" | "Intern"
  avatar?: string
  performance?: {
    rating: number
    lastReview: string
    goals: string[]
  }
  attendance?: {
    totalDays: number
    presentDays: number
    absentDays: number
    leaveDays: number
  }
  documents?: {
    contract: string
    id: string
    certificates: string[]
  }
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  notes?: string
}

export interface CreateEmployeeRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position: string
  manager: string
  salary: number
  location: string
  workType: Employee["workType"]
}

export default function EmployeesPage() {
  const { toast } = useToast()
  const { t } = useLanguage()

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("All")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [workTypeFilter, setWorkTypeFilter] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("hireDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // State for selected employee and dialogs
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    manager: "",
    salary: 0,
    location: "",
    workType: "Full-time",
  })

  // State for API data
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/employees?page=${currentPage}&pageSize=${itemsPerPage}&search=${searchTerm}&department=${departmentFilter}&status=${statusFilter}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch employees')
        }
        
        const data = await response.json()
        // Map API response to Employee interface
        const mappedEmployees = (data.employees || []).map((emp: any) => ({
          id: emp.Id,
          employeeId: emp.EmployeeCode,
          firstName: emp.FirstName,
          lastName: emp.LastName,
          email: emp.Email,
          phone: emp.PhoneNumber || "",
          department: emp.Department,
          position: emp.Position,
          manager: emp.Manager,
          hireDate: emp.HireDate,
          status: emp.Status as "Active" | "Inactive" | "On Leave" | "Terminated",
          salary: emp.Salary,
          location: emp.Location,
          workType: emp.WorkType as "Full-time" | "Part-time" | "Contract" | "Intern",
          avatar: emp.Avatar,
          performance: {
            rating: 4, // Default value since it's not in the API response
            lastReview: "2023-12-01", // Default value
            goals: ["Complete project tasks", "Improve skills"] // Default value
          },
          attendance: {
            totalDays: 250, // Default value
            presentDays: 240, // Default value
            absentDays: 5, // Default value
            leaveDays: 5 // Default value
          }
        }))
        setEmployees(mappedEmployees)
      } catch (err) {
        setError(err as Error)
        // Fallback to mock data on error
        setEmployees(mockEmployees)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [currentPage, itemsPerPage, searchTerm, departmentFilter, statusFilter])

  // Ensure employees is always an array
  const safeEmployees = employees || []

  // Filter and search logic
  const filteredEmployees = safeEmployees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "All" || employee.department === departmentFilter
    const matchesStatus = statusFilter === "All" || employee.status === statusFilter
    const matchesWorkType = workTypeFilter === "All" || employee.workType === workTypeFilter

    return matchesSearch && matchesDepartment && matchesStatus && matchesWorkType
  })

  // Sort logic
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Employee]
    let bValue: any = b[sortBy as keyof Employee]

    if (sortBy === "hireDate") {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    } else if (sortBy === "name") {
      aValue = `${a.firstName} ${a.lastName}`
      bValue = `${b.firstName} ${b.lastName}`
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentEmployees = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage)

  // Statistics
  const stats = {
    total: safeEmployees.length,
    active: safeEmployees.filter((e) => e.status === "Active").length,
    onLeave: safeEmployees.filter((e) => e.status === "On Leave").length,
    avgPerformance:
      safeEmployees.length > 0
        ? safeEmployees.reduce((sum, e) => sum + (e.performance?.rating || 0), 0) / safeEmployees.length
        : 0,
  }

  const departments = [...new Set(safeEmployees.map((e) => e.department).filter(Boolean))]

  // Handlers
  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
  }

  const handleCreateEmployee = async () => {
    // Mock implementation - replace with actual API call
    toast({
      title: t("Success"),
      description: t("Employee created successfully."),
    })
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleUpdateEmployeeStatus = async (employeeId: string, newStatus: Employee["status"]) => {
    // Mock implementation - replace with actual API call
    toast({
      title: t("Success"),
      description: t("Employee status updated successfully."),
    })
    if (selectedEmployee?.id === employeeId) {
      setSelectedEmployee({ ...selectedEmployee, status: newStatus })
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedEmployees.length === 0) {
      toast({
        title: t("No Selection"),
        description: t("Please select employees first."),
        variant: "destructive",
      })
      return
    }

    switch (action) {
      case "deactivate":
        toast({
          title: t("Success"),
          description: t("Selected employees deactivated."),
        })
        setSelectedEmployees([])
        break
      case "export":
        handleExport()
        break
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      manager: "",
      salary: 0,
      location: "",
      workType: "Full-time",
    })
  }

  const handleExport = () => {
    const exportData = (
      selectedEmployees.length > 0 ? safeEmployees.filter((e) => selectedEmployees.includes(e.id)) : filteredEmployees
    ).map((employee) => ({
      "Employee ID": employee.employeeId,
      "First Name": employee.firstName,
      "Last Name": employee.lastName,
      Email: employee.email,
      Phone: employee.phone,
      Department: employee.department,
      Position: employee.position,
      Manager: employee.manager,
      "Hire Date": format(new Date(employee.hireDate), "yyyy-MM-dd"),
      Status: employee.status,
      Salary: employee.salary,
      Location: employee.location,
      "Work Type": employee.workType,
      "Performance Rating": employee.performance?.rating || 0,
    }))

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(exportData[0] || {}).join(",") +
      "\n" +
      exportData
        .map((row) =>
          Object.values(row)
            .map((val) => `"${val}"`)
            .join(","),
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `employees-${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: t("Export Successful"),
      description: t("Employee data has been exported successfully."),
    })
  }

  const getStatusColor = (status: Employee["status"]) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-gray-100 text-gray-800",
      "On Leave": "bg-yellow-100 text-yellow-800",
      Terminated: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getWorkTypeColor = (workType: Employee["workType"]) => {
    const colors = {
      "Full-time": "bg-blue-100 text-blue-800",
      "Part-time": "bg-purple-100 text-purple-800",
      Contract: "bg-orange-100 text-orange-800",
      Intern: "bg-pink-100 text-pink-800",
    }
    return colors[workType] || "bg-gray-100 text-gray-800"
  }

  // Show error state
  if (error && !loading) {
    return (
      <div className="space-y-4 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("Retry")}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{t("Employees")}</h1>
          <p className="text-muted-foreground">{t("Manage your organization's employees and their information")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {t("Refresh")}
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            {t("Export")}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                {t("Add Employee")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("Add New Employee")}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t("First Name")}</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("Last Name")}</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">{t("Email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t("Phone")}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">{t("Department")}</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select department")} />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                        <SelectItem value="Engineering">{t("Engineering")}</SelectItem>
                        <SelectItem value="Product">{t("Product")}</SelectItem>
                        <SelectItem value="Design">{t("Design")}</SelectItem>
                        <SelectItem value="Marketing">{t("Marketing")}</SelectItem>
                        <SelectItem value="Sales">{t("Sales")}</SelectItem>
                        <SelectItem value="HR">{t("HR")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="position">{t("Position")}</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manager">{t("Manager")}</Label>
                    <Input
                      id="manager"
                      value={formData.manager}
                      onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary">{t("Salary")}</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">{t("Location")}</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="workType">{t("Work Type")}</Label>
                    <Select
                      value={formData.workType}
                      onValueChange={(value: Employee["workType"]) => setFormData({ ...formData, workType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select work type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">{t("Full-time")}</SelectItem>
                        <SelectItem value="Part-time">{t("Part-time")}</SelectItem>
                        <SelectItem value="Contract">{t("Contract")}</SelectItem>
                        <SelectItem value="Intern">{t("Intern")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    resetForm()
                  }}
                >
                  {t("Cancel")}
                </Button>
                <Button onClick={handleCreateEmployee} disabled={loading}>
                  {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  {t("Add Employee")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Total Employees")}</p>
                {loading ? <Skeleton className="h-6 w-8" /> : <p className="text-xl font-bold">{stats.total}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Active")}</p>
                {loading ? <Skeleton className="h-6 w-8" /> : <p className="text-xl font-bold">{stats.active}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("On Leave")}</p>
                {loading ? <Skeleton className="h-6 w-8" /> : <p className="text-xl font-bold">{stats.onLeave}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Avg Performance")}</p>
                {loading ? (
                  <Skeleton className="h-6 w-8" />
                ) : (
                  <p className="text-xl font-bold">{stats.avgPerformance.toFixed(1)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("Search employees...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:w-auto w-full">
                <Filter className="mr-2 h-4 w-4" />
                {t("Filters")}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                >
                  <PieChart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("All Departments")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">{t("All Departments")}</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("All Statuses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">{t("All Statuses")}</SelectItem>
                    <SelectItem value="Active">{t("Active")}</SelectItem>
                    <SelectItem value="Inactive">{t("Inactive")}</SelectItem>
                    <SelectItem value="On Leave">{t("On Leave")}</SelectItem>
                    <SelectItem value="Terminated">{t("Terminated")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("All Work Types")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">{t("All Work Types")}</SelectItem>
                    <SelectItem value="Full-time">{t("Full-time")}</SelectItem>
                    <SelectItem value="Part-time">{t("Part-time")}</SelectItem>
                    <SelectItem value="Contract">{t("Contract")}</SelectItem>
                    <SelectItem value="Intern">{t("Intern")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Sort by")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hireDate">{t("Hire Date")}</SelectItem>
                    <SelectItem value="name">{t("Name")}</SelectItem>
                    <SelectItem value="department">{t("Department")}</SelectItem>
                    <SelectItem value="salary">{t("Salary")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedEmployees.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedEmployees.length} {t("employees selected")}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("export")}>
                  {t("Export Selected")}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleBulkAction("deactivate")}>
                  {t("Deactivate Selected")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {viewMode === "table" ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedEmployees.length === currentEmployees.length && currentEmployees.length > 0
                            }
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedEmployees(currentEmployees.map((e) => e.id))
                              } else {
                                setSelectedEmployees([])
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>{t("Employee")}</TableHead>
                        <TableHead className="hidden md:table-cell">{t("Department")}</TableHead>
                        <TableHead className="hidden lg:table-cell">{t("Position")}</TableHead>
                        <TableHead>{t("Status")}</TableHead>
                        <TableHead className="hidden xl:table-cell">{t("Performance")}</TableHead>
                        <TableHead>{t("Actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Skeleton className="h-4 w-4" />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Skeleton className="h-8 w-8 rounded-full" />
                                  <div>
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-20 mt-1" />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-16" />
                              </TableCell>
                              <TableCell className="hidden xl:table-cell">
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                            </TableRow>
                          ))
                        : currentEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedEmployees.includes(employee.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedEmployees([...selectedEmployees, employee.id])
                                    } else {
                                      setSelectedEmployees(selectedEmployees.filter((id) => id !== employee.id))
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={
                                        employee.avatar ||
                                        `https://api.dicebear.com/6.x/initials/svg?seed=${employee.firstName || "/placeholder.svg"} ${employee.lastName}`
                                      }
                                    />
                                    <AvatarFallback>
                                      {employee.firstName?.[0]}
                                      {employee.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {employee.firstName} {employee.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                              <TableCell className="hidden lg:table-cell">{employee.position}</TableCell>
                              <TableCell>
                                <Badge className={cn("text-xs", getStatusColor(employee.status))}>
                                  {t(employee.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden xl:table-cell">
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={cn(
                                        "h-4 w-4",
                                        star <= (employee.performance?.rating || 0)
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300",
                                      )}
                                    />
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleSelectEmployee(employee)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div>
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32 mt-1" />
                                <Skeleton className="h-3 w-20 mt-1" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-4" />
                          </div>
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-16" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-20" />
                          <div className="flex justify-between items-center pt-2">
                            <Skeleton className="h-8 w-20" />
                            <div className="flex space-x-1">
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-8 w-8" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : currentEmployees.map((employee) => (
                    <Card key={employee.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage
                                  src={
                                    employee.avatar ||
                                    `https://api.dicebear.com/6.x/initials/svg?seed=${employee.firstName || "/placeholder.svg"} ${employee.lastName}`
                                  }
                                />
                                <AvatarFallback>
                                  {employee.firstName?.[0]}
                                  {employee.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">
                                  {employee.firstName} {employee.lastName}
                                </h3>
                                <p className="text-sm text-muted-foreground">{employee.position}</p>
                                <p className="text-xs text-muted-foreground">{employee.employeeId}</p>
                              </div>
                            </div>
                            <Checkbox
                              checked={selectedEmployees.includes(employee.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedEmployees([...selectedEmployees, employee.id])
                                } else {
                                  setSelectedEmployees(selectedEmployees.filter((id) => id !== employee.id))
                                }
                              }}
                            />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge className={cn("text-xs", getStatusColor(employee.status))}>
                              {t(employee.status)}
                            </Badge>
                            <Badge className={cn("text-xs", getWorkTypeColor(employee.workType))}>
                              {t(employee.workType)}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>{employee.department}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3" />
                              <span>${employee.salary?.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-4 w-4",
                                  star <= (employee.performance?.rating || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300",
                                )}
                              />
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <Button variant="outline" size="sm" onClick={() => handleSelectEmployee(employee)}>
                              {t("View Details")}
                            </Button>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Phone className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  {t("Previous")}
                </Button>
                <span className="text-sm">
                  {t("Page")} {currentPage} {t("of")} {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {t("Next")}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Employee Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedEmployee ? (
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t("Employee Details")}
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEmployee(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
                      <TabsTrigger value="performance">{t("Performance")}</TabsTrigger>
                      <TabsTrigger value="documents">{t("Documents")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={
                              selectedEmployee.avatar ||
                              `https://api.dicebear.com/6.x/initials/svg?seed=${selectedEmployee.firstName || "/placeholder.svg"} ${selectedEmployee.lastName}`
                            }
                          />
                          <AvatarFallback>
                            {selectedEmployee.firstName?.[0]}
                            {selectedEmployee.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {selectedEmployee.firstName} {selectedEmployee.lastName}
                          </h3>
                          <p className="text-muted-foreground">{selectedEmployee.position}</p>
                          <p className="text-sm text-muted-foreground">{selectedEmployee.employeeId}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">{t("Status")}</Label>
                          <Select
                            value={selectedEmployee.status}
                            onValueChange={(value: Employee["status"]) =>
                              handleUpdateEmployeeStatus(selectedEmployee.id, value)
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">{t("Active")}</SelectItem>
                              <SelectItem value="Inactive">{t("Inactive")}</SelectItem>
                              <SelectItem value="On Leave">{t("On Leave")}</SelectItem>
                              <SelectItem value="Terminated">{t("Terminated")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm font-medium">{t("Email")}</Label>
                            <p className="text-sm mt-1">{selectedEmployee.email}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">{t("Phone")}</Label>
                            <p className="text-sm mt-1">{selectedEmployee.phone}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">{t("Department")}</Label>
                          <p className="text-sm mt-1">{selectedEmployee.department}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">{t("Manager")}</Label>
                          <p className="text-sm mt-1">{selectedEmployee.manager}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">{t("Hire Date")}</Label>
                          <p className="text-sm mt-1">{format(new Date(selectedEmployee.hireDate), "MMM dd, yyyy")}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">{t("Location")}</Label>
                          <p className="text-sm mt-1">{selectedEmployee.location}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">{t("Work Type")}</Label>
                          <Badge className={cn("text-xs mt-1", getWorkTypeColor(selectedEmployee.workType))}>
                            {t(selectedEmployee.workType)}
                          </Badge>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">{t("Salary")}</Label>
                          <p className="text-sm mt-1">${selectedEmployee.salary?.toLocaleString()}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">{t("Overall Rating")}</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn(
                                    "h-5 w-5",
                                    star <= (selectedEmployee.performance?.rating || 0)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300",
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{selectedEmployee.performance?.rating || 0}/5</span>
                          </div>
                        </div>

                        {selectedEmployee.performance?.lastReview && (
                          <div>
                            <Label className="text-sm font-medium">{t("Last Review")}</Label>
                            <p className="text-sm mt-1">
                              {format(new Date(selectedEmployee.performance.lastReview), "MMM dd, yyyy")}
                            </p>
                          </div>
                        )}

                        {selectedEmployee.attendance && (
                          <div>
                            <Label className="text-sm font-medium">{t("Attendance")}</Label>
                            <div className="space-y-2 mt-1">
                              <div className="flex justify-between text-sm">
                                <span>{t("Present Days")}</span>
                                <span>
                                  {selectedEmployee.attendance.presentDays}/{selectedEmployee.attendance.totalDays}
                                </span>
                              </div>
                              <Progress
                                value={
                                  (selectedEmployee.attendance.presentDays / selectedEmployee.attendance.totalDays) *
                                  100
                                }
                                className="h-2"
                              />
                              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                <div>
                                  {t("Absent")}: {selectedEmployee.attendance.absentDays}
                                </div>
                                <div>
                                  {t("Leave")}: {selectedEmployee.attendance.leaveDays}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">{t("Contract")}</Label>
                          <Button variant="outline" size="sm" className="w-full justify-start mt-1 bg-transparent">
                            <FileText className="mr-2 h-4 w-4" />
                            {t("View Contract")}
                          </Button>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">{t("ID Document")}</Label>
                          <Button variant="outline" size="sm" className="w-full justify-start mt-1 bg-transparent">
                            <FileText className="mr-2 h-4 w-4" />
                            {t("View ID")}
                          </Button>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">{t("Certificates")}</Label>
                          <div className="space-y-2 mt-1">
                            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                              <Award className="mr-2 h-4 w-4" />
                              {t("Certificate")} 1
                            </Button>
                          </div>
                        </div>

                        <Button className="w-full bg-transparent" variant="outline">
                          <Upload className="mr-2 h-4 w-4" />
                          {t("Upload Document")}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("Select an Employee")}</h3>
                <p className="text-muted-foreground">
                  {t("Choose an employee from the list to view their details and manage their information.")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
