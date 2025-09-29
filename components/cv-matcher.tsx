"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, User } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface JobRequirement {
  id: string
  title: string
  skills: string[]
  experience: number
  education: string
}

interface Candidate {
  id: string
  name: string
  matchScore: number
  skills: string[]
  experience: number
  education: string
  appliedThrough: string
  appliedDate: string
}

export function CVMatcher() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  // Mock job requirement
  const jobRequirement: JobRequirement = {
    id: "job-1",
    title: "Senior Frontend Developer",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    experience: 5,
    education: "Bachelor's in Computer Science or related field"
  }

  // Mock matched candidates
  const [matchedCandidates] = useState<Candidate[]>([
    {
      id: "1",
      name: "John Doe",
      matchScore: 95,
      skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "Node.js"],
      experience: 6,
      education: "Master's in Computer Science",
      appliedThrough: "LinkedIn",
      appliedDate: "2024-01-15"
    },
    {
      id: "2",
      name: "Jane Smith",
      matchScore: 85,
      skills: ["React", "JavaScript", "CSS", "TailwindCSS"],
      experience: 4,
      education: "Bachelor's in Computer Science",
      appliedThrough: "Company Website",
      appliedDate: "2024-01-16"
    }
  ])

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      // In a real application, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Search Complete",
        description: "Found matching candidates based on job requirements.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search candidates. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCandidates = matchedCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            AI CV Matcher
          </span>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Matching...
              </>
            ) : (
              "Match CVs"
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <p className="text-sm">{jobRequirement.title}</p>
                </div>
                <div>
                  <Label>Required Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {jobRequirement.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Required Experience</Label>
                  <p className="text-sm">{jobRequirement.experience} years</p>
                </div>
                <div>
                  <Label>Required Education</Label>
                  <p className="text-sm">{jobRequirement.education}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Matched Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Match Score</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Education</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>{candidate.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              candidate.matchScore >= 90
                                ? "success"
                                : candidate.matchScore >= 70
                                ? "warning"
                                : "destructive"
                            }
                          >
                            {candidate.matchScore}%
                          </Badge>
                        </TableCell>
                        <TableCell>{candidate.experience} years</TableCell>
                        <TableCell>{candidate.education}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedCandidate(candidate)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Candidate Details</DialogTitle>
                              </DialogHeader>
                              {selectedCandidate && (
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                      <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">{selectedCandidate.name}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        Match Score: {selectedCandidate.matchScore}%
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Skills</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedCandidate.skills.map((skill, index) => (
                                        <Badge
                                          key={index}
                                          variant={
                                            jobRequirement.skills.includes(skill)
                                              ? "default"
                                              : "secondary"
                                          }
                                        >
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Experience</Label>
                                    <p className="text-sm">
                                      {selectedCandidate.experience} years
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Education</Label>
                                    <p className="text-sm">
                                      {selectedCandidate.education}
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Application Details</Label>
                                    <div className="text-sm space-y-1">
                                      <p>Applied through: {selectedCandidate.appliedThrough}</p>
                                      <p>Application date: {selectedCandidate.appliedDate}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
