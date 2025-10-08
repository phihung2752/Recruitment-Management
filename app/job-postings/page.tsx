"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import ProtectedRoute from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Briefcase, Users } from 'lucide-react'

interface JobPosting {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  workType: string
  employmentType: string
  experienceLevel: string
  status: string
  publishedAt: string | null
  applicationDeadline: string | null
  numberOfPositions: number
  applicationsCount: number
  viewsCount: number
  hiredCount: number
  createdAt: string
  updatedAt: string
}

interface JobStats {
  totalJobs: number
  activeJobs: number
  draftJobs: number
  totalApplications: number
  totalViews: number
  hireRate: number
}

export default function JobPostingsPage() {
  const { user, isAuthenticated } = useAuth()
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [stats, setStats] = useState<JobStats>({
    totalJobs: 0,
    activeJobs: 0,
    draftJobs: 0,
    totalApplications: 0,
    totalViews: 0,
    hireRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [experienceFilter, setExperienceFilter] = useState("All")
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [creating, setCreating] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    workType: 'Full-time',
    employmentType: 'Permanent',
    experienceLevel: 'Mid',
    numberOfPositions: 1,
    applicationDeadline: ''
  })

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle create job posting
  const handleCreateJob = async () => {
    try {
      setCreating(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/job-postings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          location: formData.location,
          workType: formData.workType,
          employmentType: formData.employmentType,
          experienceLevel: formData.experienceLevel,
          numberOfPositions: formData.numberOfPositions,
          applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null,
          status: 'Draft' // Start as draft, needs approval
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Job posting created:', result)
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          requirements: '',
          location: '',
          workType: 'Full-time',
          employmentType: 'Permanent',
          experienceLevel: 'Mid',
          numberOfPositions: 1,
          applicationDeadline: ''
        })
        
        // Close dialog
        setShowCreateDialog(false)
        
        // Refresh job postings
        window.location.reload()
        
        alert('Job posting created successfully! It will be reviewed before publishing.')
      } else {
        const error = await response.json()
        console.error('❌ Error creating job posting:', error)
        alert('Failed to create job posting. Please try again.')
      }
    } catch (error) {
      console.error('❌ Error creating job posting:', error)
      alert('Failed to create job posting. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  // Fetch real data from API
  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch('/api/job-postings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setJobs(data.jobPostings || [])
          setJobPostings(data.jobPostings || [])
          setFilteredJobs(data.jobPostings || [])
          setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
          
          // Calculate stats
          const jobPostings = data.jobPostings || []
          const totalJobs = jobPostings.length
          const activeJobs = jobPostings.filter((job: JobPosting) => job.status === 'Active').length
          const draftJobs = jobPostings.filter((job: JobPosting) => job.status === 'Draft').length
          const totalApplications = jobPostings.reduce((sum: number, job: JobPosting) => sum + (job.applicationsCount || 0), 0)
          const totalViews = jobPostings.reduce((sum: number, job: JobPosting) => sum + (job.viewsCount || 0), 0)
          const hiredCount = jobPostings.reduce((sum: number, job: JobPosting) => sum + (job.hiredCount || 0), 0)
          const hireRate = totalApplications > 0 ? (hiredCount / totalApplications) * 100 : 0
        
          setStats({
            totalJobs,
            activeJobs,
            draftJobs,
            totalApplications,
            totalViews,
            hireRate
          })
        } else {
          console.error('Failed to fetch job postings:', response.statusText)
          setJobs([])
          setJobPostings([])
          setFilteredJobs([])
        }
      } catch (error) {
        console.error('Error fetching job postings:', error)
        setJobs([])
        setJobPostings([])
        setFilteredJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobPostings()
  }, [])


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Draft': return 'bg-yellow-100 text-yellow-800'
      case 'Closed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Active': return 'Active'
      case 'Draft': return 'Draft'
      case 'Closed': return 'Closed'
      default: return status
    }
  }

  const getExperienceText = (level: string) => {
    switch (level) {
      case 'Entry': return 'Entry Level'
      case 'Mid': return 'Mid Level'
      case 'Senior': return 'Senior Level'
      case 'Lead': return 'Lead Level'
      default: return level
    }
  }

  const getEmploymentTypeText = (type: string) => {
    switch (type) {
      case 'Permanent': return 'Permanent'
      case 'Contract': return 'Contract'
      case 'Internship': return 'Internship'
      default: return type
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleJobAction = (action: string, jobId: string) => {
    console.log(`${action} job ${jobId}`)
  }

  if (!isAuthenticated) {
    return <div>Please log in to view job postings.</div>
  }

  return (
    <ProtectedRoute requiredPermissions={['job.read']}>
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-hr-text-primary">Job Postings</h2>
            <p className="text-hr-text-secondary">Create and manage job postings.</p>
          </div>
          <Button 
            className="bg-hr-primary text-white hover:bg-hr-primary/90 hover:shadow-md transition-all"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Job Posting
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-secondary">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hr-text-primary">{stats.totalJobs}</div>
            </CardContent>
          </Card>
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-secondary">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeJobs}</div>
            </CardContent>
          </Card>
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-secondary">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hr-text-primary">{stats.totalApplications}</div>
            </CardContent>
          </Card>
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-secondary">Hire Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hr-text-primary">{stats.hireRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search job postings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-hr-bg-secondary border-hr-border text-hr-text-primary"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-hr-bg-secondary border-hr-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Postings List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-8 text-hr-text-secondary">Loading...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-hr-text-secondary">No job postings found.</div>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md hover:scale-105 transition-all bg-hr-bg-secondary border-hr-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-hr-text-primary">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-hr-text-secondary">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.workType}
                        </span>
                        <span>•</span>
                        <span>{getEmploymentTypeText(job.employmentType)}</span>
                        <span>•</span>
                        <span>{getExperienceText(job.experienceLevel)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(job.status)}>
                          {getStatusText(job.status)}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedJob(job)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleJobAction('edit', job.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleJobAction('delete', job.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-hr-text-secondary mb-4">{job.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-hr-text-primary">Requirements:</h4>
                    <p className="text-sm text-hr-text-secondary">{job.requirements}</p>
                  </div>
                  {job.applicationDeadline && (
                    <div className="mt-4 text-sm text-hr-text-secondary flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Application deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-4 text-sm text-hr-text-secondary">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applicationsCount} applications
                    </span>
                    <span>{job.viewsCount} views</span>
                    <span>{job.hiredCount} hired</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create Job Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new job posting.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="bg-hr-bg-secondary border-hr-border text-hr-text-primary"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role and responsibilities..."
                  rows={3}
                  className="bg-hr-bg-secondary border-hr-border text-hr-text-primary"
                />
              </div>
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="List the required skills and qualifications..."
                  rows={3}
                  className="bg-hr-bg-secondary border-hr-border text-hr-text-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. Ho Chi Minh City"
                    className="bg-hr-bg-secondary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="workType">Work Type</Label>
                  <Select value={formData.workType} onValueChange={(value) => handleInputChange('workType', value)}>
                    <SelectTrigger className="bg-hr-bg-secondary border-hr-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(value) => handleInputChange('employmentType', value)}>
                    <SelectTrigger className="bg-hr-bg-secondary border-hr-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Permanent">Permanent</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                    <SelectTrigger className="bg-hr-bg-secondary border-hr-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry">Entry Level</SelectItem>
                      <SelectItem value="Mid">Mid Level</SelectItem>
                      <SelectItem value="Senior">Senior Level</SelectItem>
                      <SelectItem value="Lead">Lead Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numberOfPositions">Number of Positions</Label>
                  <Input
                    id="numberOfPositions"
                    type="number"
                    min="1"
                    value={formData.numberOfPositions}
                    onChange={(e) => handleInputChange('numberOfPositions', parseInt(e.target.value) || 1)}
                    className="bg-hr-bg-secondary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="applicationDeadline">Application Deadline</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                    className="bg-hr-bg-secondary border-hr-border text-hr-text-primary"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateJob}
                disabled={creating || !formData.title || !formData.description}
                className="bg-hr-primary text-white hover:bg-hr-primary/90 hover:shadow-md transition-all"
              >
                {creating ? 'Creating...' : 'Create Job Posting'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}