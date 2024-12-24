import { Candidate } from "./interview-management"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CandidateListProps {
  candidates: Candidate[]
  onSelectCandidate: (candidate: Candidate) => void
}

export function CandidateList({ candidates, onSelectCandidate }: CandidateListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Candidates</h2>
      {candidates.map(candidate => (
        <Card 
          key={candidate.id} 
          className="cursor-pointer hover:bg-gray-100"
          onClick={() => onSelectCandidate(candidate)}
        >
          <CardContent className="p-4">
            <h3 className="font-medium">{candidate.name}</h3>
            <p className="text-sm text-gray-500">{candidate.jobTitle}</p>
            <Badge className="mt-2">{candidate.status}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

