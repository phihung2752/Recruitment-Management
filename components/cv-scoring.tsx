"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CV } from "@/types/cv-management"

interface CVScoringProps {
  cvs: CV[]
  onUpdateScores: (scores: { [key: string]: number }) => void
}

export function CVScoring({ cvs, onUpdateScores }: CVScoringProps) {
  const [scores, setScores] = useState<{ [key: string]: number }>({})

  const handleScoreChange = (cvId: string, score: number) => {
    setScores({ ...scores, [cvId]: score })
  }

  const handleSubmitScores = () => {
    onUpdateScores(scores)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CV Scoring</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Current Score</TableHead>
              <TableHead>New Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cvs.map((cv) => (
              <TableRow key={cv.id}>
                <TableCell>{cv.name}</TableCell>
                <TableCell>{cv.position}</TableCell>
                <TableCell>{cv.matchPercentage || 'N/A'}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={scores[cv.id] || ''}
                    onChange={(e) => handleScoreChange(cv.id, Number(e.target.value))}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4" onClick={handleSubmitScores}>Update Scores</Button>
      </CardContent>
    </Card>
  )
}
