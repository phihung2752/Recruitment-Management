"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ReportsPage() {
  const { t } = useLanguage()
  const [selectedPeriod, setSelectedPeriod] = useState("30days")

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{t("Reports & Analytics")}</h1>
          <p className="text-muted-foreground">{t("View detailed reports and analytics for your HR operations")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("Select period")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">{t("Last 7 days")}</SelectItem>
              <SelectItem value="30days">{t("Last 30 days")}</SelectItem>
              <SelectItem value="90days">{t("Last 90 days")}</SelectItem>
              <SelectItem value="1year">{t("Last year")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("Export Report")}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Total Applications")}</p>
                <p className="text-xl font-bold">0</p>
                <p className="text-xs text-green-600">+0% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Hire Rate")}</p>
                <p className="text-xl font-bold">0%</p>
                <p className="text-xs text-green-600">+0% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Avg. Time to Hire")}</p>
                <p className="text-xl font-bold">0 {t("days")}</p>
                <p className="text-xs text-red-600">+0% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Source Quality")}</p>
                <p className="text-xl font-bold">0%</p>
                <p className="text-xs text-green-600">+0% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
          <TabsTrigger value="recruitment">{t("Recruitment")}</TabsTrigger>
          <TabsTrigger value="performance">{t("Performance")}</TabsTrigger>
          <TabsTrigger value="custom">{t("Custom Reports")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Application Trends")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>{t("No data available")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Source Distribution")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-4" />
                    <p>{t("No data available")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("Recent Activity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("No recent activity")}</h3>
                <p className="text-muted-foreground">
                  {t("Activity will appear here as you use the system.")}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Job Posting Performance")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>{t("No job postings yet")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Interview Success Rate")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>{t("No interviews scheduled")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Employee Performance")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-4" />
                  <p>{t("No performance data available")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Custom Reports")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("Create Custom Reports")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("Build custom reports with specific metrics and filters.")}
                </p>
                <Button>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {t("Create Custom Report")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
