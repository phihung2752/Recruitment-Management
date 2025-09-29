import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Candidate {
  id: string
  name: string
  email: string
  status: "New" | "Reviewed" | "Interviewed" | "Offered" | "Rejected"
}

interface JobCandidatesProps {
  jobId: string
}

export function JobCandidates({ jobId }: JobCandidatesProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "New" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", status: "Reviewed" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", status: "Interviewed" },
  ])

  const [newCandidate, setNewCandidate] = useState<Omit<Candidate, "id">>({
    name: "",
    email: "",
    status: "New",
  })

  const handleAddCandidate = () => {
    if (newCandidate.name && newCandidate.email) {
      const candidate: Candidate = {
        id: (candidates.length + 1).toString(),
        ...newCandidate,
      }
      setCandidates([...candidates, candidate])
      setNewCandidate({ name: "", email: "", status: "New" })
      toast({
        title: "Candidate Added",
        description: `${candidate.name} has been added to the candidate list.`,
      })
    }
  }

  const handleUpdateStatus = (id: string, newStatus: Candidate["status"]) => {
    setCandidates(candidates.map(candidate =>
      candidate.id === id ? { ...candidate, status: newStatus } : candidate
    ))
    toast({
      title: "Candidate Status Updated",
      description: `Candidate status has been updated to ${newStatus}.`,
    })
  }

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Candidate</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newCandidate.email}
                onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleAddCandidate}>Add Candidate</Button>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>{candidate.name}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.status}</TableCell>
              <TableCell>
                <Select
                  value={candidate.status}
                  onValueChange={(value: Candidate["status"]) => handleUpdateStatus(candidate.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                    <SelectItem value="Interviewed">Interviewed</SelectItem>
                    <SelectItem value="Offered">Offered</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
