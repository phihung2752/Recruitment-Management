"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function SystemSettingsPage() {
  const [interviewSteps, setInterviewSteps] = useState([
    "Resume Screening",
    "Phone Interview",
    "Technical Assessment",
    "On-site Interview",
    "Final Decision"
  ])

  const [newStep, setNewStep] = useState("")

  const addInterviewStep = () => {
    if (newStep.trim() !== "") {
      setInterviewSteps([...interviewSteps, newStep.trim()])
      setNewStep("")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">System Settings</h1>
      <Tabs defaultValue="configuration">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage your system settings and interview process.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="Enter your company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-zone">Default Time Zone</Label>
                <Select>
                  <SelectTrigger id="time-zone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="cst">Central Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Interview Steps</Label>
                <ul className="list-disc pl-5 space-y-1">
                  {interviewSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
                <div className="flex space-x-2">
                  <Input
                    placeholder="New interview step"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                  />
                  <Button onClick={addInterviewStep}>Add Step</Button>
                </div>
              </div>
              <Button>Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>Manage your database settings and perform maintenance tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="db-host">Database Host</Label>
                <Input id="db-host" placeholder="Enter database host" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-name">Database Name</Label>
                <Input id="db-name" placeholder="Enter database name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-user">Database User</Label>
                <Input id="db-user" placeholder="Enter database user" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-password">Database Password</Label>
                <Input id="db-password" type="password" placeholder="Enter database password" />
              </div>
              <div className="flex space-x-2">
                <Button>Test Connection</Button>
                <Button variant="outline">Backup Database</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>System Monitoring and Maintenance</CardTitle>
              <CardDescription>Monitor system performance and schedule maintenance tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>System Health</Label>
                <div className="flex space-x-2">
                  <div className="flex-1 bg-green-100 p-2 rounded">
                    <p className="font-semibold">CPU Usage</p>
                    <p>25%</p>
                  </div>
                  <div className="flex-1 bg-yellow-100 p-2 rounded">
                    <p className="font-semibold">Memory Usage</p>
                    <p>60%</p>
                  </div>
                  <div className="flex-1 bg-blue-100 p-2 rounded">
                    <p className="font-semibold">Disk Usage</p>
                    <p>45%</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Scheduled Maintenance</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-backup" />
                  <Label htmlFor="auto-backup">Enable Automatic Backups</Label>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select backup frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Run System Diagnostics</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>System Integration</CardTitle>
              <CardDescription>Manage integrations with other systems (ERP, CRM).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ERP Integration</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="erp-integration" />
                  <Label htmlFor="erp-integration">Enable ERP Integration</Label>
                </div>
                <Input placeholder="ERP API Endpoint" />
                <Input placeholder="ERP API Key" type="password" />
              </div>
              <div className="space-y-2">
                <Label>CRM Integration</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="crm-integration" />
                  <Label htmlFor="crm-integration">Enable CRM Integration</Label>
                </div>
                <Input placeholder="CRM API Endpoint" />
                <Input placeholder="CRM API Key" type="password" />
              </div>
              <Button>Test Integrations</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security and Compliance</CardTitle>
              <CardDescription>Manage security settings and ensure GDPR compliance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Security Settings</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="two-factor" />
                  <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="ssl" />
                  <Label htmlFor="ssl">Force SSL</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>GDPR Compliance</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="data-retention" />
                  <Label htmlFor="data-retention">Enable Data Retention Policies</Label>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="2years">2 Years</SelectItem>
                    <SelectItem value="3years">3 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="privacy-policy">Privacy Policy</Label>
                <Textarea id="privacy-policy" placeholder="Enter your privacy policy" />
              </div>
              <Button>Update Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

