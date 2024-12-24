"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RecruitmentRequestDetail } from "./recruitment-request-detail"

type RecruitmentRequest = {
  id: string
  position: string
  department: string
  requester: string
  status: "Pending" | "Approved" | "Rejected"
  description: string
  requiredSkills: string[]
  experienceLevel: string
  expectedSalary: string
}

const initialRequests: RecruitmentRequest[] = [
  {
    id: "1",
    position: "Software Engineer",
    department: "Engineering",
    requester: "John Doe",
    status: "Pending",
    description: "We need a senior software engineer with 5+ years of experience in React and Node.js.",
    requiredSkills: ["React", "Node.js", "TypeScript"],
    experienceLevel: "Senior",
    expectedSalary: "$100,000 - $130,000"
  },
  {
    id: "2",
    position: "Marketing Manager",
    department: "Marketing",
    requester: "Jane Smith",
    status: "Approved",
    description: "Looking for a marketing manager to lead our digital marketing initiatives.",
    requiredSkills: ["Digital Marketing", "SEO", "Social Media Management"],
    experienceLevel: "Mid-level",
    expectedSalary: "$80,000 - $100,000"
  },
]

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance"]

export function RecruitmentRequestManagement() {
  const [requests, setRequests] = useState<RecruitmentRequest[]>(initialRequests)
  const [newRequest, setNewRequest] = useState<Omit<RecruitmentRequest, 'id' | 'status'>>({
    position: '',
    department: '',
    requester: '',
    description: '',
    requiredSkills: [],
    experienceLevel: '',
    expectedSalary: ''
  })
  const [selectedRequest, setSelectedRequest] = useState<RecruitmentRequest | null>(null)

  const handleAddRequest = () => {
    const request: RecruitmentRequest = {
      ...newRequest,
      id: (requests.length + 1).toString(),
      status: "Pending",
      requiredSkills: newRequest.requiredSkills.length > 0 ? newRequest.requiredSkills : []
    }
    setRequests([...requests, request])
    setNewRequest({
      position: '',
      department: '',
      requester: '',
      description: '',
      requiredSkills: [],
      experienceLevel: '',
      expectedSalary: ''
    })
  }

  const handleUpdateStatus = (id: string, newStatus: "Approved" | "Rejected", feedback: string) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: newStatus } : request
    ))
    setSelectedRequest(null)
    // In a real application, you would also save the feedback to the server
    console.log(`Feedback for request ${id}: ${feedback}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Recruitment Request</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={newRequest.position}
                onChange={(e) => setNewRequest({ ...newRequest, position: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select onValueChange={(value) => setNewRequest({ ...newRequest, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="requester">Requester</Label>
              <Input
                id="requester"
                value={newRequest.requester}
                onChange={(e) => setNewRequest({ ...newRequest, requester: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Input
                id="experienceLevel"
                value={newRequest.experienceLevel}
                onChange={(e) => setNewRequest({ ...newRequest, experienceLevel: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="requiredSkills">Required Skills (comma-separated)</Label>
              <Input
                id="requiredSkills"
                value={newRequest.requiredSkills.join(", ")}
                onChange={(e) => setNewRequest({ ...newRequest, requiredSkills: e.target.value.split(",").map(skill => skill.trim()) })}
              />
            </div>
            <div>
              <Label htmlFor="expectedSalary">Expected Salary</Label>
              <Input
                id="expectedSalary"
                value={newRequest.expectedSalary}
                onChange={(e) => setNewRequest({ ...newRequest, expectedSalary: e.target.value })}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddRequest}>Submit Request</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recruitment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.position}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.requester}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Recruitment Request Details</DialogTitle>
                        </DialogHeader>
                        {selectedRequest && (
                          <RecruitmentRequestDetail
                            request={selectedRequest}
                            onUpdateStatus={handleUpdateStatus}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

