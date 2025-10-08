"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  Link, 
  Mail, 
  Code, 
  CheckCircle, 
  AlertCircle, 
  Download,
  ExternalLink,
  Copy,
  RefreshCw
} from "lucide-react"

export default function ImportCVSection() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [embedCode, setEmbedCode] = useState("")

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }
    
    setIsUploading(false)
    console.log('Files uploaded:', files)
  }

  const generateEmbedCode = () => {
    const code = `<iframe 
  src="https://hr-system.com/cv-upload" 
  width="100%" 
  height="400" 
  frameborder="0"
  title="CV Upload Form">
</iframe>`
    setEmbedCode(code)
  }

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-hr-bg-secondary border-hr-border">
          <TabsTrigger value="upload" className="text-hr-text-primary">Upload Files</TabsTrigger>
          <TabsTrigger value="email" className="text-hr-text-primary">Email Import</TabsTrigger>
          <TabsTrigger value="portals" className="text-hr-text-primary">Job Portals</TabsTrigger>
          <TabsTrigger value="embed" className="text-hr-text-primary">Embed Code</TabsTrigger>
        </TabsList>

        {/* Upload Files Tab */}
        <TabsContent value="upload" className="space-y-4">
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary">Upload CV Files</CardTitle>
              <CardDescription className="text-hr-text-secondary">
                Drag and drop CV files or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-hr-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-hr-text-secondary mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-hr-text-primary font-medium">
                    Drop CV files here or click to browse
                  </p>
                  <p className="text-sm text-hr-text-secondary">
                    Supports PDF, DOC, DOCX files up to 20MB each
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  asChild 
                  className="mt-4 bg-hr-primary text-white hover:bg-hr-primary/90"
                >
                  <label htmlFor="file-upload">
                    Choose Files
                  </label>
                </Button>
              </div>
              
              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-hr-text-primary">Uploading...</span>
                    <span className="text-sm text-hr-text-secondary">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Import Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary">Email Import Configuration</CardTitle>
              <CardDescription className="text-hr-text-secondary">
                Set up automatic CV import from email attachments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email-address" className="text-hr-text-primary">Email Address</Label>
                  <Input
                    id="email-address"
                    value="recruitment@company.com"
                    readOnly
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="check-frequency" className="text-hr-text-primary">Check Frequency</Label>
                  <Input
                    id="check-frequency"
                    value="Every 4 hours"
                    readOnly
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-hr-text-primary">
                  Email import is active and monitoring for new CVs
                </span>
              </div>
              
              <div className="bg-hr-bg-primary border border-hr-border rounded-lg p-4">
                <h4 className="font-medium text-hr-text-primary mb-2">Import Statistics</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-hr-text-primary">24</p>
                    <p className="text-sm text-hr-text-secondary">CVs this month</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-hr-text-primary">156</p>
                    <p className="text-sm text-hr-text-secondary">Total imported</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-hr-text-primary">98%</p>
                    <p className="text-sm text-hr-text-secondary">Success rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Portals Tab */}
        <TabsContent value="portals" className="space-y-4">
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary">Job Portal Integrations</CardTitle>
              <CardDescription className="text-hr-text-secondary">
                Connect with popular job portals to import CVs automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "VietnamWorks", status: "Connected", lastSync: "2 hours ago" },
                  { name: "TopCV", status: "Connected", lastSync: "1 hour ago" },
                  { name: "CareerLink", status: "Disconnected", lastSync: "Never" },
                  { name: "Indeed", status: "Connected", lastSync: "30 minutes ago" },
                  { name: "LinkedIn", status: "Disconnected", lastSync: "Never" }
                ].map((portal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-hr-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-hr-bg-primary border border-hr-border rounded-lg flex items-center justify-center">
                        <ExternalLink className="h-5 w-5 text-hr-text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-hr-text-primary">{portal.name}</p>
                        <p className="text-sm text-hr-text-secondary">
                          Last sync: {portal.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          portal.status === "Connected" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {portal.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-hr-border text-hr-text-primary"
                      >
                        {portal.status === "Connected" ? "Sync Now" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Embed Code Tab */}
        <TabsContent value="embed" className="space-y-4">
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary">Embed Code Generator</CardTitle>
              <CardDescription className="text-hr-text-secondary">
                Generate embed code for your company website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website-url" className="text-hr-text-primary">Website URL</Label>
                <Input
                  id="website-url"
                  placeholder="https://yourcompany.com"
                  className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                />
              </div>
              
              <Button 
                onClick={generateEmbedCode}
                className="bg-hr-primary text-white hover:bg-hr-primary/90"
              >
                <Code className="mr-2 h-4 w-4" />
                Generate Embed Code
              </Button>
              
              {embedCode && (
                <div className="space-y-2">
                  <Label className="text-hr-text-primary">Embed Code</Label>
                  <div className="relative">
                    <textarea
                      value={embedCode}
                      readOnly
                      className="w-full h-32 p-3 bg-hr-bg-primary border border-hr-border rounded-lg text-hr-text-primary font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyEmbedCode}
                      className="absolute top-2 right-2 border-hr-border text-hr-text-primary"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-hr-text-secondary">
                    Copy this code and paste it into your website's HTML
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}






