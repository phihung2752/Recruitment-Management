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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-context"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Candidate = {
  id: number
  name: string
  email: string
  phone: string
  position: string
  status: "New" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected"
  source: string
  resume: string
  skills: string[]
  experience: number
  education: string
  notes: string
  rating: number
}

const initialCandidates: Candidate[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    position: "Software Engineer",
    status: "Screening",
    source: "LinkedIn",
    resume: "https://example.com/john-doe-resume.pdf",
    skills: ["JavaScript", "React", "Node.js"],
    experience: 5,
    education: "Bachelor's in Computer Science",
    notes: "Strong problem-solving skills",
    rating: 4
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1987654321",
    position: "Product Manager",
    status: "Interview",
    source: "Referral",
    resume: "https://example.com/jane-smith-resume.pdf",
    skills: ["Product Strategy", "Agile", "User Research"],
    experience: 7,
    education: "MBA",
    notes: "Great communication skills",
    rating: 5
  }
]

export default function CandidateManagement() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [newCandidate, setNewCandidate] = useState<Omit<Candidate, "id">>({
    name: "",
    email: "",
    phone: "",
    position: "",
    status: "New",
    source: "",
    resume: "",
    skills: [],
    experience: 0,
    education: "",
    notes: "",
    rating: 0
  })
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<Candidate["status"] | "All">("All")
  const [compareList, setCompareList] = useState<Candidate[]>([])
  const { t } = useLanguage()

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault()
    const candidate: Candidate = {
      ...newCandidate,
      id: candidates.length + 1
    }
    setCandidates([...candidates, candidate])
    setNewCandidate({
      name: "",
      email: "",
      phone: "",
      position: "",
      status: "New",
      source: "",
      resume: "",
      skills: [],
      experience: 0,
      education: "",
      notes: "",
      rating: 0
    })
  }

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
  }

  const handleUpdateCandidate = (updatedCandidate: Candidate) => {
    setCandidates(candidates.map(c => c.id === updatedCandidate.id ? updatedCandidate : c))
    setSelectedCandidate(updatedCandidate)
  }

  const handleAddToCompare = (candidate: Candidate) => {
    if (compareList.length < 3 && !compareList.some(c => c.id === candidate.id)) {
      setCompareList([...compareList, candidate])
    }
  }

  const handleRemoveFromCompare = (candidateId: number) => {
    setCompareList(compareList.filter(c => c.id !== candidateId))
  }

  const filteredCandidates = candidates.filter(candidate => 
    (candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     candidate.position.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "All" || candidate.status === filterStatus)
  )

  const handleSendEmail = (candidate: Candidate) => {
    // In a real application, this would integrate with an email service
    alert(`Sending email to ${candidate.name} at ${candidate.email}`)
  }

  const handleCall = (candidate: Candidate) => {
    // In a real application, this might integrate with a calling service or just open the default phone app
    alert(`Calling ${candidate.name} at ${candidate.phone}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("Candidate Management")}</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>{t("Add New Candidate")}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("Add New Candidate")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div>
                <Label htmlFor="name">{t("Name")}</Label>
                <Input
                  id="name"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">{t("Email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">{t("Phone")}</Label>
                <Input
                  id="phone"
                  value={newCandidate.phone}
                  onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">{t("Position")}</Label>
                <Input
                  id="position"
                  value={newCandidate.position}
                  onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="source">{t("Source")}</Label>
                <Input
                  id="source"
                  value={newCandidate.source}
                  onChange={(e) => setNewCandidate({ ...newCandidate, source: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="resume">{t("Resume URL")}</Label>
                <Input
                  id="resume"
                  value={newCandidate.resume}
                  onChange={(e) => setNewCandidate({ ...newCandidate, resume: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="skills">{t("Skills (comma-separated)")}</Label>
                <Input
                  id="skills"
                  value={newCandidate.skills.join(", ")}
                  onChange={(e) => setNewCandidate({ ...newCandidate, skills: e.target.value.split(",").map(s => s.trim()) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="experience">{t("Years of Experience")}</Label>
                <Input
                  id="experience"
                  type="number"
                  value={newCandidate.experience}
                  onChange={(e) => setNewCandidate({ ...newCandidate, experience: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="education">{t("Education")}</Label>
                <Input
                  id="education"
                  value={newCandidate.education}
                  onChange={(e) => setNewCandidate({ ...newCandidate, education: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="notes">{t("Notes")}</Label>
                <Textarea
                  id="notes"
                  value={newCandidate.notes}
                  onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                />
              </div>
              <Button type="submit">{t("Add Candidate")}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex space-x-4 mb-4">
        <Input
          placeholder={t("Search candidates...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterStatus} onValueChange={(value: Candidate["status"] | "All") => setFilterStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("Filter by status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">{t("All")}</SelectItem>
            <SelectItem value="New">{t("New")}</SelectItem>
            <SelectItem value="Screening">{t("Screening")}</SelectItem>
            <SelectItem value="Interview">{t("Interview")}</SelectItem>
            <SelectItem value="Offer">{t("Offer")}</SelectItem>
            <SelectItem value="Hired">{t("Hired")}</SelectItem>
            <SelectItem value="Rejected">{t("Rejected")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">{t("Candidate List")}</TabsTrigger>
          <TabsTrigger value="compare">{t("Compare Candidates")}</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Name")}</TableHead>
                    <TableHead>{t("Position")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Rating")}</TableHead>
                    <TableHead>{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>{candidate.name}</TableCell>
                      <TableCell>{candidate.position}</TableCell>
                      <TableCell>
                        <Badge variant={candidate.status === "Hired" ? "success" : candidate.status === "Rejected" ? "destructive" : "default"}>
                          {t(candidate.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{candidate.rating} / 5</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleSelectCandidate(candidate)}>
                            {t("View")}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleAddToCompare(candidate)}>
                            {t("Compare")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              {selectedCandidate && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Candidate Details")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedCandidate.name}`} />
                          <AvatarFallback>{selectedCandidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{selectedCandidate.name}</h3>
                          <p className="text-sm text-gray-500">{selectedCandidate.position}</p>
                        </div>
                      </div>
                      <div>
                        <Label>{t("Email")}</Label>
                        <div className="flex items-center justify-between">
                          <span>{selectedCandidate.email}</span>
                          <Button variant="outline" size="sm" onClick={() => handleSendEmail(selectedCandidate)}>
                            {t("Send Email")}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>{t("Phone")}</Label>
                        <div className="flex items-center justify-between">
                          <span>{selectedCandidate.phone}</span>
                          <Button variant="outline" size="sm" onClick={() => handleCall(selectedCandidate)}>
                            {t("Call")}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>{t("Status")}</Label>
                        <Select
                          value={selectedCandidate.status}
                          onValueChange={(value: Candidate["status"]) => 
                            handleUpdateCandidate({ ...selectedCandidate, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">{t("New")}</SelectItem>
                            <SelectItem value="Screening">{t("Screening")}</SelectItem>
                            <SelectItem value="Interview">{t("Interview")}</SelectItem>
                            <SelectItem value="Offer">{t("Offer")}</SelectItem>
                            <SelectItem value="Hired">{t("Hired")}</SelectItem>
                            <SelectItem value="Rejected">{t("Rejected")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>{t("Source")}</Label>
                        <Input
                          value={selectedCandidate.source}
                          onChange={(e) => handleUpdateCandidate({ ...selectedCandidate, source: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>{t("Resume")}</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={selectedCandidate.resume}
                            onChange={(e) => handleUpdateCandidate({ ...selectedCandidate, resume: e.target.value })}
                          />
                          <Button variant="outline" size="sm" onClick={() => window.open(selectedCandidate.resume, '_blank')}>
                            {t("View")}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>{t("Skills")}</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>{t("Experience")}</Label>
                        <Input
                          type="number"
                          value={selectedCandidate.experience}
                          onChange={(e) => handleUpdateCandidate({ ...selectedCandidate, experience: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>{t("Education")}</Label>
                        <Input
                          value={selectedCandidate.education}
                          onChange={(e) => handleUpdateCandidate({ ...selectedCandidate, education: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>{t("Notes")}</Label>
                        <Textarea
                          value={selectedCandidate.notes}
                          onChange={(e) => handleUpdateCandidate({ ...selectedCandidate, notes: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>{t("Rating")}</Label>
                        <Slider
                          value={[selectedCandidate.rating]}
                          min={0}
                          max={5}
                          step={1}
                          onValueChange={(value) => handleUpdateCandidate({ ...selectedCandidate, rating: value[0] })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="compare">
          <div className="grid md:grid-cols-3 gap-4">
            {compareList.map((candidate) => (
              <Card key={candidate.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {candidate.name}
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFromCompare(candidate.id)}>
                      {t("Remove")}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label>{t("Position")}</Label>
                      <p>{candidate.position}</p>
                    </div>
                    <div>
                      <Label>{t("Status")}</Label>
                      <Badge variant={candidate.status === "Hired" ? "success" : candidate.status === "Rejected" ? "destructive" : "default"}>
                        {t(candidate.status)}
                      </Badge>
                    </div>
                    <div>
                      <Label>{t("Experience")}</Label>
                      <p>{candidate.experience} years</p>
                    </div>
                    <div>
                      <Label>{t("Skills")}</Label>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>{t("Education")}</Label>
                      <p>{candidate.education}</p>
                    </div>
                    <div>
                      <Label>{t("Rating")}</Label>
                      <p>{candidate.rating} / 5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

