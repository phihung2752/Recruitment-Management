"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Database, Mail, Shield, Bell, Save, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: t("Settings Saved"),
      description: t("Your settings have been saved successfully."),
    })
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{t("System Settings")}</h1>
          <p className="text-muted-foreground">{t("Configure your HR management system")}</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {t("Save Changes")}
        </Button>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>{t("System Status")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">{t("Database")}</span>
              <Badge variant="secondary" className="text-green-600">Online</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">{t("API Services")}</span>
              <Badge variant="secondary" className="text-green-600">Online</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">{t("Email Service")}</span>
              <Badge variant="secondary" className="text-yellow-600">Warning</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">{t("General")}</TabsTrigger>
          <TabsTrigger value="database">{t("Database")}</TabsTrigger>
          <TabsTrigger value="email">{t("Email")}</TabsTrigger>
          <TabsTrigger value="security">{t("Security")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>{t("General Settings")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">{t("Company Name")}</Label>
                  <Input id="companyName" defaultValue="HR Management System" />
                </div>
                <div>
                  <Label htmlFor="timezone">{t("Timezone")}</Label>
                  <Select defaultValue="Asia/Ho_Chi_Minh">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="maintenanceMode" />
                <Label htmlFor="maintenanceMode">{t("Maintenance Mode")}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>{t("Database Configuration")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dbProvider">{t("Database Provider")}</Label>
                <Select defaultValue="SqlServer">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SqlServer">SQL Server</SelectItem>
                    <SelectItem value="MySQL">MySQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="connectionString">{t("Connection String")}</Label>
                <Input 
                  id="connectionString" 
                  defaultValue="Server=localhost;Database=HRManagementDB;User Id=SA;Password=Hung@2752025;TrustServerCertificate=True;"
                  type="password"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="autoBackup" defaultChecked />
                <Label htmlFor="autoBackup">{t("Automatic Backup")}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>{t("Email Configuration")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpServer">{t("SMTP Server")}</Label>
                  <Input id="smtpServer" defaultValue="smtp.gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtpPort">{t("SMTP Port")}</Label>
                  <Input id="smtpPort" defaultValue="587" type="number" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="senderEmail">{t("Sender Email")}</Label>
                  <Input id="senderEmail" type="email" />
                </div>
                <div>
                  <Label htmlFor="senderPassword">{t("Sender Password")}</Label>
                  <Input id="senderPassword" type="password" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>{t("Security Settings")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sessionTimeout">{t("Session Timeout (minutes)")}</Label>
                <Input id="sessionTimeout" defaultValue="60" type="number" />
              </div>
              
              <div>
                <Label htmlFor="maxLoginAttempts">{t("Max Login Attempts")}</Label>
                <Input id="maxLoginAttempts" defaultValue="5" type="number" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="require2FA" />
                <Label htmlFor="require2FA">{t("Require Two-Factor Authentication")}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="passwordComplexity" defaultChecked />
                <Label htmlFor="passwordComplexity">{t("Enforce Password Complexity")}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}