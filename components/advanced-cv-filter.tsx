"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { CVFilter } from "@/types/cv-management"

interface AdvancedCVFilterProps {
  filters: CVFilter
  onFilterChange: (filters: CVFilter) => void
}

export function AdvancedCVFilter({ filters, onFilterChange }: AdvancedCVFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Search</Label>
        <Input
          placeholder="Search by name, email, or skills..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={filters.status.join(",")}
          onValueChange={(value) => onFilterChange({ ...filters, status: value.split(",") })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="New,Reviewing">Active</SelectItem>
            <SelectItem value="Shortlisted">Shortlisted</SelectItem>
            <SelectItem value="Interviewed">Interviewed</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Source</Label>
        <Select
          value={filters.source.join(",")}
          onValueChange={(value) => onFilterChange({ ...filters, source: value.split(",") })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="Internal">Internal</SelectItem>
            <SelectItem value="Referral">Referral</SelectItem>
            <SelectItem value="Job Board">Job Board</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          placeholder="Filter by location"
          value={filters.location}
          onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Experience Level</Label>
        <Select
          value={filters.experienceLevel}
          onValueChange={(value) => onFilterChange({ ...filters, experienceLevel: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entry">Entry Level</SelectItem>
            <SelectItem value="mid">Mid Level</SelectItem>
            <SelectItem value="senior">Senior Level</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Minimum Match Percentage</Label>
        <Slider
          value={[filters.matchPercentage]}
          onValueChange={([value]) => onFilterChange({ ...filters, matchPercentage: value })}
          max={100}
          step={5}
        />
      </div>
    </div>
  )
}
