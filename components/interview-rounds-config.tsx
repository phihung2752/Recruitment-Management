"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from 'lucide-react'
import { InterviewRound } from "./interview-management"

interface InterviewRoundsConfigProps {
  rounds: InterviewRound[]
  setRounds: React.Dispatch<React.SetStateAction<InterviewRound[]>>
}

export function InterviewRoundsConfig({ rounds, setRounds }: InterviewRoundsConfigProps) {
  const addRound = () => {
    const newRound: InterviewRound = {
      id: (rounds.length + 1).toString(),
      name: "New Round",
      description: "Round description",
      order: rounds.length + 1
    }
    setRounds([...rounds, newRound])
  }

  const updateRound = (id: string, field: keyof InterviewRound, value: string | number) => {
    setRounds(rounds.map(round => 
      round.id === id ? { ...round, [field]: value } : round
    ))
  }

  const deleteRound = (id: string) => {
    setRounds(rounds.filter(round => round.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Interview Rounds Configuration
          <Button onClick={addRound} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Round
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rounds.map((round, index) => (
            <div key={round.id} className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-1 space-y-4">
                <div>
                  <Label>Round Name</Label>
                  <Input
                    value={round.name}
                    onChange={(e) => updateRound(round.id, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={round.description}
                    onChange={(e) => updateRound(round.id, "description", e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteRound(round.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
