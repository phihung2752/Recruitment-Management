import React from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CustomizeColumnsProps {
  columns: string[]
  onColumnsChange: (columns: string[]) => void
  availableColumns: string[]
}

export function CustomizeColumns({ columns, onColumnsChange, availableColumns }: CustomizeColumnsProps) {
  const handleColumnToggle = (column: string) => {
    if (columns.includes(column)) {
      onColumnsChange(columns.filter(c => c !== column))
    } else {
      onColumnsChange([...columns, column])
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Customize Columns</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Columns</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full p-4">
          {availableColumns.map((column) => (
            <div key={column} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={column}
                checked={columns.includes(column)}
                onCheckedChange={() => handleColumnToggle(column)}
              />
              <label htmlFor={column} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </label>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
