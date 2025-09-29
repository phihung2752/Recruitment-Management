"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Star,
  Mail,
  FileDown,
  Search,
  Phone,
  CalendarIcon,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  MoreHorizontal,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Plus,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import {
  candidatesService,
  type Candidate,
  type CandidateDetail,
  type CreateCandidateRequest,
} from "@/lib/api-services/candidates-service"
import { useApi, useMutation } from "@/hooks/use-api"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function CandidatesPage() {
  const { toast } = useToast()
  const { t } = useLanguage()

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [priorityFilter, setPriorityFilter] = useState<string>("All")
  const [sourceFilter, setSourceFilter] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("appliedDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // State for selected candidate and dialogs
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateDetail | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState<CreateCandidateRequest>({
    name: "",
    email: "",
    phone: "",
    position: "",
    source: "",
    skills: [],
    experience: 0,
    education: "",
    location: "",
    expectedSalary: 0,
    notes: "",
  })

  // API hooks
  const { data: candidates = [], loading, error, refetch } = useApi(() => candidatesService.getCandidates())

  const createMutation = useMutation(candidatesService.createCandidate)
  const updateMutation = useMutation((params: { id: string; data: Partial<CreateCandidateRequest> }) =>
    candidatesService.updateCandidate(params.id, params.data),
  )
  const deleteMutation = useMutation(candidatesService.deleteCandidate)
  const statusMutation = useMutation((params: { id: string; status: Candidate["status"] }) =>
    candidatesService.changeCandidateStatus(params.id, params.status),
  )

  // Get candidate details
  const { data: candidateDetails, loading: detailsLoading } = useApi(
    () => (selectedCandidate?.id ? candidatesService.getCandidateById(selectedCandidate.id) : null),
    [selectedCandidate?.id],
  )

  // Filter and search logic
  const filteredCandidates = (candidates || []).filter((candidate) => {
    const matchesSearch =
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "All" || candidate.status === statusFilter
    const matchesPriority = priorityFilter === "All" || candidate.priority === priorityFilter
    const matchesSource = sourceFilter === "All" || candidate.source === sourceFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesSource
  })

  // Sort logic
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Candidate]
    let bValue: any = b[sortBy as keyof Candidate]

    if (sortBy === "appliedDate") {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    } else if (sortBy === "name") {
      aValue = a.name
      bValue = b.name
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
  const currentCandidates = sortedCandidates.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPage)

  // Statistics
  const stats = {
    total: candidates.length,
    inProcess: (candidates || []).filter((c) => ["Screening", "Interview", "Technical", "Final"].includes(c.status))
      .length,
    hired: (candidates || []).filter((c) => c.status === "Hired").length,
    thisMonth: (candidates || []).filter((c) => {
      const appliedDate = new Date(c.appliedDate)
      const now = new Date()
      return appliedDate.getMonth() === now.getMonth() && appliedDate.getFullYear() === now.getFullYear()
    }).length,
  }

  // Handlers
  const handleSelectCandidate = async (candidate: Candidate) => {
    setSelectedCandidate(candidate as CandidateDetail)
  }

  const handleCreateCandidate = async () => {
    const result = await createMutation.mutate(formData)
    if (result) {
      setIsCreateDialogOpen(false)
      resetForm()
      refetch()
    }
  }

  const handleUpdateCandidateStatus = async (candidateId: string, newStatus: Candidate["status"]) => {
    const result = await statusMutation.mutate({ id: candidateId, status: newStatus })
    if (result) {
      refetch()
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate({ ...selectedCandidate, status: newStatus })
      }
    }
  }

  const handleRatingChange = async (candidateId: string, newRating: number) => {
    // This would typically update the rating via API
    toast({
      title: t("Rating Updated"),
      description: t("Candidate rating has been updated."),
    })
  }

  const handleBulkAction = async (action: string) => {
    if (selectedCandidates.length === 0) {
      toast({
        title: t("No Selection"),
        description: t("Please select candidates first."),
        variant: "destructive",
      })
      return
    }

    switch (action) {
      case "delete":
        for (const id of selectedCandidates) {
          await deleteMutation.mutate(id)
        }
        setSelectedCandidates([])
        refetch()
        break
      case "move-to-interview":
        for (const id of selectedCandidates) {
          await statusMutation.mutate({ id, status: "Interview" })
        }
        setSelectedCandidates([])
        refetch()
        break
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      source: "",
      skills: [],
      experience: 0,
      education: "",
      location: "",
      expectedSalary: 0,
      notes: "",
    })
  }

  const handleExport = () => {
    const exportData = filteredCandidates.map((candidate) => ({
      Name: candidate.name,
      Email: candidate.email,
      Phone: candidate.phone,
      Position: candidate.position,
      Status: candidate.status,
      Priority: candidate.priority,
      Rating: candidate.rating,
      Source: candidate.source,
      "Applied Date": format(new Date(candidate.appliedDate), "yyyy-MM-dd"),
      Skills: candidate.skills?.join(", ") || "",
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
    link.setAttribute("download", `candidates-${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: Candidate["status"]) => {
    const colors = {
      New: "bg-blue-100 text-blue-800",
      Screening: "bg-yellow-100 text-yellow-800",
      Interview: "bg-purple-100 text-purple-800",
      Technical: "bg-orange-100 text-orange-800",
      Final: "bg-indigo-100 text-indigo-800",
      Offer: "bg-green-100 text-green-800",
      Hired: "bg-emerald-100 text-emerald-800",
      Rejected: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: Candidate["priority"]) => {
    const colors = {
      Low: "bg-gray-100 text-gray-800",
      Medium: "bg-blue-100 text-blue-800",
      High: "bg-orange-100 text-orange-800",
      Urgent: "bg-red-100 text-red-800",
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
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
    <div className="space-y-4 p-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{t("Candidates")}</h1>
          <p className="text-muted-foreground">{t("Manage and track your recruitment candidates")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
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
                <Plus className="mr-2 h-4 w-4" />
                {t("Add Candidate")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("Add New Candidate")}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    {t("Name")}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    {t("Email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    {t("Phone")}
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    {t("Position")}
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="source" className="text-right">
                    {t("Source")}
                  </Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => setFormData({ ...formData, source: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("Select Source")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LinkedIn">{t("LinkedIn")}</SelectItem>
                      <SelectItem value="Company Website">{t("Company Website")}</SelectItem>
                      <SelectItem value="Referral">{t("Referral")}</SelectItem>
                      <SelectItem value="Job Board">{t("Job Board")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="experience" className="text-right">
                    {t("Experience (years)")}
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: Number.parseInt(e.target.value) || 0 })}
                    className="col-span-3"
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
                  <Label htmlFor="expectedSalary" className="text-right">
                    {t("Expected Salary")}
                  </Label>
                  <Input
                    id="expectedSalary"
                    type="number"
                    value={formData.expectedSalary}
                    onChange={(e) => setFormData({ ...formData, expectedSalary: Number.parseInt(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    {t("Notes")}
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
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
                <Button onClick={handleCreateCandidate} disabled={createMutation.loading}>
                  {createMutation.loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  {t("Create")}
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
                <p className="text-sm text-muted-foreground">{t("Total")}</p>
                {loading ? <Skeleton className="h-6 w-8" /> : <p className="text-xl font-bold">{stats.total}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("In Process")}</p>
                {loading ? <Skeleton className="h-6 w-8" /> : <p className="text-xl font-bold">{stats.inProcess}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Hired")}</p>
                {loading ? <Skeleton className="h-6 w-8" /> : <p className="text-xl font-bold">{stats.hired}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("This Month")}</p>
                {loading ? <Skeleton className="h-6 w-8" /> : <p className="text-xl font-bold">{stats.thisMonth}</p>}
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
                  placeholder={t("Search candidates...")}
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("All Statuses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">{t("All Statuses")}</SelectItem>
                    <SelectItem value="New">{t("New")}</SelectItem>
                    <SelectItem value="Screening">{t("Screening")}</SelectItem>
                    <SelectItem value="Interview">{t("Interview")}</SelectItem>
                    <SelectItem value="Technical">{t("Technical")}</SelectItem>
                    <SelectItem value="Final">{t("Final")}</SelectItem>
                    <SelectItem value="Offer">{t("Offer")}</SelectItem>
                    <SelectItem value="Hired">{t("Hired")}</SelectItem>
                    <SelectItem value="Rejected">{t("Rejected")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("All Priorities")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">{t("All Priorities")}</SelectItem>
                    <SelectItem value="Low">{t("Low")}</SelectItem>
                    <SelectItem value="Medium">{t("Medium")}</SelectItem>
                    <SelectItem value="High">{t("High")}</SelectItem>
                    <SelectItem value="Urgent">{t("Urgent")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("All Sources")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">{t("All Sources")}</SelectItem>
                    <SelectItem value="LinkedIn">{t("LinkedIn")}</SelectItem>
                    <SelectItem value="Company Website">{t("Company Website")}</SelectItem>
                    <SelectItem value="Referral">{t("Referral")}</SelectItem>
                    <SelectItem value="Job Board">{t("Job Board")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Sort by")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appliedDate">{t("Applied Date")}</SelectItem>
                    <SelectItem value="name">{t("Name")}</SelectItem>
                    <SelectItem value="rating">{t("Rating")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCandidates.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedCandidates.length} {t("candidates selected")}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("move-to-interview")}>
                  {t("Move to Interview")}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleBulkAction("delete")}>
                  {t("Delete Selected")}
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
                              selectedCandidates.length === currentCandidates.length && currentCandidates.length > 0
                            }
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCandidates(currentCandidates.map((c) => c.id))
                              } else {
                                setSelectedCandidates([])
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>{t("Candidate")}</TableHead>
                        <TableHead className="hidden md:table-cell">{t("Position")}</TableHead>
                        <TableHead>{t("Status")}</TableHead>
                        <TableHead className="hidden lg:table-cell">{t("Priority")}</TableHead>
                        <TableHead className="hidden xl:table-cell">{t("Rating")}</TableHead>
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
                                    <Skeleton className="h-3 w-32 mt-1" />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-16" />
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
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
                        : currentCandidates.map((candidate) => (
                            <TableRow key={candidate.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedCandidates.includes(candidate.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedCandidates([...selectedCandidates, candidate.id])
                                    } else {
                                      setSelectedCandidates(selectedCandidates.filter((id) => id !== candidate.id))
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${candidate.name}`}
                                    />
                                    <AvatarFallback>
                                      {candidate.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{candidate.name}</p>
                                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{candidate.position}</TableCell>
                              <TableCell>
                                <Badge className={cn("text-xs", getStatusColor(candidate.status))}>
                                  {t(candidate.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <Badge className={cn("text-xs", getPriorityColor(candidate.priority))}>
                                  {t(candidate.priority)}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden xl:table-cell">
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={cn(
                                        "h-4 w-4 cursor-pointer",
                                        star <= candidate.rating ? "text-yellow-400 fill-current" : "text-gray-300",
                                      )}
                                      onClick={() => handleRatingChange(candidate.id, star)}
                                    />
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleSelectCandidate(candidate)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Mail className="h-4 w-4" />
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
                : currentCandidates.map((candidate) => (
                    <Card key={candidate.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${candidate.name}`} />
                                <AvatarFallback>
                                  {candidate.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{candidate.name}</h3>
                                <p className="text-sm text-muted-foreground">{candidate.position}</p>
                              </div>
                            </div>
                            <Checkbox
                              checked={selectedCandidates.includes(candidate.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCandidates([...selectedCandidates, candidate.id])
                                } else {
                                  setSelectedCandidates(selectedCandidates.filter((id) => id !== candidate.id))
                                }
                              }}
                            />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge className={cn("text-xs", getStatusColor(candidate.status))}>
                              {t(candidate.status)}
                            </Badge>
                            <Badge className={cn("text-xs", getPriorityColor(candidate.priority))}>
                              {t(candidate.priority)}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-4 w-4 cursor-pointer",
                                  star <= candidate.rating ? "text-yellow-400 fill-current" : "text-gray-300",
                                )}
                                onClick={() => handleRatingChange(candidate.id, star)}
                              />
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <Button variant="outline" size="sm" onClick={() => handleSelectCandidate(candidate)}>
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

        {/* Candidate Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedCandidate ? (
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t("Candidate Details")}
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCandidate(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  {detailsLoading ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24 mt-1" />
                          <Skeleton className="h-4 w-20 mt-1" />
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        {Array.from({ length: 8 }).map((_, index) => (
                          <div key={index}>
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-full mt-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
                        <TabsTrigger value="interviews">{t("Interviews")}</TabsTrigger>
                        <TabsTrigger value="communication">{t("Communication")}</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedCandidate.name}`}
                            />
                            <AvatarFallback>
                              {selectedCandidate.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">{selectedCandidate.name}</h3>
                            <p className="text-muted-foreground">{selectedCandidate.position}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn(
                                    "h-4 w-4 cursor-pointer",
                                    star <= selectedCandidate.rating ? "text-yellow-400 fill-current" : "text-gray-300",
                                  )}
                                  onClick={() => handleRatingChange(selectedCandidate.id, star)}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">{t("Status")}</Label>
                            <Select
                              value={selectedCandidate.status}
                              onValueChange={(value: Candidate["status"]) =>
                                handleUpdateCandidateStatus(selectedCandidate.id, value)
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="New">{t("New")}</SelectItem>
                                <SelectItem value="Screening">{t("Screening")}</SelectItem>
                                <SelectItem value="Interview">{t("Interview")}</SelectItem>
                                <SelectItem value="Technical">{t("Technical")}</SelectItem>
                                <SelectItem value="Final">{t("Final")}</SelectItem>
                                <SelectItem value="Offer">{t("Offer")}</SelectItem>
                                <SelectItem value="Hired">{t("Hired")}</SelectItem>
                                <SelectItem value="Rejected">{t("Rejected")}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm font-medium">{t("Email")}</Label>
                              <p className="text-sm mt-1">{selectedCandidate.email}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">{t("Phone")}</Label>
                              <p className="text-sm mt-1">{selectedCandidate.phone}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">{t("Source")}</Label>
                            <p className="text-sm mt-1">{selectedCandidate.source}</p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">{t("Applied Date")}</Label>
                            <p className="text-sm mt-1">
                              {format(new Date(selectedCandidate.appliedDate), "MMM dd, yyyy")}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">{t("Skills")}</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedCandidate.skills?.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="interviews" className="space-y-4">
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{t("No interviews scheduled yet.")}</p>
                          <Button className="w-full" variant="outline">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {t("Schedule Interview")}
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="communication" className="space-y-4">
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{t("No communication history yet.")}</p>
                          <div className="flex space-x-2">
                            <Button className="flex-1" variant="outline" size="sm">
                              <Mail className="mr-2 h-4 w-4" />
                              {t("Send Email")}
                            </Button>
                            <Button className="flex-1" variant="outline" size="sm">
                              <Phone className="mr-2 h-4 w-4" />
                              {t("Call")}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("Select a Candidate")}</h3>
                <p className="text-muted-foreground">
                  {t("Choose a candidate from the list to view their details and manage their application.")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
