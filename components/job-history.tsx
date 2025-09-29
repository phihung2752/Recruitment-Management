import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

interface JobHistoryEntry {
  id: string
  date: Date
  action: string
  user: string
  details: string
}

interface JobHistoryProps {
  jobId: string
}

export function JobHistory({ jobId }: JobHistoryProps) {
  // In a real application, this data would be fetched from an API
  const mockHistory: JobHistoryEntry[] = [
    {
      id: "1",
      date: new Date(2024, 0, 1),
      action: "Created",
      user: "John Doe",
      details: "Job posting created"
    },
    {
      id: "2",
      date: new Date(2024, 0, 5),
      action: "Updated",
      user: "Jane Smith",
      details: "Updated job description"
    },
    {
      id: "3",
      date: new Date(2024, 0, 10),
      action: "Published",
      user: "Mike Johnson",
      details: "Job posting published"
    }
  ]

  return (
    <ScrollArea className="h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockHistory.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{format(entry.date, "PPP")}</TableCell>
              <TableCell>{entry.action}</TableCell>
              <TableCell>{entry.user}</TableCell>
              <TableCell>{entry.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
