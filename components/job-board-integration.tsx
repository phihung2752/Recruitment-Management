"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, RefreshCw, Globe, Share2 } from 'lucide-react'

interface JobBoard {
  id: string
  name: string
  status: "active" | "inactive"
  lastSync: string
  postCount: number
}

interface JobPosting {
  id: string
  title: string
  boards: string[]
  status: "draft" | "published" | "expired"
  applications: number
  views: number
  publishDate: string
}

export function JobBoardIntegration() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const [jobBoards] = useState<JobBoard[]>([
    {
      id: "1",
      name: "LinkedIn",
      status: "active",
      lastSync: "2024-01-20 10:30",
      postCount: 15
    },
    {
      id: "2",
      name: "Indeed",
      status: "active",
      lastSync: "2024-01-20 09:45",
      postCount: 12
    },
    {
      id: "3",
      name: "Glassdoor",
      status: "inactive",
      lastSync: "2024-01-19 15:20",
      postCount: 8
    }
  ])

  const [jobPostings] = useState<JobPosting[]>([
    {
      id: "1",
      title: "Senior Frontend Developer",
      boards: ["LinkedIn", "Indeed"],
      status: "published",
      applications: 25,
      views: 450,
      publishDate: "2024-01-15"
    },
    {
      id: "2",
      title: "UX Designer",
      boards: ["LinkedIn", "Glassdoor"],
      status: "draft",
      applications: 0,
      views: 0,
      publishDate: "-"
    }
  ])

  const handleSync = async () => {
    setIsLoading(true)
    try {
      // In a real application, this would sync with job boards
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Sync Complete",
        description: "Successfully synchronized with all job boards.",
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPostings = jobPostings.filter(posting =>
    selectedStatus === "all" ? true : posting.status === selectedStatus
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Job Board Integration
          </span>
          <Button onClick={handleSync} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync All Boards
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="postings">Job Postings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {jobBoards.map((board) => (
                <Card key={board.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{board.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {board.postCount} active postings
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last sync: {board.lastSync}
                        </p>
                      </div>
                      <Badge
                        variant={board.status === "active" ? "success" : "secondary"}
                      >
                        {board.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Job posting synced to LinkedIn</p>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                        <Badge variant="outline">Sync</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="postings" className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="space-y-2 flex-1">
                <Label>Filter by Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="mt-8">
                <Share2 className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Job Boards</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Published</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPostings.map((posting) => (
                      <TableRow key={posting.id}>
                        <TableCell>{posting.title}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {posting.boards.map((board) => (
                              <Badge key={board} variant="outline">
                                {board}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              posting.status === "published"
                                ? "success"
                                : posting.status === "draft"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {posting.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{posting.applications}</TableCell>
                        <TableCell>{posting.views}</TableCell>
                        <TableCell>{posting.publishDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Board Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobBoards.map((board) => (
                  <div key={board.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <h3 className="font-semibold">{board.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        API Key: ••••••••••••
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        Test Connection
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-Sync Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <Select defaultValue="hourly">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notification Settings</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Updates</SelectItem>
                      <SelectItem value="important">Important Only</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

