"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type JobPosting = {
  id: number
  title: string
  department: string
  status: "Draft" | "Pending Approval" | "Approved" | "Published" | "Expired"
  applicants: number
  description: string
  requirements: string
  salary: string
  location: string
  publishDate?: string
  expiryDate?: string
  views: number
  applications: number
}

const initialJobPostings: JobPosting[] = [
  { id: 1, title: "Software Engineer", department: "Engineering", status: "Published", applicants: 15, description: "We are looking for a skilled software engineer...", requirements: "5+ years of experience in React and Node.js", salary: "$80,000 - $120,000", location: "New York, NY", publishDate: "2023-06-01", expiryDate: "2023-07-01", views: 500, applications: 15 },
  { id: 2, title: "Product Manager", department: "Product", status: "Expired", applicants: 30, description: "We need an experienced product manager...", requirements: "3+ years of product management experience", salary: "$90,000 - $130,000", location: "San Francisco, CA", publishDate: "2023-05-01", expiryDate: "2023-06-01", views: 800, applications: 30 },
  { id: 3, title: "UX Designer", department: "Design", status: "Pending Approval", applicants: 0, description: "Join our design team as a UX designer...", requirements: "Portfolio showcasing user-centered design projects", salary: "$70,000 - $100,000", location: "Remote", views: 0, applications: 0 },
]

export default function JobPostingsPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(initialJobPostings)
  const [newJob, setNewJob] = useState<Omit<JobPosting, "id" | "applicants" | "views" | "applications">>({
    title: "",
    department: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    status: "Draft"
  })
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [editMode, setEditMode] = useState(false)
  const { t } = useLanguage()

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault()
    const newJobPosting: JobPosting = {
      id: jobPostings.length + 1,
      ...newJob,
      applicants: 0,
      views: 0,
      applications: 0
    }
    setJobPostings([...jobPostings, newJobPosting])
    setNewJob({
      title: "",
      department: "",
      description: "",
      requirements: "",
      salary: "",
      location: "",
      status: "Draft"
    })
  }

  const handleSelectJob = (job: JobPosting) => {
    setSelectedJob(job)
    setEditMode(false)
  }

  const handleUpdateJobStatus = (id: number, newStatus: JobPosting["status"]) => {
    setJobPostings(jobPostings.map(job => 
      job.id === id ? { ...job, status: newStatus } : job
    ))
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob({ ...selectedJob, status: newStatus })
    }
  }

  const handleEditJob = () => {
    if (selectedJob) {
      setJobPostings(jobPostings.map(job => 
        job.id === selectedJob.id ? selectedJob : job
      ))
      setEditMode(false)
    }
  }

  const handleOptimizeJob = (id: number) => {
    // In a real application, this would involve more complex logic
    alert(t("Job posting optimized"))
  }

  const handlePublishJob = (id: number) => {
    const now = new Date()
    const expiryDate = new Date(now.setMonth(now.getMonth() + 1)) // Set expiry to one month from now
    handleUpdateJobStatus(id, "Published")
    setJobPostings(jobPostings.map(job => 
      job.id === id ? { ...job, publishDate: new Date().toISOString().split('T')[0], expiryDate: expiryDate.toISOString().split('T')[0] } : job
    ))
  }

  useEffect(() => {
    // Check for expired jobs
    const currentDate = new Date()
    setJobPostings(jobPostings.map(job => 
      job.expiryDate && new Date(job.expiryDate) < currentDate ? { ...job, status: "Expired" } : job
    ))
  }, [])

  const jobPostingEffectiveness = [
    { name: 'Software Engineer', views: 500, applications: 15 },
    { name: 'Product Manager', views: 800, applications: 30 },
    { name: 'UX Designer', views: 300, applications: 10 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("Job Postings")}</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>{t("Create New Job Posting")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("Create New Job Posting")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <Label htmlFor="title">{t("Job Title")}</Label>
                <Input
                  id="title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">{t("Department")}</Label>
                <Input
                  id="department"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">{t("Job Description")}</Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="requirements">{t("Requirements")}</Label>
                <Textarea
                  id="requirements"
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="salary">{t("Salary Range")}</Label>
                <Input
                  id="salary"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">{t("Location")}</Label>
                <Input
                  id="location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">{t("Status")}</Label>
                <Select
                  value={newJob.status}
                  onValueChange={(value: JobPosting["status"]) => setNewJob({ ...newJob, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">{t("Draft")}</SelectItem>
                    <SelectItem value="Pending Approval">{t("Pending Approval")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">{t("Create Job Posting")}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">{t("Active Postings")}</TabsTrigger>
          <TabsTrigger value="expired">{t("Expired Postings")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("Analytics")}</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
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
                  {jobPostings.filter(job => job.status !== "Expired").map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{t(job.status)}</TableCell>
                      <TableCell>{job.applicants}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleSelectJob(job)}>
                          {t("View Details")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              {selectedJob && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Job Posting Details")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold">{t("Title")}:</span> {editMode ? <Input value={selectedJob.title} onChange={(e) => setSelectedJob({...selectedJob, title: e.target.value})} /> : selectedJob.title}
                      </div>
                      <div>
                        <span className="font-semibold">{t("Department")}:</span> {editMode ? <Input value={selectedJob.department} onChange={(e) => setSelectedJob({...selectedJob, department: e.target.value})} /> : selectedJob.department}
                      </div>
                      <div>
                        <span className="font-semibold">{t("Status")}:</span> {t(selectedJob.status)}
                      </div>
                      <div>
                        <span className="font-semibold">{t("Applicants")}:</span> {selectedJob.applicants}
                      </div>
                      <div>
                        <span className="font-semibold">{t("Description")}:</span> {editMode ? <Textarea value={selectedJob.description} onChange={(e) => setSelectedJob({...selectedJob, description: e.target.value})} /> : selectedJob.description}
                      </div>
                      <div>
                        <span className="font-semibold">{t("Requirements")}:</span> {editMode ? <Textarea value={selectedJob.requirements} onChange={(e) => setSelectedJob({...selectedJob, requirements: e.target.value})} /> : selectedJob.requirements}
                      </div>
                      <div>
                        <span className="font-semibold">{t("Salary")}:</span> {editMode ? <Input value={selectedJob.salary} onChange={(e) => setSelectedJob({...selectedJob, salary: e.target.value})} /> : selectedJob.salary}
                      </div>
                      <div>
                        <span className="font-semibold">{t("Location")}:</span> {editMode ? <Input value={selectedJob.location} onChange={(e) => setSelectedJob({...selectedJob, location: e.target.value})} /> : selectedJob.location}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {!editMode && (
                        <Button onClick={() => setEditMode(true)}>{t("Edit")}</Button>
                      )}
                      {editMode && (
                        <Button onClick={handleEditJob}>{t("Save Changes")}</Button>
                      )}
                      {selectedJob.status === "Draft" && (
                        <Button onClick={() => handleUpdateJobStatus(selectedJob.id, "Pending Approval")}>{t("Submit for Approval")}</Button>
                      )}
                      {selectedJob.status === "Pending Approval" && (
                        <Button onClick={() => handleUpdateJobStatus(selectedJob.id, "Approved")}>{t("Approve")}</Button>
                      )}
                      {selectedJob.status === "Approved" && (
                        <Button onClick={() => handlePublishJob(selectedJob.id)}>{t("Publish")}</Button>
                      )}
                      {selectedJob.status === "Published" && (
                        <Button onClick={() => handleOptimizeJob(selectedJob.id)}>{t("Optimize Posting")}</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="expired">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Job Title")}</TableHead>
                <TableHead>{t("Department")}</TableHead>
                <TableHead>{t("Expiry Date")}</TableHead>
                <TableHead>{t("Total Applicants")}</TableHead>
                <TableHead>{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobPostings.filter(job => job.status === "Expired").map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.expiryDate}</TableCell>
                  <TableCell>{job.applicants}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleSelectJob(job)}>
                      {t("View Details")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>{t("Job Posting Effectiveness")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={jobPostingEffectiveness}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="applications" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

