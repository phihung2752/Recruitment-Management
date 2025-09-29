"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Database, 
  Upload, 
  Download, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Users,
  Briefcase,
  Calendar
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/components/ui/use-toast"

export default function DataManagementPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBackup = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    toast({
      title: t("Backup Created"),
      description: t("Database backup has been created successfully."),
    })
  }

  const handleRestore = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsProcessing(false)
    toast({
      title: t("Restore Completed"),
      description: t("Database has been restored successfully."),
    })
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{t("Data Management")}</h1>
          <p className="text-muted-foreground">{t("Manage your database and data operations")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={isProcessing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? "animate-spin" : ""}`} />
            {t("Refresh")}
          </Button>
        </div>
      </div>

      {/* Database Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>{t("Database Status")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-muted-foreground">{t("Health Score")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1.2GB</div>
              <div className="text-sm text-muted-foreground">{t("Database Size")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1,247</div>
              <div className="text-sm text-muted-foreground">{t("Total Records")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">24h</div>
              <div className="text-sm text-muted-foreground">{t("Last Backup")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
          <TabsTrigger value="backup">{t("Backup & Restore")}</TabsTrigger>
          <TabsTrigger value="import">{t("Import/Export")}</TabsTrigger>
          <TabsTrigger value="maintenance">{t("Maintenance")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{t("Data Summary")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t("Users")}</span>
                    <Badge variant="secondary">5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t("Employees")}</span>
                    <Badge variant="secondary">3</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t("Candidates")}</span>
                    <Badge variant="secondary">10</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t("Job Postings")}</span>
                    <Badge variant="secondary">5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t("Interviews")}</span>
                    <Badge variant="secondary">0</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>{t("Storage Usage")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("Database")}</span>
                      <span>1.2GB / 2GB</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("Files")}</span>
                      <span>150MB / 1GB</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t("Backups")}</span>
                      <span>300MB / 500MB</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {t("Your database is healthy and running optimally. Last maintenance was performed 2 days ago.")}
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Create Backup")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backupName">{t("Backup Name")}</Label>
                  <Input 
                    id="backupName" 
                    placeholder={t("e.g. backup_2024_01_15")}
                    defaultValue={`backup_${new Date().toISOString().split('T')[0]}`}
                  />
                </div>
                <div>
                  <Label htmlFor="backupType">{t("Backup Type")}</Label>
                  <Select defaultValue="full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">{t("Full Backup")}</SelectItem>
                      <SelectItem value="incremental">{t("Incremental Backup")}</SelectItem>
                      <SelectItem value="differential">{t("Differential Backup")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleBackup} disabled={isProcessing} className="w-full">
                  {isProcessing ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="mr-2 h-4 w-4" />
                  )}
                  {t("Create Backup")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Restore from Backup")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backupFile">{t("Select Backup File")}</Label>
                  <Input id="backupFile" type="file" accept=".bak,.sql" />
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {t("Warning: This will replace all current data with the backup data.")}
                  </AlertDescription>
                </Alert>
                <Button onClick={handleRestore} disabled={isProcessing} variant="destructive" className="w-full">
                  {isProcessing ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {t("Restore Backup")}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("Recent Backups")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">backup_2024_01_15.bak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">1.2GB</Badge>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">backup_2024_01_14.bak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">1.1GB</Badge>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Import Data")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="importType">{t("Import Type")}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employees">{t("Employees")}</SelectItem>
                      <SelectItem value="candidates">{t("Candidates")}</SelectItem>
                      <SelectItem value="jobPostings">{t("Job Postings")}</SelectItem>
                      <SelectItem value="all">{t("All Data")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="importFile">{t("Select File")}</Label>
                  <Input id="importFile" type="file" accept=".csv,.xlsx,.json" />
                </div>
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  {t("Import Data")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Export Data")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="exportType">{t("Export Type")}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employees">{t("Employees")}</SelectItem>
                      <SelectItem value="candidates">{t("Candidates")}</SelectItem>
                      <SelectItem value="jobPostings">{t("Job Postings")}</SelectItem>
                      <SelectItem value="all">{t("All Data")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="exportFormat">{t("Export Format")}</Label>
                  <Select defaultValue="csv">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  {t("Export Data")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Database Maintenance")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <RefreshCw className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm">{t("Optimize Database")}</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <Trash2 className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm">{t("Clean Old Data")}</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm">{t("Check Integrity")}</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <Database className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm">{t("Rebuild Indexes")}</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
