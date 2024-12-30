"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"

interface Skill {
  id: string
  name: string
}

interface CandidateSkillAssessmentProps {
  candidateId: string
  candidateName: string
  skills: Skill[]
}

export function CandidateSkillAssessment({ candidateId, candidateName, skills }: CandidateSkillAssessmentProps) {
  const [skillRatings, setSkillRatings] = useState<Record<string, number>>(
    Object.fromEntries(skills.map(skill => [skill.id, 0]))
  )

  const handleRatingChange = (skillId: string, value: number[]) => {
    setSkillRatings(prev => ({ ...prev, [skillId]: value[0] }))
  }

  const handleSubmit = () => {
    // In a real application, you would send this data to your backend
    console.log({ candidateId, skillRatings })
    // Show a success toast
    toast({
      title: "Assessment Submitted",
      description: "The candidate's skill assessment has been recorded.",
    })
    // Reset ratings
    setSkillRatings(Object.fromEntries(skills.map(skill => [skill.id, 0])))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Skill Assessment: {candidateName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {skills.map(skill => (
            <div key={skill.id} className="space-y-2">
              <Label className="text-base">{skill.name}</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[skillRatings[skill.id]]}
                  onValueChange={(value) => handleRatingChange(skill.id, value)}
                  max={5}
                  step={0.5}
                  className="flex-grow"
                />
                <span className="w-12 text-center font-medium">{skillRatings[skill.id].toFixed(1)}/5</span>
              </div>
            </div>
          ))}
          <Button onClick={handleSubmit} className="w-full mt-6">Submit Assessment</Button>
        </div>
      </CardContent>
    </Card>
  )
}

