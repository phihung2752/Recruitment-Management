import { useState } from "react"
import { Candidate } from "./interview-management"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from "@/components/ui/input"

interface CandidateListProps {
  candidates: Candidate[]
  onSelectCandidate: (candidate: Candidate) => void
}

export function CandidateList({ candidates, onSelectCandidate }: CandidateListProps) {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 5

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold">Candidates</h2>
        <span className="text-sm text-muted-foreground">
          Total: {filteredCandidates.length}
        </span>
      </div>

      <Input
        placeholder="Search candidates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-3">
          {currentCandidates.map(candidate => (
            <Card 
              key={candidate.id} 
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onSelectCandidate(candidate)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{candidate.name}</h3>
                    <Badge variant={candidate.status === "passed" ? "success" : "secondary"}>
                      {candidate.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{candidate.jobTitle}</p>
                  <p className="text-xs text-muted-foreground">{candidate.email}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1
            return (
              <Button
                key={pageNumber}
                variant={page === pageNumber ? "default" : "outline"}
                size="icon"
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            )
          })}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
