"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

interface Skill {
  id: string
  name: string
}

export function SkillManagement() {
  const [skills, setSkills] = useState<Skill[]>([
    { id: "1", name: "React" },
    { id: "2", name: "Node.js" },
    { id: "3", name: "TypeScript" },
  ])
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { id: Date.now().toString(), name: newSkill.trim() }])
      setNewSkill("")
    }
  }

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Skill Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter new skill"
              className="flex-grow"
            />
            <Button onClick={addSkill}>
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </div>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <Badge key={skill.id} variant="secondary" className="text-sm py-1 px-2">
                  {skill.name}
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
