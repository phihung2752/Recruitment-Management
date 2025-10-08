"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Download,
  ExternalLink,
  RefreshCw
} from "lucide-react"

export default function SourceAnalytics() {
  const sourceData = [
    {
      name: "VietnamWorks",
      count: 45,
      percentage: 35,
      cost: 1200,
      hired: 8,
      conversionRate: 17.8,
      quality: 4.2
    },
    {
      name: "TopCV",
      count: 32,
      percentage: 25,
      cost: 800,
      hired: 6,
      conversionRate: 18.8,
      quality: 4.5
    },
    {
      name: "CareerLink",
      count: 28,
      percentage: 22,
      cost: 600,
      hired: 4,
      conversionRate: 14.3,
      quality: 3.8
    },
    {
      name: "Indeed",
      count: 15,
      percentage: 12,
      cost: 400,
      hired: 3,
      conversionRate: 20.0,
      quality: 4.0
    },
    {
      name: "LinkedIn",
      count: 8,
      percentage: 6,
      cost: 300,
      hired: 2,
      conversionRate: 25.0,
      quality: 4.7
    }
  ]

  const totalCandidates = sourceData.reduce((sum, source) => sum + source.count, 0)
  const totalHired = sourceData.reduce((sum, source) => sum + source.hired, 0)
  const totalCost = sourceData.reduce((sum, source) => sum + source.cost, 0)
  const avgConversionRate = sourceData.reduce((sum, source) => sum + source.conversionRate, 0) / sourceData.length

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-hr-text-secondary">Total CVs</p>
                <p className="text-2xl font-bold text-hr-text-primary">{totalCandidates}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-hr-text-secondary">Hired</p>
                <p className="text-2xl font-bold text-hr-text-primary">{totalHired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-hr-text-secondary">Total Cost</p>
                <p className="text-2xl font-bold text-hr-text-primary">${totalCost.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-hr-text-secondary">Avg. Conversion</p>
                <p className="text-2xl font-bold text-hr-text-primary">{avgConversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source Performance Chart */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary">Source Performance</CardTitle>
          <CardDescription className="text-hr-text-secondary">
            CV count and conversion rate by source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sourceData.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-hr-text-primary">{source.name}</span>
                    <Badge variant="outline" className="border-hr-border text-hr-text-primary">
                      {source.count} CVs
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-hr-text-secondary">
                      {source.conversionRate}% conversion
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress value={source.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-hr-text-secondary">
                    <span>{source.percentage}% of total</span>
                    <span>Quality: {source.quality}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics Table */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary">Detailed Source Analytics</CardTitle>
          <CardDescription className="text-hr-text-secondary">
            Comprehensive metrics for each CV source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-hr-border">
                  <th className="text-left py-2 text-hr-text-primary">Source</th>
                  <th className="text-left py-2 text-hr-text-primary">CVs</th>
                  <th className="text-left py-2 text-hr-text-primary">Hired</th>
                  <th className="text-left py-2 text-hr-text-primary">Conversion</th>
                  <th className="text-left py-2 text-hr-text-primary">Cost</th>
                  <th className="text-left py-2 text-hr-text-primary">Quality</th>
                  <th className="text-left py-2 text-hr-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sourceData.map((source, index) => (
                  <tr key={index} className="border-b border-hr-border">
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-hr-text-secondary" />
                        <span className="text-hr-text-primary">{source.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-hr-text-primary">{source.count}</td>
                    <td className="py-2 text-hr-text-primary">{source.hired}</td>
                    <td className="py-2">
                      <Badge 
                        className={
                          source.conversionRate >= 20 
                            ? "bg-green-100 text-green-800" 
                            : source.conversionRate >= 15 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {source.conversionRate}%
                      </Badge>
                    </td>
                    <td className="py-2 text-hr-text-primary">${source.cost.toLocaleString()}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.floor(source.quality) 
                                ? "bg-yellow-400" 
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-hr-text-secondary">
                          {source.quality}
                        </span>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ROI Analysis */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary">ROI Analysis</CardTitle>
          <CardDescription className="text-hr-text-secondary">
            Return on investment for each CV source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-hr-text-primary mb-4">Cost per Hire</h4>
              <div className="space-y-2">
                {sourceData.map((source, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-hr-text-primary">{source.name}</span>
                    <span className="text-hr-text-primary">
                      ${source.hired > 0 ? Math.round(source.cost / source.hired) : 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-hr-text-primary mb-4">Quality Score</h4>
              <div className="space-y-2">
                {sourceData.map((source, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-hr-text-primary">{source.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={source.quality * 20} className="w-20 h-2" />
                      <span className="text-hr-text-primary">{source.quality}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}






