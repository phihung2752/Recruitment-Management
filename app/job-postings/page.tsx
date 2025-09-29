"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Search, Filter, MapPin, Clock, DollarSign } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function JobPostingsPage() {
  const { t } = useLanguage()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [jobPostings, setJobPostings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    applications: 0,
    locations: 0
  })

  // Fetch job postings data
  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/jobpostings')
        if (response.ok) {
          const data = await response.json()
          setJobPostings(data.jobPostings || [])
          setStats({
            total: data.totalCount || 0,
            active: data.jobPostings?.filter((job: any) => job.status === 'Active').length || 0,
            applications: data.jobPostings?.reduce((sum: number, job: any) => sum + (job.applicationsCount || 0), 0) || 0,
            locations: new Set(data.jobPostings?.map((job: any) => job.location)).size || 0
          })
        }
      } catch (error) {
        console.error('Error fetching job postings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobPostings()
  }, [])

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{t("Job Postings")}</h1>
          <p className="text-muted-foreground">{t("Create and manage job postings")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t("Create Job Posting")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("Create New Job Posting")}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">{t("Job Title")}</Label>
                    <Input id="title" placeholder={t("e.g. Senior Software Engineer")} required />
                  </div>
                  <div>
                    <Label htmlFor="department">{t("Department")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select department")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">{t("Engineering")}</SelectItem>
                        <SelectItem value="product">{t("Product")}</SelectItem>
                        <SelectItem value="design">{t("Design")}</SelectItem>
                        <SelectItem value="marketing">{t("Marketing")}</SelectItem>
                        <SelectItem value="sales">{t("Sales")}</SelectItem>
                        <SelectItem value="hr">{t("HR")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="location">{t("Location")}</Label>
                    <Input id="location" placeholder={t("e.g. Ho Chi Minh City")} />
                  </div>
                  <div>
                    <Label htmlFor="employmentType">{t("Employment Type")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">{t("Full-time")}</SelectItem>
                        <SelectItem value="part-time">{t("Part-time")}</SelectItem>
                        <SelectItem value="contract">{t("Contract")}</SelectItem>
                        <SelectItem value="intern">{t("Intern")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience">{t("Experience Level")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select level")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">{t("Entry Level")}</SelectItem>
                        <SelectItem value="mid">{t("Mid Level")}</SelectItem>
                        <SelectItem value="senior">{t("Senior Level")}</SelectItem>
                        <SelectItem value="lead">{t("Lead Level")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salaryMin">{t("Minimum Salary")}</Label>
                    <Input id="salaryMin" type="number" placeholder="15000000" />
                  </div>
                  <div>
                    <Label htmlFor="salaryMax">{t("Maximum Salary")}</Label>
                    <Input id="salaryMax" type="number" placeholder="25000000" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">{t("Job Description")}</Label>
                  <Textarea 
                    id="description" 
                    placeholder={t("Describe the role, responsibilities, and requirements...")}
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">{t("Requirements")}</Label>
                  <Textarea 
                    id="requirements" 
                    placeholder={t("List the required skills, qualifications, and experience...")}
                    className="min-h-[150px]"
                  />
                </div>

                <div>
                  <Label htmlFor="benefits">{t("Benefits & Perks")}</Label>
                  <Textarea 
                    id="benefits" 
                    placeholder={t("List the benefits and perks offered...")}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicationDeadline">{t("Application Deadline")}</Label>
                    <Input id="applicationDeadline" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="startDate">{t("Expected Start Date")}</Label>
                    <Input id="startDate" type="date" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t("Cancel")}
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  {t("Create Job Posting")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Total Postings")}</p>
                <p className="text-xl font-bold">{loading ? "..." : stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Active")}</p>
                <p className="text-xl font-bold">{loading ? "..." : stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Applications")}</p>
                <p className="text-xl font-bold">{loading ? "..." : stats.applications}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Locations")}</p>
                <p className="text-xl font-bold">{loading ? "..." : stats.locations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("Search job postings...")}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {t("Filters")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Postings List */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Job Postings")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t("No job postings yet")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("Start by creating your first job posting to attract candidates.")}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("Create First Job Posting")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}