"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useToast } from "@/components/ui/use-toast"
import { Edit, X, Eye, FileDown, Plus, RefreshCw, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { jobPostsService, type JobPost, type CreateJobPostRequest } from "@/lib/api-services/job-posts-service"
import { useApi, useMutation } from "@/hooks/use-api"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function JobPostingsPage() {
  const { toast } = useToast()
  const { t } = useLanguage()

  // State for filters and pagination
  const [departmentFilter, setDepartmentFilter] = useState<string>("All")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // State for create/edit dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPost | null>(null)
  const [formData, setFormData] = useState<CreateJobPostRequest>({
    title: "",
    department: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    expiryDate: "",
    isRemote: false,
    employmentType: "Full-time",
  })

  // API hooks
  const { data: jobPostings = [], loading, error, refetch } = useApi(() => jobPostsService.getJobPosts())

  const createMutation = useMutation(jobPostsService.createJobPost)
  const updateMutation = useMutation((params: { id: number; data: Partial<CreateJobPostRequest> }) =>
    jobPostsService.updateJobPost(params.id, params.data),
  )
  const deleteMutation = useMutation(jobPostsService.deleteJobPost)
  const statusMutation = useMutation((params: { id: number; status: JobPost["status"] }) =>
    jobPostsService.changeJobPostStatus(params.id, params.status),
  )

  // Filter job postings
  const filteredJobPostings = (jobPostings || []).filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "All" || job.department === departmentFilter
    const matchesStatus = statusFilter === "All" || job.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredJobPostings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredJobPostings.length / itemsPerPage)

  // Statistics
  const activeJobs = (jobPostings || []).filter((job) => job.status === "Published").length
  const pendingJobs = (jobPostings || []).filter((job) => job.status === "Pending Approval").length
  const expiredJobs = (jobPostings || []).filter((job) => job.status === "Expired").length

  // Chart data
  const jobStatusData = (jobPostings || []).reduce(
    (acc, job) => {
      if (job?.status) {
        acc[job.status] = (acc[job.status] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const pieChartData = Object.entries(jobStatusData).map(([name, value]) => ({ name, value }))

  // Handlers
  const handleCreateJob = async () => {
    const result = await createMutation.mutate(formData)
    if (result) {
      setIsCreateDialogOpen(false)
      resetForm()
      refetch()
    }
  }

  const handleUpdateJob = async () => {
    if (!editingJob) return

    const result = await updateMutation.mutate({
      id: editingJob.id,
      data: formData,
    })
    if (result) {
      setEditingJob(null)
      resetForm()
      refetch()
    }
  }

  const handleDeleteJob = async (jobId: number) => {
    if (confirm(t("Are you sure you want to delete this job posting?"))) {
      const result = await deleteMutation.mutate(jobId)
      if (result !== null) {
        refetch()
      }
    }
  }

  const handleStatusChange = async (jobId: number, newStatus: JobPost["status"]) => {
    const result = await statusMutation.mutate({ id: jobId, status: newStatus })
    if (result) {
      refetch()
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      description: "",
      requirements: "",
      location: "",
      salary: "",
      expiryDate: "",
      isRemote: false,
      employmentType: "Full-time",
    })
  }

  const openEditDialog = (job: JobPost) => {
    setEditingJob(job)
    // Load job details for editing
    setFormData({
      title: job.title,
      department: job.department,
      description: "",
      requirements: "",
      location: "",
      salary: "",
      expiryDate: "",
      isRemote: false,
      employmentType: "Full-time",
    })
  }

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,Department,Status,Applicants\n" +
      filteredJobPostings
        .map((job) => `"${job.title}","${job.department}","${job.status}",${job.applicants}`)
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "job_postings.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: JobPost["status"]) => {
    switch (status) {
      case "Published":
        return "bg-green-500"
      case "Pending Approval":
        return "bg-yellow-500"
      case "Approved":
        return "bg-blue-500"
      case "Draft":
        return "bg-gray-500"
      case "Expired":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Show error state
  if (error && !loading) {
    return (
      <div className="space-y-4 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("Retry")}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">{t("Job Postings")}</h1>
        <div className="flex gap-2">
          <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {t("Refresh")}
          </Button>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            {t("Export to CSV")}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t("Create Job")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingJob ? t("Edit Job") : t("Create New Job")}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    {t("Job Title")}
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    {t("Department")}
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("Select Department")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">{t("Engineering")}</SelectItem>
                      <SelectItem value="Product">{t("Product")}</SelectItem>
                      <SelectItem value="Design">{t("Design")}</SelectItem>
                      <SelectItem value="Marketing">{t("Marketing")}</SelectItem>
                      <SelectItem value="Sales">{t("Sales")}</SelectItem>
                      <SelectItem value="HR">{t("HR")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    {t("Description")}
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="requirements" className="text-right">
                    {t("Requirements")}
                  </Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    {t("Location")}
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="salary" className="text-right">
                    {t("Salary")}
                  </Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., $50,000 - $70,000"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiryDate" className="text-right">
                    {t("Expiry Date")}
                  </Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    setEditingJob(null)
                    resetForm()
                  }}
                >
                  {t("Cancel")}
                </Button>
                <Button
                  onClick={editingJob ? handleUpdateJob : handleCreateJob}
                  disabled={createMutation.loading || updateMutation.loading}
                >
                  {(createMutation.loading || updateMutation.loading) && (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingJob ? t("Update") : t("Create")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Active Jobs")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{activeJobs}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Pending Approval")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{pendingJobs}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Expired Jobs")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{expiredJobs}</div>}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder={t("Search jobs...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("Department")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">{t("All Departments")}</SelectItem>
            <SelectItem value="Engineering">{t("Engineering")}</SelectItem>
            <SelectItem value="Product">{t("Product")}</SelectItem>
            <SelectItem value="Design">{t("Design")}</SelectItem>
            <SelectItem value="Marketing">{t("Marketing")}</SelectItem>
            <SelectItem value="Sales">{t("Sales")}</SelectItem>
            <SelectItem value="HR">{t("HR")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("Status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">{t("All Statuses")}</SelectItem>
            <SelectItem value="Draft">{t("Draft")}</SelectItem>
            <SelectItem value="Pending Approval">{t("Pending Approval")}</SelectItem>
            <SelectItem value="Approved">{t("Approved")}</SelectItem>
            <SelectItem value="Published">{t("Published")}</SelectItem>
            <SelectItem value="Expired">{t("Expired")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Job Title")}</TableHead>
                <TableHead>{t("Department")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead>{t("Applicants")}</TableHead>
                <TableHead>{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                : currentItems.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>
                        <Select
                          value={job.status}
                          onValueChange={(value: JobPost["status"]) => handleStatusChange(job.id, value)}
                          disabled={statusMutation.loading}
                        >
                          <SelectTrigger className="w-auto">
                            <Badge className={`${getStatusColor(job.status)} text-white`}>{t(job.status)}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Draft">{t("Draft")}</SelectItem>
                            <SelectItem value="Pending Approval">{t("Pending Approval")}</SelectItem>
                            <SelectItem value="Approved">{t("Approved")}</SelectItem>
                            <SelectItem value="Published">{t("Published")}</SelectItem>
                            <SelectItem value="Expired">{t("Expired")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{job.applicants}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(job)}
                            disabled={updateMutation.loading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={deleteMutation.loading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>{job.title}</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">{t("Department")}</Label>
                                  <div className="col-span-3">{job.department}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">{t("Status")}</Label>
                                  <div className="col-span-3">
                                    <Badge className={`${getStatusColor(job.status)} text-white`}>
                                      {t(job.status)}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">{t("Applicants")}</Label>
                                  <div className="col-span-3">{job.applicants}</div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-4 flex justify-center">
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

        {/* Chart */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("Job Status Distribution")}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
