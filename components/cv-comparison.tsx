"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CV } from "@/types/cv-management"

interface CVComparisonProps {
  cvs: CV[]
}

export function CVComparison({ cvs }: CVComparisonProps) {
  const [selectedCVs, setSelectedCVs] = useState<string[]>([])

  const handleSelectCV = (cvId: string) => {
    if (selectedCVs.includes(cvId)) {
      setSelectedCVs(selectedCVs.filter(id => id !== cvId))
    } else if (selectedCVs.length < 3) {
      setSelectedCVs([...selectedCVs, cvId])
    }
  }

  const selectedCVData = cvs.filter(cv => selectedCVs.includes(cv.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>CV Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            {[0, 1, 2].map((index) => (
              <Select key={index} value={selectedCVs[index]} onValueChange={(value) => handleSelectCV(value)}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select CV ${index + 1}`} />
                </SelectTrigger>
                <SelectContent>
                  {cvs.map((cv) => (
                    <SelectItem key={cv.id} value={cv.id}>{cv.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criteria</TableHead>
                {selectedCVData.map((cv) => (
                  <TableHead key={cv.id}>{cv.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {['position', 'experience', 'skills', 'matchPercentage', 'status'].map((criteria) => (
                <TableRow key={criteria}>
                  <TableCell className="font-medium">{criteria.charAt(0).toUpperCase() + criteria.slice(1)}</TableCell>
                  {selectedCVData.map((cv) => (
                    <TableCell key={cv.id}>
                      {criteria === 'skills' ? (cv as any)[criteria]?.join(', ') || '' : (cv as any)[criteria] || ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
