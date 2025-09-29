"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { CV } from "@/types/cv-management"

interface SkillAssessmentProps {
  cv: CV
  onUpdateSkills: (cvId: string, skills: { name: string; level: number }[]) => void
}

export function SkillAssessment({ cv, onUpdateSkills }: SkillAssessmentProps) {
  const [skills, setSkills] = useState(
    cv.skills.map(skill => ({ name: skill, level: 0 }))
  )
  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = () => {
    if (newSkill && !skills.some(skill => skill.name === newSkill)) {
      setSkills([...skills, { name: newSkill, level: 0 }])
      setNewSkill("")
    }
  }

  const handleSkillLevelChange = (index: number, level: number) => {
    const updatedSkills = [...skills]
    updatedSkills[index].level = level
    setSkills(updatedSkills)
  }

  const handleSaveAssessment = () => {
    onUpdateSkills(cv.id, skills)
    toast({
      title: "Skill Assessment Saved",
      description: "The skill assessment has been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Assessment for {cv.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Add new skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <Button onClick={handleAddSkill}>Add Skill</Button>
          </div>
          {skills.map((skill, index) => (
            <div key={skill.name} className="space-y-2">
              <Label>{skill.name}</Label>
              <Slider
                min={0}
                max={5}
                step={1}
                value={[skill.level]}
                onValueChange={(value) => handleSkillLevelChange(index, value[0])}
              />
              <span className="text-sm text-muted-foreground">
                Level: {skill.level} / 5
              </span>
            </div>
          ))}
          <Button onClick={handleSaveAssessment}>Save Assessment</Button>
        </div>
      </CardContent>
    </Card>
  )
}
