"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

interface JobBoard {
  id: string
  name: string
  status: "connected" | "disconnected"
  lastSync: string
}

interface AggregatedCV {
  id: string
  name: string
  source: string
  position: string
  dateReceived: string
  status: "new" | "reviewed" | "matched"
}

export function CVAggregator() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSource, setSelectedSource] = useState<string>("all")

  const [jobBoards] = useState<JobBoard[]>([
    {
      id: "1",
      name: "LinkedIn",
      status: "connected",
      lastSync: "2024-01-20 10:30"
    },
    {
      id: "2",
      name: "Indeed",
      status: "connected",
      lastSync: "2024-01-20 09:45"
    },
    {
      id: "3",
      name: "Glassdoor",
      status: "disconnected",
      lastSync: "2024-01-19 15:20"
    }
  ])

  const [aggregatedCVs] = useState<AggregatedCV[]>([
    {
      id: "1",
      name: "John Smith",
      source: "LinkedIn",
      position: "Senior Developer",
      dateReceived: "2024-01-20",
      status: "new"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      source: "Indeed",
      position: "UX Designer",
      dateReceived: "2024-01-19",
      status: "reviewed"
    }
  ])

  const handleSync = async () => {
    setIsLoading(true)
    try {
      // In a real application, this would sync with job boards
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Sync Complete",
        description: "Successfully synchronized CVs from all connected job boards.",
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize CVs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCVs = aggregatedCVs.filter(cv =>
    selectedSource === "all" ? true : cv.source === selectedSource
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>CV Aggregator</span>
          <Button onClick={handleSync} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Connected Job Boards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {jobBoards.map((board) => (
                <Card key={board.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{board.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last sync: {board.lastSync}
                        </p>
                      </div>
                      <Badge
                        variant={board.status === "connected" ? "success" : "destructive"}
                      >
                        {board.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center space-x-4">
          <div className="space-y-2 flex-1">
            <Label>Filter by Source</Label>
            <Select
              value={selectedSource}
              onValueChange={setSelectedSource}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {jobBoards.map((board) => (
                  <SelectItem key={board.id} value={board.name}>
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aggregated CVs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md">
              <div className="space-y-4">
                {filteredCVs.map((cv) => (
                  <Card key={cv.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{cv.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {cv.position}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{cv.source}</Badge>
                            <span className="text-sm text-muted-foreground">
                              Received: {cv.dateReceived}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            cv.status === "new"
                              ? "default"
                              : cv.status === "reviewed"
                              ? "secondary"
                              : "success"
                          }
                        >
                          {cv.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
