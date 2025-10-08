'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Plus, Search, Filter, Paperclip, Clock, CheckCircle, XCircle } from "lucide-react"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  category: string
  lastUsed: string
  usageCount: number
}

interface Email {
  id: string
  to: string
  subject: string
  content: string
  status: 'draft' | 'sent' | 'scheduled'
  sentAt: string
  template?: string
}

export default function GmailTab() {
  const [activeTab, setActiveTab] = useState<'templates' | 'compose' | 'history'>('templates')
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Interview Invitation',
      subject: 'Interview Invitation - {{position}} at {{company}}',
      content: 'Dear {{candidateName}},\n\nWe are pleased to invite you for an interview for the {{position}} position at {{company}}.\n\nDate: {{date}}\nTime: {{time}}\nLocation: {{location}}\n\nPlease confirm your attendance.\n\nBest regards,\nHR Team',
      category: 'Interview',
      lastUsed: '2024-01-15',
      usageCount: 12
    },
    {
      id: '2',
      name: 'Interview Follow-up',
      subject: 'Thank you for your interview - {{position}}',
      content: 'Dear {{candidateName}},\n\nThank you for taking the time to interview with us for the {{position}} position.\n\nWe will review your application and get back to you within 2-3 business days.\n\nBest regards,\nHR Team',
      category: 'Follow-up',
      lastUsed: '2024-01-14',
      usageCount: 8
    },
    {
      id: '3',
      name: 'Rejection Email',
      subject: 'Application Update - {{position}}',
      content: 'Dear {{candidateName}},\n\nThank you for your interest in the {{position}} position.\n\nAfter careful consideration, we have decided to move forward with other candidates.\n\nWe encourage you to apply for future opportunities.\n\nBest regards,\nHR Team',
      category: 'Rejection',
      lastUsed: '2024-01-13',
      usageCount: 5
    }
  ])

  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      to: 'john.doe@email.com',
      subject: 'Interview Invitation - Frontend Developer',
      content: 'Dear John,\n\nWe are pleased to invite you for an interview...',
      status: 'sent',
      sentAt: '2024-01-15 10:30',
      template: 'Interview Invitation'
    },
    {
      id: '2',
      to: 'jane.smith@email.com',
      subject: 'Thank you for your interview - Backend Developer',
      content: 'Dear Jane,\n\nThank you for taking the time to interview...',
      status: 'sent',
      sentAt: '2024-01-14 15:45',
      template: 'Interview Follow-up'
    },
    {
      id: '3',
      to: 'bob.wilson@email.com',
      subject: 'Application Update - Full Stack Developer',
      content: 'Dear Bob,\n\nThank you for your interest...',
      status: 'draft',
      sentAt: '',
      template: 'Rejection Email'
    }
  ])

  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    content: '',
    template: ''
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-500'
      case 'draft': return 'bg-yellow-500'
      case 'scheduled': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4" />
      case 'draft': return <Clock className="h-4 w-4" />
      case 'scheduled': return <Clock className="h-4 w-4" />
      default: return <XCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-hr-text-primary">Gmail Integration</h2>
          <p className="text-hr-text-secondary">Manage email templates and communications</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('compose')}
            className="bg-hr-accent text-white hover:bg-hr-accent/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Compose Email
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-hr-bg-primary p-1 rounded-lg">
        {[
          { id: 'templates', label: 'Templates', icon: <Mail className="h-4 w-4" /> },
          { id: 'compose', label: 'Compose', icon: <Send className="h-4 w-4" /> },
          { id: 'history', label: 'History', icon: <Clock className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-hr-accent text-white'
                : 'text-hr-text-secondary hover:text-hr-text-primary hover:bg-hr-bg-secondary'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-hr-bg-primary border-hr-border"
                />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px] bg-hr-bg-primary border-hr-border">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Rejection">Rejection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-hr-bg-secondary border-hr-border hover:border-hr-accent transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-hr-text-primary text-lg">{template.name}</CardTitle>
                    <Badge variant="outline" className="text-hr-text-secondary">
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-hr-text-primary">Subject:</p>
                      <p className="text-sm text-hr-text-secondary">{template.subject}</p>
                    </div>
                    <div className="flex justify-between text-sm text-hr-text-secondary">
                      <span>Used {template.usageCount} times</span>
                      <span>Last used: {template.lastUsed}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Use Template
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Compose Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="To"
                value={newEmail.to}
                onChange={(e) => setNewEmail({...newEmail, to: e.target.value})}
                className="bg-hr-bg-primary border-hr-border"
              />
              <Select value={newEmail.template} onValueChange={(value) => setNewEmail({...newEmail, template: value})}>
                <SelectTrigger className="bg-hr-bg-primary border-hr-border">
                  <SelectValue placeholder="Select Template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Subject"
              value={newEmail.subject}
              onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
              className="bg-hr-bg-primary border-hr-border"
            />
            <Textarea
              placeholder="Email content..."
              value={newEmail.content}
              onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
              className="bg-hr-bg-primary border-hr-border"
              rows={8}
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Save Draft</Button>
                <Button className="bg-hr-accent text-white hover:bg-hr-accent/90">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Email History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emails.map((email) => (
                <div key={email.id} className="p-4 rounded-lg bg-hr-bg-primary border border-hr-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-hr-text-primary">{email.to}</span>
                      <Badge className={getStatusColor(email.status)}>
                        {getStatusIcon(email.status)}
                        <span className="ml-1">{email.status}</span>
                      </Badge>
                    </div>
                    <span className="text-sm text-hr-text-secondary">{email.sentAt}</span>
                  </div>
                  <h4 className="font-medium text-hr-text-primary mb-1">{email.subject}</h4>
                  <p className="text-sm text-hr-text-secondary line-clamp-2">{email.content}</p>
                  {email.template && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        Template: {email.template}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}






