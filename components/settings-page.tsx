"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
// import { useTheme } from "@/contexts/theme-context"
import { Save, Bell, Shield, Database, Mail, Palette, Building } from "lucide-react"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  // const { theme, toggleTheme } = useTheme()
  const theme = 'light' // Default theme
  const toggleTheme = () => {} // Placeholder function

  const [companySettings, setCompanySettings] = useState({
    name: "HR Management Company",
    address: "123 Business Street, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "contact@company.com",
    website: "https://company.com",
    logo: "",
    timezone: "UTC-5",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    workingHours: {
      start: "09:00",
      end: "17:00",
    },
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newApplications: true,
    interviewReminders: true,
    performanceReviews: true,
    leaveRequests: true,
    systemUpdates: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    loginAttempts: 5,
    accountLockoutDuration: 15,
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    googleCalendar: false,
    microsoftOutlook: false,
    slack: false,
    zoom: false,
    googleDrive: false,
    dropbox: false,
  })

  const handleSaveSettings = (section: string) => {
    toast({
      title: t("Settings Saved"),
      description: `${section} settings have been updated successfully.`,
    })
  }

  const handleTestEmail = () => {
    toast({
      title: t("Test Email Sent"),
      description: t("A test email has been sent to verify your email configuration."),
    })
  }

  const handleBackupDatabase = () => {
    toast({
      title: t("Database Backup"),
      description: t("Database backup has been initiated. You will receive a notification when complete."),
    })
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("Settings")}</h1>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company">{t("Company")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("Notifications")}</TabsTrigger>
          <TabsTrigger value="security">{t("Security")}</TabsTrigger>
          <TabsTrigger value="integrations">{t("Integrations")}</TabsTrigger>
          <TabsTrigger value="appearance">{t("Appearance")}</TabsTrigger>
          <TabsTrigger value="system">{t("System")}</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                {t("Company Information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">{t("Company Name")}</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="companyEmail">{t("Email")}</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone">{t("Phone")}</Label>
                  <Input
                    id="companyPhone"
                    value={companySettings.phone}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="companyWebsite">{t("Website")}</Label>
                  <Input
                    id="companyWebsite"
                    value={companySettings.website}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        website: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="companyAddress">{t("Address")}</Label>
                  <Textarea
                    id="companyAddress"
                    value={companySettings.address}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">{t("Timezone")}</Label>
                  <Select
                    value={companySettings.timezone}
                    onValueChange={(value) =>
                      setCompanySettings({
                        ...companySettings,
                        timezone: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">{t("Currency")}</Label>
                  <Select
                    value={companySettings.currency}
                    onValueChange={(value) =>
                      setCompanySettings({
                        ...companySettings,
                        currency: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="VND">VND - Vietnamese Dong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("Company")}>
                <Save className="mr-2 h-4 w-4" />
                {t("Save Company Settings")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                {t("Notification Preferences")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("Email Notifications")}</Label>
                    <p className="text-sm text-muted-foreground">{t("Receive notifications via email")}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("Push Notifications")}</Label>
                    <p className="text-sm text-muted-foreground">{t("Receive browser push notifications")}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        pushNotifications: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("New Applications")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("Notify when new job applications are received")}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.newApplications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        newApplications: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("Interview Reminders")}</Label>
                    <p className="text-sm text-muted-foreground">{t("Remind about upcoming interviews")}</p>
                  </div>
                  <Switch
                    checked={notificationSettings.interviewReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        interviewReminders: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("Leave Requests")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("Notify about leave requests requiring approval")}
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.leaveRequests}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        leaveRequests: checked,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleSaveSettings("Notifications")}>
                  <Save className="mr-2 h-4 w-4" />
                  {t("Save Notification Settings")}
                </Button>
                <Button variant="outline" onClick={handleTestEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  {t("Test Email")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                {t("Security Settings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("Two-Factor Authentication")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("Add an extra layer of security to your account")}
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">{t("Session Timeout (minutes)")}</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="loginAttempts">{t("Max Login Attempts")}</Label>
                    <Input
                      id="loginAttempts"
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          loginAttempts: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>{t("Password Policy")}</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={securitySettings.passwordPolicy.requireUppercase}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: {
                              ...securitySettings.passwordPolicy,
                              requireUppercase: checked,
                            },
                          })
                        }
                      />
                      <Label>{t("Require uppercase letters")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={securitySettings.passwordPolicy.requireNumbers}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: {
                              ...securitySettings.passwordPolicy,
                              requireNumbers: checked,
                            },
                          })
                        }
                      />
                      <Label>{t("Require numbers")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={securitySettings.passwordPolicy.requireSpecialChars}
                        onCheckedChange={(checked) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: {
                              ...securitySettings.passwordPolicy,
                              requireSpecialChars: checked,
                            },
                          })
                        }
                      />
                      <Label>{t("Require special characters")}</Label>
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("Security")}>
                <Save className="mr-2 h-4 w-4" />
                {t("Save Security Settings")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Third-Party Integrations")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(integrationSettings).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        {key.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                        <p className="text-sm text-muted-foreground">{enabled ? t("Connected") : t("Not connected")}</p>
                      </div>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) =>
                        setIntegrationSettings({
                          ...integrationSettings,
                          [key]: checked,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <Button onClick={() => handleSaveSettings("Integrations")}>
                <Save className="mr-2 h-4 w-4" />
                {t("Save Integration Settings")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                {t("Appearance Settings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>{t("Theme")}</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => toggleTheme()}
                    >
                      {t("Light")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toggleTheme()}
                    >
                      {t("Dark")}
                    </Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>{t("Language")}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[200px] mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSaveSettings("Appearance")}>
                <Save className="mr-2 h-4 w-4" />
                {t("Save Appearance Settings")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                {t("System Management")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>{t("Database Management")}</Label>
                  <p className="text-sm text-muted-foreground mb-2">{t("Backup and restore your database")}</p>
                  <div className="flex space-x-2">
                    <Button onClick={handleBackupDatabase}>
                      <Database className="mr-2 h-4 w-4" />
                      {t("Backup Database")}
                    </Button>
                    <Button variant="outline">{t("Restore Database")}</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label>{t("System Information")}</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{t("Version")}</span>
                      <Badge variant="secondary">v1.0.0</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t("Database")}</span>
                      <Badge variant="secondary">SQL Server</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t("Last Backup")}</span>
                      <Badge variant="secondary">2024-01-20 10:30</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
