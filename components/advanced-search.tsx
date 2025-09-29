"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from 'lucide-react'

interface SearchFilters {
  experienceLevel: string[]
  skills: string[]
  location: string[]
  interviewStage: string[]
  rating: number
}

export function AdvancedSearch() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({
    experienceLevel: [],
    skills: [],
    location: [],
    interviewStage: [],
    rating: 0
  })

  const experienceLevels = ["Junior", "Mid-level", "Senior", "Lead"]
  const skills = ["React", "Node.js", "TypeScript", "Python", "Java"]
  const locations = ["Remote", "On-site", "Hybrid"]
  const stages = ["Screening", "Technical", "Cultural", "Final"]

  const toggleFilter = (category: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  const clearFilters = () => {
    setFilters({
      experienceLevel: [],
      skills: [],
      location: [],
      interviewStage: [],
      rating: 0
    })
    setSearchTerm("")
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-4 py-2">
        <CardTitle>Advanced Search</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          {isExpanded ? "Hide Filters" : "Show Filters"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            {(filters.experienceLevel.length > 0 || 
             filters.skills.length > 0 || 
             filters.location.length > 0 || 
             filters.interviewStage.length > 0) && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="whitespace-nowrap"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Experience Level</h3>
                <div className="flex flex-wrap gap-2">
                  {experienceLevels.map(level => (
                    <Badge
                      key={level}
                      variant={filters.experienceLevel.includes(level) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleFilter("experienceLevel", level)}
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <Badge
                      key={skill}
                      variant={filters.skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleFilter("skills", skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Location</h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map(location => (
                    <Badge
                      key={location}
                      variant={filters.location.includes(location) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleFilter("location", location)}
                    >
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Interview Stage</h3>
                <div className="flex flex-wrap gap-2">
                  {stages.map(stage => (
                    <Badge
                      key={stage}
                      variant={filters.interviewStage.includes(stage) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleFilter("interviewStage", stage)}
                    >
                      {stage}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2 lg:col-span-4">
                <h3 className="text-sm font-medium">Minimum Rating</h3>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[filters.rating]}
                    onValueChange={([value]) => setFilters(prev => ({ ...prev, rating: value }))}
                    max={5}
                    step={0.5}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">{filters.rating}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
