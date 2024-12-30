"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface MatchingMetrics {
  date: string
  matches: number
  applications: number
  qualifiedCandidates: number
}

interface SkillGap {
  skill: string
  demand: number
  supply: number
  gap: number
}

interface TopSource {
  source: string
  candidates: number
  qualifiedRate: number
  hireRate: number
}

export function JobMatchingAnalytics() {
  const [timeRange, setTimeRange] = useState("30")

  const matchingMetrics: MatchingMetrics[] = [
    { date: "Week 1", matches: 45, applications: 120, qualifiedCandidates: 35 },
    { date: "Week 2", matches: 52, applications: 145, qualifiedCandidates: 42 },
    { date: "Week 3", matches: 58, applications: 160, qualifiedCandidates: 48 },
    { date: "Week 4", matches: 65, applications: 180, qualifiedCandidates: 55 }
  ]

  const skillGaps: SkillGap[] = [
    { skill: "React", demand: 100, supply: 80, gap: 20 },
    { skill: "Node.js", demand: 90, supply: 60, gap: 30 },
    { skill: "TypeScript", demand: 85, supply: 55, gap: 30 },
    { skill: "Python", demand: 70, supply: 75, gap: -5 }
  ]

  const topSources: TopSource[] = [
    { source: "LinkedIn", candidates: 250, qualifiedRate: 75, hireRate: 25 },
    { source: "Indeed", candidates: 180, qualifiedRate: 65, hireRate: 20 },
    { source: "Internal Referrals", candidates: 120, qualifiedRate: 85, hireRate: 35 },
    { source: "Company Website", candidates: 90, qualifiedRate: 70, hireRate: 22 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job Matching Analytics</h2>
        <div className="flex items-center space-x-2">
          <Label>Time Range:</Label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Match Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">68%</div>
            <p className="text-sm text-muted-foreground">
              +5% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Time to Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3.2 days</div>
            <p className="text-sm text-muted-foreground">
              -0.5 days from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">
              12 with matches pending
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matching Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={matchingMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="matches" 
                  stroke="#8884d8" 
                  name="Matches"
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#82ca9d" 
                  name="Applications"
                />
                <Line 
                  type="monotone" 
                  dataKey="qualifiedCandidates" 
                  stroke="#ffc658" 
                  name="Qualified Candidates"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillGaps}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="demand" fill="#8884d8" name="Demand" />
                  <Bar dataKey="supply" fill="#82ca9d" name="Supply" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Candidate Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {topSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{source.source}</p>
                      <p className="text-sm text-muted-foreground">
                        {source.candidates} candidates
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {source.qualifiedRate}% qualified
                      </Badge>
                      <Badge variant="outline">
                        {source.hireRate}% hired
                      </Badge>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

