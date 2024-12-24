"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const initialCandidates = [
  { id: 1, name: "John Doe", position: "Software Engineer", status: "Screening", rating: 4 },
  { id: 2, name: "Jane Smith", position: "Product Manager", status: "Interview", rating: 3 },
  { id: 3, name: "Mike Johnson", position: "UX Designer", status: "Offer", rating: 5 },
]

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState(initialCandidates)
  const [newCandidate, setNewCandidate] = useState({ name: "", position: "", status: "", rating: 0 })
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault()
    const newCandidateEntry = {
      id: candidates.length + 1,
      ...newCandidate,
    }
    setCandidates([...candidates, newCandidateEntry])
    setNewCandidate({ name: "", position: "", status: "", rating: 0 })
  }

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Candidate</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newCandidate.position}
                  onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newCandidate.status}
                  onValueChange={(value) => setNewCandidate({ ...newCandidate, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Screening">Screening</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={newCandidate.rating}
                  onChange={(e) => setNewCandidate({ ...newCandidate, rating: parseInt(e.target.value) })}
                  required
                />
              </div>
              <Button type="submit">Add Candidate</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>{candidate.name}</TableCell>
                  <TableCell>{candidate.position}</TableCell>
                  <TableCell>{candidate.status}</TableCell>
                  <TableCell>{candidate.rating}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleSelectCandidate(candidate)}>
                      View Details
                    </Button>
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
                <CardTitle>Candidate Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Name:</span> {selectedCandidate.name}
                  </div>
                  <div>
                    <span className="font-semibold">Position:</span> {selectedCandidate.position}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span> {selectedCandidate.status}
                  </div>
                  <div>
                    <span className="font-semibold">Rating:</span> {selectedCandidate.rating}
                  </div>
                </div>
                <div className="mt-4 space-x-2">
                  <Button size="sm">Schedule Interview</Button>
                  <Button size="sm" variant="outline">Send Email</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

