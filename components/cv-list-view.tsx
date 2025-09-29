"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Mail, Tag, Star, FileText } from 'lucide-react'
import { CV } from "@/types/cv-management"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PullToRefresh } from "@/components/ui/pull-to-refresh"

interface CVListViewProps {
  cvs: CV[]
  selectedCVs: string[]
  onSelectCV: (id: string) => void
  onTagCV: (id: string, tag: string) => void
  onScheduleInterview: (id: string, date: Date, link: string) => void
  visibleColumns: string[]
  availableTags: string[]
  onRefresh: () => Promise<void>
}

export function CVListView({
  cvs,
  selectedCVs,
  onSelectCV,
  onTagCV,
  onScheduleInterview,
  visibleColumns,
  availableTags,
  onRefresh
}: CVListViewProps) {
  return (
    <PullToRefresh onRefresh={onRefresh}>
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCVs.length === cvs.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onSelectCV(cvs.map(cv => cv.id).join(','))
                    } else {
                      onSelectCV('')
                    }
                  }}
                />
              </TableHead>
              {visibleColumns.includes('name') && <TableHead>Name</TableHead>}
              {visibleColumns.includes('position') && <TableHead className="hidden md:table-cell">Position</TableHead>}
              {visibleColumns.includes('status') && <TableHead className="hidden sm:table-cell">Status</TableHead>}
              {visibleColumns.includes('tags') && <TableHead className="hidden lg:table-cell">Tags</TableHead>}
              {visibleColumns.includes('appliedDate') && <TableHead className="hidden xl:table-cell">Applied Date</TableHead>}
              {visibleColumns.includes('email') && <TableHead className="hidden md:table-cell">Email</TableHead>}
              {visibleColumns.includes('experience') && <TableHead className="hidden lg:table-cell">Experience</TableHead>}
              {visibleColumns.includes('skills') && <TableHead className="hidden xl:table-cell">Skills</TableHead>}
              {visibleColumns.includes('source') && <TableHead className="hidden 2xl:table-cell">Source</TableHead>}
              {visibleColumns.includes('matchPercentage') && <TableHead className="hidden sm:table-cell">Match %</TableHead>}
              {visibleColumns.includes('location') && <TableHead className="hidden xl:table-cell">Location</TableHead>}
              {visibleColumns.includes('salary') && <TableHead className="hidden 2xl:table-cell">Salary</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cvs.map((cv) => (
              <TableRow key={cv.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCVs.includes(cv.id)}
                    onCheckedChange={() => onSelectCV(cv.id)}
                  />
                </TableCell>
                {visibleColumns.includes('name') && <TableCell>{cv.name}</TableCell>}
                {visibleColumns.includes('position') && <TableCell className="hidden md:table-cell">{cv.position}</TableCell>}
                {visibleColumns.includes('status') && (
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={
                      cv.status === "Shortlisted" ? "success" :
                      cv.status === "Reviewing" ? "default" :
                      cv.status === "Rejected" ? "destructive" :
                      "secondary"
                    }>
                      {cv.status}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.includes('tags') && (
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {cv.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => onTagCV(cv.id, tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                      <Select onValueChange={(value) => onTagCV(cv.id, value)}>
                        <SelectTrigger className="h-6 w-6 p-0">
                          <Tag className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTags.map((tag) => (
                            <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes('appliedDate') && (
                  <TableCell className="hidden xl:table-cell">{format(cv.appliedDate, "PPP")}</TableCell>
                )}
                {visibleColumns.includes('email') && <TableCell className="hidden md:table-cell">{cv.email}</TableCell>}
                {visibleColumns.includes('experience') && <TableCell className="hidden lg:table-cell">{cv.experience} years</TableCell>}
                {visibleColumns.includes('skills') && (
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {cv.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes('source') && <TableCell className="hidden 2xl:table-cell">{cv.source}</TableCell>}
                {visibleColumns.includes('matchPercentage') && (
                  <TableCell className="hidden sm:table-cell">
                    {cv.matchPercentage && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{cv.matchPercentage}%</span>
                      </div>
                    )}
                  </TableCell>
                )}
                {visibleColumns.includes('location') && <TableCell className="hidden xl:table-cell">{cv.location}</TableCell>}
                {visibleColumns.includes('salary') && <TableCell className="hidden 2xl:table-cell">${cv.salary?.toLocaleString()}</TableCell>}
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </PullToRefresh>
  )
}
