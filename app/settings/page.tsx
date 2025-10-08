"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import ProtectedRoute from '@/components/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Settings, User, Bell, Shield, Palette, Link, Database, Save } from 'lucide-react'

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // General settings
    companyName: 'HR Management System',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    dailyDigest: false,
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    
    // Appearance settings
    theme: 'dark',
    fontSize: 'medium',
    sidebarCollapsed: false,
    
    // Integration settings
    googleCalendar: false,
    outlookCalendar: false,
    slackIntegration: false,
    zoomIntegration: false,
    
    // Advanced settings
    autoBackup: true,
    dataRetention: 365,
    debugMode: false,
    analytics: true
  })

  if (!isAuthenticated) {
    return <div>Please log in to view settings.</div>
  }

  const handleSave = () => {
    console.log('Saving settings:', settings)
    // Here you would typically save to backend
  }

  return (
    <ProtectedRoute requiredPermissions={['system.settings']}>
      <div className="p-6 space-y-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-hr-text-primary">Settings</h1>
            <p className="text-hr-text-secondary">Manage your system preferences and configurations</p>
          </div>
          <Button onClick={handleSave} className="bg-hr-primary text-white hover:bg-hr-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-hr-bg-secondary border-hr-border">
            <TabsTrigger value="general" className="text-hr-text-primary">General</TabsTrigger>
            <TabsTrigger value="notifications" className="text-hr-text-primary">Notifications</TabsTrigger>
            <TabsTrigger value="security" className="text-hr-text-primary">Security</TabsTrigger>
            <TabsTrigger value="appearance" className="text-hr-text-primary">Appearance</TabsTrigger>
            <TabsTrigger value="integrations" className="text-hr-text-primary">Integrations</TabsTrigger>
            <TabsTrigger value="advanced" className="text-hr-text-primary">Advanced</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary flex items-center gap-2">
                  <User className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription className="text-hr-text-secondary">
                  Basic system configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName" className="text-hr-text-primary">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                      className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone" className="text-hr-text-primary">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                      <SelectTrigger className="bg-hr-bg-primary border-hr-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language" className="text-hr-text-primary">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                      <SelectTrigger className="bg-hr-bg-primary border-hr-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateFormat" className="text-hr-text-primary">Date Format</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}>
                      <SelectTrigger className="bg-hr-bg-primary border-hr-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-hr-text-secondary">
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Email Notifications</Label>
                    <p className="text-sm text-hr-text-secondary">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Push Notifications</Label>
                    <p className="text-sm text-hr-text-secondary">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">SMS Notifications</Label>
                    <p className="text-sm text-hr-text-secondary">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Weekly Reports</Label>
                    <p className="text-sm text-hr-text-secondary">Receive weekly summary reports</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Daily Digest</Label>
                    <p className="text-sm text-hr-text-secondary">Receive daily activity digest</p>
                  </div>
                  <Switch
                    checked={settings.dailyDigest}
                    onCheckedChange={(checked) => setSettings({ ...settings, dailyDigest: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-hr-text-secondary">
                  Configure security and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Two-Factor Authentication</Label>
                    <p className="text-sm text-hr-text-secondary">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout" className="text-hr-text-primary">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 30 })}
                      className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passwordExpiry" className="text-hr-text-primary">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) => setSettings({ ...settings, passwordExpiry: parseInt(e.target.value) || 90 })}
                      className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="loginAttempts" className="text-hr-text-primary">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={settings.loginAttempts}
                    onChange={(e) => setSettings({ ...settings, loginAttempts: parseInt(e.target.value) || 5 })}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription className="text-hr-text-secondary">
                  Customize the look and feel of the interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme" className="text-hr-text-primary">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fontSize" className="text-hr-text-primary">Font Size</Label>
                  <Select value={settings.fontSize} onValueChange={(value) => setSettings({ ...settings, fontSize: value })}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Collapse Sidebar</Label>
                    <p className="text-sm text-hr-text-secondary">Start with sidebar collapsed</p>
                  </div>
                  <Switch
                    checked={settings.sidebarCollapsed}
                    onCheckedChange={(checked) => setSettings({ ...settings, sidebarCollapsed: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Integration Settings
                </CardTitle>
                <CardDescription className="text-hr-text-secondary">
                  Connect with external services and tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Google Calendar</Label>
                    <p className="text-sm text-hr-text-secondary">Sync with Google Calendar</p>
                  </div>
                  <Switch
                    checked={settings.googleCalendar}
                    onCheckedChange={(checked) => setSettings({ ...settings, googleCalendar: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Outlook Calendar</Label>
                    <p className="text-sm text-hr-text-secondary">Sync with Outlook Calendar</p>
                  </div>
                  <Switch
                    checked={settings.outlookCalendar}
                    onCheckedChange={(checked) => setSettings({ ...settings, outlookCalendar: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Slack Integration</Label>
                    <p className="text-sm text-hr-text-secondary">Connect with Slack workspace</p>
                  </div>
                  <Switch
                    checked={settings.slackIntegration}
                    onCheckedChange={(checked) => setSettings({ ...settings, slackIntegration: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Zoom Integration</Label>
                    <p className="text-sm text-hr-text-secondary">Connect with Zoom for meetings</p>
                  </div>
                  <Switch
                    checked={settings.zoomIntegration}
                    onCheckedChange={(checked) => setSettings({ ...settings, zoomIntegration: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription className="text-hr-text-secondary">
                  Advanced system configuration and maintenance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Auto Backup</Label>
                    <p className="text-sm text-hr-text-secondary">Automatically backup data daily</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                  />
                </div>
                <div>
                  <Label htmlFor="dataRetention" className="text-hr-text-primary">Data Retention (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => setSettings({ ...settings, dataRetention: parseInt(e.target.value) || 365 })}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Debug Mode</Label>
                    <p className="text-sm text-hr-text-secondary">Enable debug logging and diagnostics</p>
                  </div>
                  <Switch
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, debugMode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-hr-text-primary">Analytics</Label>
                    <p className="text-sm text-hr-text-secondary">Collect usage analytics and metrics</p>
                  </div>
                  <Switch
                    checked={settings.analytics}
                    onCheckedChange={(checked) => setSettings({ ...settings, analytics: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}