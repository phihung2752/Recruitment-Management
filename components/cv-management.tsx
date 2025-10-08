"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { Download, Filter, Grid, List, ChevronUp, Loader2 } from "lucide-react"
import type { CV, CVFilter, InterviewFeedbackForm } from "@/types/cv-management"
import { AdvancedCVFilter } from "./advanced-cv-filter"
import { CVGridView } from "./cv-grid-view"
import { CVListView } from "./cv-list-view"
// import { InterviewScheduler } from "./interview-scheduler"
import { RecruitmentAnalytics } from "./recruitment-analytics"
import { CVComparison } from "./cv-comparison"
import { BulkActions } from "./bulk-actions"
import { CVParsing } from "./cv-parsing"
import { CandidateCommunication } from "./candidate-communication"
import { SkillAssessment } from "./skill-assessment"
import { CandidateProgressTracker } from "./candidate-progress-tracker"
import { ApprovalWorkflow } from "./approval-workflow"
import { AutomatedStatusUpdate } from "./automated-status-update"
import { TagManager } from "./tag-manager"
import { OnlineInterviewIntegration } from "./online-interview-integration"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useDebounce } from "@/hooks/use-debounce"
import { useInView } from "react-intersection-observer"

const availableColumns = [
  "name",
  "position",
  "status",
  "tags",
  "appliedDate",
  "email",
  "experience",
  "skills",
  "source",
  "matchPercentage",
  "location",
  "salary",
]

export function CVManagement() {
  const [cvs, setCVs] = useState<CV[]>([])
  const [selectedCVs, setSelectedCVs] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [filters, setFilters] = useState<CVFilter>({
    search: "",
    skills: [],
    status: [],
    tags: [],
    source: [],
    matchPercentage: 0,
    location: "",
    experienceLevel: "",
    salary: [0, 1000000],
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCV, setSelectedCV] = useState<CV | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "name",
    "position",
    "status",
    "tags",
    "appliedDate",
    "email",
    "experience",
  ])
  const [availableTags, setAvailableTags] = useState<string[]>([
    "Priority",
    "Potential",
    "Need Review",
    "Technical",
    "Management",
    "Creative",
  ])
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [activeTab, setActiveTab] = useState("cvs")
  const [showBackToTop, setShowBackToTop] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView({
    threshold: 0,
  })
  const [initialCVs, setInitialCVs] = useState<CV[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50 // Changed from 5 to 50
  const totalItems = 256 // Total number of items in the dataset
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const maxVisiblePages = 5 // Show up to 5 page numbers at a time

  // Calculate visible page range
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  const debouncedSearch = useDebounce(filters.search, 300)

  // Mock data for demonstration
  useEffect(() => {
    const mockCVs: CV[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        position: "Senior Developer",
        experience: 5,
        skills: ["React", "Node.js", "TypeScript"],
        source: "LinkedIn",
        appliedDate: new Date(),
        status: "Reviewing",
        matchPercentage: 85,
        tags: ["Priority", "Technical"],
        interviewStatus: "Pending",
        progressStage: "Applied",
        salary: 100000,
        location: "New York",
        approvalStatus: "Pending",
      },
      // Add more mock data...
      {
        id: "2",
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "+1234567891",
        position: "Software Engineer",
        experience: 3,
        skills: ["Java", "Spring", "SQL"],
        source: "Indeed",
        appliedDate: new Date(),
        status: "Interviewed",
        matchPercentage: 90,
        tags: ["Potential"],
        interviewStatus: "Scheduled",
        progressStage: "Interviewing",
        salary: 90000,
        location: "San Francisco",
        approvalStatus: "Pending",
      },
      {
        id: "3",
        name: "Peter Jones",
        email: "peter@example.com",
        phone: "+1234567892",
        position: "Data Scientist",
        experience: 2,
        skills: ["Python", "Pandas", "Scikit-learn"],
        source: "Glassdoor",
        appliedDate: new Date(),
        status: "New",
        matchPercentage: 75,
        tags: ["Need Review"],
        interviewStatus: "Pending",
        progressStage: "Applied",
        salary: 80000,
        location: "London",
        approvalStatus: "Pending",
      },
    ]
    setCVs(mockCVs)
    setInitialCVs(mockCVs)
  }, [])

  useEffect(() => {
    // Implement lazy loading for CVs
    const loadMoreCVs = async () => {
      setIsLoading(true)
      // In a real application, you would fetch more CVs from an API
      // For this example, we'll just add some mock data after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const lastId = cvs[cvs.length - 1]?.id || "0"
      const moreCVs: CV[] = [
        {
          id: `${Number.parseInt(lastId) + 1}`,
          name: "Bob Williams",
          email: "bob@example.com",
          phone: "+1234567894",
          position: "Backend Developer",
          experience: 6,
          skills: ["Node.js", "Express.js", "MongoDB"],
          source: "Indeed",
          appliedDate: new Date(),
          status: "Completed",
          matchPercentage: 95,
          tags: ["Priority", "Technical"],
          interviewStatus: "Completed",
          progressStage: "Hired",
          salary: 120000,
          location: "London",
          approvalStatus: "Approved",
        },
      ]
      setCVs((prevCVs) => [...prevCVs, ...moreCVs])
      setIsLoading(false)
      setHasMore(moreCVs.length > 0)
    }

    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          loadMoreCVs()
        }
        setShowBackToTop(scrollTop > 300)
      }
    }

    containerRef.current?.addEventListener("scroll", handleScroll)
    return () => containerRef.current?.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Filter CVs based on the debounced search term
    const filteredCVs = cvs.filter(
      (cv) =>
        cv.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        cv.position.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        cv.skills.some((skill) => skill.toLowerCase().includes(debouncedSearch.toLowerCase())),
    )
    // Update the filtered CVs state
  }, [debouncedSearch, cvs])

  const handleDownloadSelected = () => {
    // Implementation for downloading selected CVs
    toast({
      title: "Downloading CVs",
      description: `Downloading ${selectedCVs.length} selected CVs...`,
    })
  }

  const handleTagCV = (cvId: string, tag: string) => {
    setCVs(
      cvs.map((cv) => {
        if (cv.id === cvId) {
          const newTags = cv.tags.includes(tag) ? cv.tags.filter((t) => t !== tag) : [...cv.tags, tag]
          return { ...cv, tags: newTags }
        }
        return cv
      }),
    )
  }

  const handleAddTag = (newTag: string) => {
    if (!availableTags.includes(newTag)) {
      setAvailableTags([...availableTags, newTag])
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setAvailableTags(availableTags.filter((tag) => tag !== tagToRemove))
    setCVs(
      cvs.map((cv) => ({
        ...cv,
        tags: cv.tags.filter((tag) => tag !== tagToRemove),
      })),
    )
  }

  const handleScheduleInterview = (cvId: string, date: Date, link: string) => {
    setCVs(
      cvs.map((cv) => {
        if (cv.id === cvId) {
          return {
            ...cv,
            interviewDate: date,
            interviewLink: link,
            interviewPlatform: "Zoom",
            interviewStatus: "Scheduled",
            progressStage: "Interview Scheduled",
          }
        }
        return cv
      }),
    )

    toast({
      title: "Interview Scheduled",
      description: `Interview scheduled for Zoom on ${date.toLocaleString()}. Link: ${link}`,
    })
  }

  const handleInterviewFeedback = (cvId: string, feedback: InterviewFeedbackForm) => {
    setCVs(
      cvs.map((cv) => {
        if (cv.id === cvId) {
          return {
            ...cv,
            interviewScore: feedback.overallRating,
            interviewFeedback: feedback.comments,
            interviewStatus: "Completed",
            progressStage: "Interview Completed",
          }
        }
        return cv
      }),
    )
  }

  const handleBulkAction = (action: string) => {
    // Implement bulk actions (e.g., change status, add tag, delete)
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedCVs.length} CVs`,
    })
  }

  const handleParseCV = (file: File) => {
    // Implement CV parsing logic
    toast({
      title: "CV Parsed",
      description: `Successfully parsed CV: ${file.name}`,
    })
  }

  const handleAddCommunication = (cvId: string, message: string) => {
    setCVs(
      cvs.map((cv) => {
        if (cv.id === cvId) {
          return {
            ...cv,
            communicationLog: [...(cv.communicationLog || []), { date: new Date(), message }],
          }
        }
        return cv
      }),
    )
  }

  const handleUpdateSkills = (cvId: string, skills: { name: string; level: number }[]) => {
    setCVs(
      cvs.map((cv) => {
        if (cv.id === cvId) {
          return {
            ...cv,
            skills: skills.map((skill) => skill.name),
            skillLevels: skills.reduce((acc, skill) => ({ ...acc, [skill.name]: skill.level }), {}),
          }
        }
        return cv
      }),
    )
  }

  const handleUpdateProgress = (cvId: string, newStage: string) => {
    setCVs(
      cvs.map((cv) => {
        if (cv.id === cvId) {
          return {
            ...cv,
            progressStage: newStage,
          }
        }
        return cv
      }),
    )
  }

  const handleApprovalRequest = (cvId: string, approver: string) => {
    setCVs(
      cvs.map((cv) => {
        if (cv.id === cvId) {
          return {
            ...cv,
            approvalStatus: "Pending",
            approver: approver,
          }
        }
        return cv
      }),
    )
    toast({
      title: "Approval Requested",
      description: `Approval request sent to ${approver}`,
    })
  }

  const handleApprovalDecision = (cvId: string, decision: "Approved" | "Rejected") => {
    setCVs(
      cvs.map((cv) => {
        if (cv.id === cvId) {
          return {
            ...cv,
            approvalStatus: decision,
          }
        }
        return cv
      }),
    )
    toast({
      title: "Approval Decision",
      description: `CV has been ${decision.toLowerCase()}`,
    })
  }

  const handleBackToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      const tabOrder = [
        "cvs",
        "interviews",
        "analytics",
        "comparison",
        "parsing",
        "communication",
        "skills",
        "progress",
        "approval",
        "tags",
      ]
      const currentIndex = tabOrder.indexOf(activeTab)
      if (direction === "left" && currentIndex < tabOrder.length - 1) {
        setActiveTab(tabOrder[currentIndex + 1])
      } else if (direction === "right" && currentIndex > 0) {
        setActiveTab(tabOrder[currentIndex - 1])
      }
    },
    [activeTab],
  )

  const loadMoreCVs = async () => {
    setIsLoading(true)
    // In a real application, you would fetch more CVs from an API
    // For this example, we'll just add some mock data after a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const lastId = cvs[cvs.length - 1]?.id || "0"
    const moreCVs: CV[] = [
      {
        id: `${Number.parseInt(lastId) + 1}`,
        name: "Bob Williams",
        email: "bob@example.com",
        phone: "+1234567894",
        position: "Backend Developer",
        experience: 6,
        skills: ["Node.js", "Express.js", "MongoDB"],
        source: "Indeed",
        appliedDate: new Date(),
        status: "Completed",
        matchPercentage: 95,
        tags: ["Priority", "Technical"],
        interviewStatus: "Completed",
        progressStage: "Hired",
        salary: 120000,
        location: "London",
        approvalStatus: "Approved",
      },
    ]
    setCVs((prevCVs) => [...prevCVs, ...moreCVs])
    setIsLoading(false)
    setHasMore(moreCVs.length > 0)
  }

  const handlePullToRefresh = async () => {
    setIsLoading(true)
    // In a real application, you would fetch fresh data from an API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Reset the CVs state with fresh data
    setCVs([...initialCVs])
    setIsLoading(false)
  }

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreCVs()
    }
  }, [inView, hasMore, isLoading])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, cvs.length)
  const currentItems = cvs.slice(startIndex, endIndex)

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) => (prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]))
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4" ref={containerRef}>
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold">CV Management</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
            {viewMode === "list" ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
          {selectedCVs.length > 0 && (
            <Button onClick={handleDownloadSelected}>
              <Download className="mr-2 h-4 w-4" />
              Download ({selectedCVs.length})
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <AdvancedCVFilter filters={filters} onFilterChange={setFilters} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="cvs" value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex w-max min-w-full justify-start">
            <TabsTrigger value="cvs" className="flex-shrink-0">
              CVs
            </TabsTrigger>
            <TabsTrigger value="interviews" className="flex-shrink-0">
              Interviews
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-shrink-0">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex-shrink-0">
              Comparison
            </TabsTrigger>
            <TabsTrigger value="parsing" className="flex-shrink-0">
              CV Parsing
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex-shrink-0">
              Communication
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex-shrink-0">
              Skill Assessment
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex-shrink-0">
              Progress Tracker
            </TabsTrigger>
            <TabsTrigger value="approval" className="flex-shrink-0">
              Approval Workflow
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex-shrink-0">
              Tag Management
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="cvs">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search CVs..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full sm:w-64"
              />
              <BulkActions selectedCVs={selectedCVs} onBulkAction={handleBulkAction} />
            </div>
            <Dialog>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Customize Columns</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-full w-full p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {availableColumns.map((column) => (
                      <div key={column} className="flex items-center space-x-2">
                        <Checkbox
                          id={column}
                          checked={visibleColumns.includes(column)}
                          onCheckedChange={() => handleColumnToggle(column)}
                        />
                        <label htmlFor={column} className="text-sm font-medium leading-none">
                          {column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, " $1")}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <div className="overflow-auto max-h-[calc(100vh-300px)]">
              <ScrollArea className="w-full">
                {viewMode === "list" ? (
                  <CVListView
                    cvs={currentItems}
                    selectedCVs={selectedCVs}
                    onSelectCV={(id) =>
                      setSelectedCVs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
                    }
                    onTagCV={handleTagCV}
                    onScheduleInterview={handleScheduleInterview}
                    onRefresh={async () => {}}
                    visibleColumns={visibleColumns}
                    availableTags={availableTags}
                  />
                ) : (
                  <CVGridView
                    cvs={currentItems}
                    selectedCVs={selectedCVs}
                    onSelectCV={(id) =>
                      setSelectedCVs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
                    }
                    onTagCV={handleTagCV}
                    onScheduleInterview={handleScheduleInterview}
                    onRefresh={async () => {}}
                    availableTags={availableTags}
                  />
                )}
              </ScrollArea>
            </div>
            <div className="text-sm text-muted-foreground mb-2 flex justify-between items-center">
              <span>
                Showing {startIndex + 1} - {Math.min(endIndex, totalItems)} of {totalItems} entries
              </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(endPage - startPage + 1)].map((_, i) => (
                  <Button
                    key={startPage + i}
                    variant={currentPage === startPage + i ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(startPage + i)}
                  >
                    {startPage + i}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}

            <div ref={ref} className="h-1" />
          </div>
        </TabsContent>

        <TabsContent value="interviews">
          {/* <InterviewScheduler
            cvs={cvs}
            onScheduleInterview={handleScheduleInterview}
            onSubmitFeedback={handleInterviewFeedback}
          />
          <OnlineInterviewIntegration /> */}
        </TabsContent>

        <TabsContent value="analytics">
          <RecruitmentAnalytics cvs={cvs} />
        </TabsContent>

        <TabsContent value="comparison">
          <CVComparison cvs={cvs} />
        </TabsContent>

        <TabsContent value="parsing">
          <CVParsing onParseCV={handleParseCV} />
        </TabsContent>

        <TabsContent value="communication">
          <CandidateCommunication cvs={cvs} onAddCommunication={handleAddCommunication} />
        </TabsContent>

        <TabsContent value="skills">
          <div className="space-y-4">
            <Select onValueChange={(value) => setSelectedCV(cvs.find((cv) => cv.id === value) || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a candidate" />
              </SelectTrigger>
              <SelectContent>
                {cvs.map((cv) => (
                  <SelectItem key={cv.id} value={cv.id}>
                    {cv.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCV && <SkillAssessment cv={selectedCV} onUpdateSkills={handleUpdateSkills} />}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="space-y-4">
            <Select onValueChange={(value) => setSelectedCV(cvs.find((cv) => cv.id === value) || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a candidate" />
              </SelectTrigger>
              <SelectContent>
                {cvs.map((cv) => (
                  <SelectItem key={cv.id} value={cv.id}>
                    {cv.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCV && <CandidateProgressTracker cv={selectedCV} onUpdateProgress={handleUpdateProgress} />}
          </div>
        </TabsContent>

        <TabsContent value="approval">
          <ApprovalWorkflow
            cvs={cvs}
            onApprovalRequest={handleApprovalRequest}
            onApprovalDecision={handleApprovalDecision}
          />
        </TabsContent>

        <TabsContent value="tags">
          <TagManager availableTags={availableTags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
        </TabsContent>
      </Tabs>

      {showBackToTop && (
        <Button className="fixed bottom-4 right-4 rounded-full" size="icon" onClick={handleBackToTop}>
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}

      <AutomatedStatusUpdate
        cvs={cvs}
        onUpdateCV={(updatedCV) => {
          setCVs(cvs.map((cv) => (cv.id === updatedCV.id ? updatedCV : cv)))
        }}
      />
    </div>
  )
}
