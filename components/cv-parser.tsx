"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, FileText, Loader2 } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

interface ParsedCV {
  name: string
  email: string
  phone: string
  skills: string[]
  experience: {
    company: string
    position: string
    duration: string
  }[]
  education: {
    degree: string
    institution: string
    year: string
  }[]
}

interface CV {
  id: string
  code: string
  position: string
  company: string
  publishDate: Date
  applications: number
  status: "Active" | "Not Active"
}

interface CVParserProps {
  onAddCV: (cv: CV) => void
}

export function CVParser({ onAddCV }: CVParserProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedCV | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleParse = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to parse",
        variant: "destructive",
      })
      return
    }

    setIsParsing(true)
    try {
      // In a real application, this would send the file to your AI service
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to parse CV')
      }

      const data = await response.json()
      setParsedData(data)

      // Create a new CV object from the parsed data
      const newCV: CV = {
        id: Date.now().toString(),
        code: `Job - ${Date.now().toString().slice(-4)}`,
        position: data.experience[0]?.position || 'Unknown Position',
        company: data.experience[0]?.company || 'Unknown Company',
        publishDate: new Date(),
        applications: 0,
        status: "Active"
      }

      // Add the new CV to the system
      onAddCV(newCV)

      toast({
        title: "Success",
        description: "CV parsed and added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse CV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsParsing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          CV Parser
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="cv">Upload CV</Label>
          <Input
            id="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>

        <Button 
          onClick={handleParse} 
          disabled={!file || isParsing}
          className="w-full max-w-sm"
        >
          {isParsing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Parsing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Parse CV
            </>
          )}
        </Button>

        {parsedData && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Parsed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Personal Information</h3>
                    <p>Name: {parsedData.name}</p>
                    <p>Email: {parsedData.email}</p>
                    <p>Phone: {parsedData.phone}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-primary/10 px-2 py-1 text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold">Experience</h3>
                    {parsedData.experience.map((exp, index) => (
                      <div key={index} className="mt-2">
                        <p className="font-medium">{exp.position}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.company} • {exp.duration}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-semibold">Education</h3>
                    {parsedData.education.map((edu, index) => (
                      <div key={index} className="mt-2">
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">
                          {edu.institution} • {edu.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
