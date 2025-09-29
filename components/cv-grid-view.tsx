"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Mail, Tag, Star } from 'lucide-react'
import { CV } from "@/types/cv-management"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PullToRefresh } from "@/components/ui/pull-to-refresh"

interface CVGridViewProps {
  cvs: CV[]
  selectedCVs: string[]
  onSelectCV: (id: string) => void
  onTagCV: (id: string, tag: string) => void
  onScheduleInterview: (id: string, date: Date, link: string) => void
  availableTags: string[]
  onRefresh: () => Promise<void>
}

export function CVGridView({
  cvs,
  selectedCVs,
  onSelectCV,
  onTagCV,
  onScheduleInterview,
  availableTags,
  onRefresh
}: CVGridViewProps) {
  return (
    <PullToRefresh onRefresh={onRefresh}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cvs.map((cv) => (
          <Card key={cv.id} className="relative">
            <div className="absolute top-2 right-2">
              <Checkbox
                checked={selectedCVs.includes(cv.id)}
                onCheckedChange={() => onSelectCV(cv.id)}
              />
            </div>
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${cv.name}`} />
                <AvatarFallback>{cv.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{cv.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{cv.position}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cv.email}</span>
                </div>
                {cv.matchPercentage && (
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{cv.matchPercentage}% Match</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {cv.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                  {cv.skills.length > 3 && (
                    <Badge variant="secondary">+{cv.skills.length - 3}</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {cv.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => onTagCV(cv.id, tag)}>
                      {tag}
                    </Badge>
                  ))}
                  {cv.tags.length > 2 && (
                    <Badge variant="outline">+{cv.tags.length - 2}</Badge>
                  )}
                  <Select onValueChange={(value) => onTagCV(cv.id, value)}>
                    <SelectTrigger className="h-6 w-6 p-0">
                      <Tag className="h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {cv.interviewStatus && (
                  <Badge variant={
                    cv.interviewStatus === "Completed" ? "success" :
                    cv.interviewStatus === "Scheduled" ? "default" :
                    cv.interviewStatus === "Cancelled" ? "destructive" :
                    "secondary"
                  }>
                    {cv.interviewStatus}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PullToRefresh>
  )
}
