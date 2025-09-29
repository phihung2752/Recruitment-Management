"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BulkActionsProps {
  selectedCVs: string[]
  onBulkAction: (action: string) => void
}

export function BulkActions({ selectedCVs, onBulkAction }: BulkActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string>("")

  const handleActionChange = (action: string) => {
    setSelectedAction(action)
  }

  const handleApplyAction = () => {
    if (selectedAction) {
      onBulkAction(selectedAction)
    }
  }

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Select value={selectedAction} onValueChange={handleActionChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select bulk action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="changeStatus">Change Status</SelectItem>
          <SelectItem value="addTag">Add Tag</SelectItem>
          <SelectItem value="delete">Delete</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleApplyAction} disabled={!selectedAction || selectedCVs.length === 0}>
        Apply to {selectedCVs.length} CVs
      </Button>
    </div>
  )
}
