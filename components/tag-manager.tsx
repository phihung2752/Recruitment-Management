import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'

interface TagManagerProps {
  availableTags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

export function TagManager({ availableTags, onAddTag, onRemoveTag }: TagManagerProps) {
  const [newTag, setNewTag] = useState('')

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      onAddTag(newTag.trim())
      setNewTag('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tag Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Enter new tag"
          />
          <Button onClick={handleAddTag}>Add Tag</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-sm py-1 px-2">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-4 w-4 p-0"
                onClick={() => onRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
