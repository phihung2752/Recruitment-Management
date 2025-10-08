"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Send, Plus, Bell, Archive, Star, Paperclip } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { format } from "date-fns"

interface Message {
  id: string
  subject: string
  content: string
  sender: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  recipients: {
    id: string
    name: string
    email: string
  }[]
  timestamp: Date
  read: boolean
  starred: boolean
  archived: boolean
  priority: "low" | "normal" | "high"
  attachments?: {
    name: string
    size: string
    url: string
  }[]
}

interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    email: string
    avatar?: string
  }[]
  lastMessage: Message
  unreadCount: number
}

export default function MessagesPage() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("inbox")
  const [newMessage, setNewMessage] = useState({
    recipients: [] as string[],
    subject: "",
    content: "",
    priority: "normal" as "low" | "normal" | "high",
  })
  const [showCompose, setShowCompose] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "1",
        subject: "Welcome to the HR System",
        content:
          "Welcome to our new HR management system. Please take some time to explore the features and let us know if you have any questions.",
        sender: {
          id: "admin",
          name: "System Administrator",
          email: "admin@company.com",
        },
        recipients: [
          {
            id: "user1",
            name: "Current User",
            email: "user@company.com",
          },
        ],
        timestamp: new Date(2024, 0, 20, 10, 30),
        read: false,
        starred: false,
        archived: false,
        priority: "normal",
      },
      {
        id: "2",
        subject: "Interview Scheduled - John Doe",
        content:
          "An interview has been scheduled for John Doe for the Software Engineer position on January 25th at 2:00 PM.",
        sender: {
          id: "hr1",
          name: "HR Manager",
          email: "hr@company.com",
        },
        recipients: [
          {
            id: "user1",
            name: "Current User",
            email: "user@company.com",
          },
        ],
        timestamp: new Date(2024, 0, 19, 14, 15),
        read: true,
        starred: true,
        archived: false,
        priority: "high",
      },
      {
        id: "3",
        subject: "Monthly Performance Review",
        content:
          "Please prepare for your monthly performance review scheduled for next week. Review your goals and achievements.",
        sender: {
          id: "manager1",
          name: "Team Manager",
          email: "manager@company.com",
        },
        recipients: [
          {
            id: "user1",
            name: "Current User",
            email: "user@company.com",
          },
        ],
        timestamp: new Date(2024, 0, 18, 9, 0),
        read: true,
        starred: false,
        archived: false,
        priority: "normal",
      },
    ]

    const mockConversations: Conversation[] = [
      {
        id: "conv1",
        participants: [
          { id: "hr1", name: "HR Manager", email: "hr@company.com" },
          { id: "user1", name: "Current User", email: "user@company.com" },
        ],
        lastMessage: mockMessages[1],
        unreadCount: 1,
      },
      {
        id: "conv2",
        participants: [
          { id: "manager1", name: "Team Manager", email: "manager@company.com" },
          { id: "user1", name: "Current User", email: "user@company.com" },
        ],
        lastMessage: mockMessages[2],
        unreadCount: 0,
      },
    ]

    setMessages(mockMessages)
    setConversations(mockConversations)
  }, [])

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.name.toLowerCase().includes(searchTerm.toLowerCase())

    switch (activeTab) {
      case "inbox":
        return matchesSearch && !message.archived
      case "starred":
        return matchesSearch && message.starred
      case "archived":
        return matchesSearch && message.archived
      case "unread":
        return matchesSearch && !message.read
      default:
        return matchesSearch
    }
  })

  const handleSendMessage = () => {
    if (newMessage.subject && newMessage.content && newMessage.recipients.length > 0) {
      const message: Message = {
        id: Date.now().toString(),
        subject: newMessage.subject,
        content: newMessage.content,
        sender: {
          id: "user1",
          name: "Current User",
          email: "user@company.com",
        },
        recipients: newMessage.recipients.map((email) => ({
          id: email,
          name: email,
          email: email,
        })),
        timestamp: new Date(),
        read: true,
        starred: false,
        archived: false,
        priority: newMessage.priority,
      }

      setMessages([message, ...messages])
      setNewMessage({
        recipients: [],
        subject: "",
        content: "",
        priority: "normal",
      })
      setShowCompose(false)

      toast({
        title: t("Message Sent"),
        description: t("Your message has been sent successfully."),
      })
    }
  }

  const handleMarkAsRead = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)))
  }

  const handleStarMessage = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, starred: !msg.starred } : msg)))
  }

  const handleArchiveMessage = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, archived: !msg.archived } : msg)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const unreadCount = messages.filter((msg) => !msg.read).length

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">{t("Messages")}</h1>
        <div className="flex space-x-2">
          <Dialog open={showCompose} onOpenChange={setShowCompose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("Compose")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("Compose Message")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipients">{t("Recipients")}</Label>
                  <Input
                    id="recipients"
                    placeholder={t("Enter email addresses separated by commas")}
                    value={newMessage.recipients.join(", ")}
                    onChange={(e) =>
                      setNewMessage({
                        ...newMessage,
                        recipients: e.target.value.split(",").map((email) => email.trim()),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="subject">{t("Subject")}</Label>
                  <Input
                    id="subject"
                    value={newMessage.subject}
                    onChange={(e) =>
                      setNewMessage({
                        ...newMessage,
                        subject: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="priority">{t("Priority")}</Label>
                  <Select
                    value={newMessage.priority}
                    onValueChange={(value: "low" | "normal" | "high") =>
                      setNewMessage({
                        ...newMessage,
                        priority: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t("Low")}</SelectItem>
                      <SelectItem value="normal">{t("Normal")}</SelectItem>
                      <SelectItem value="high">{t("High")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">{t("Message")}</Label>
                  <Textarea
                    id="content"
                    rows={6}
                    value={newMessage.content}
                    onChange={(e) =>
                      setNewMessage({
                        ...newMessage,
                        content: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCompose(false)}>
                    {t("Cancel")}
                  </Button>
                  <Button onClick={handleSendMessage}>
                    <Send className="mr-2 h-4 w-4" />
                    {t("Send")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <Card>
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("Search messages...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                <TabsList className="grid w-full grid-cols-1 h-auto">
                  <TabsTrigger value="inbox" className="justify-start">
                    <div className="flex items-center justify-between w-full">
                      <span>{t("Inbox")}</span>
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="starred" className="justify-start">
                    <Star className="mr-2 h-4 w-4" />
                    {t("Starred")}
                  </TabsTrigger>
                  <TabsTrigger value="archived" className="justify-start">
                    <Archive className="mr-2 h-4 w-4" />
                    {t("Archived")}
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    {t("Unread")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Message List */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Messages")}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border-b cursor-pointer hover:bg-accent hover:shadow-md transition-all ${
                        selectedMessage?.id === message.id ? "bg-accent" : ""
                      } ${!message.read ? "bg-blue-50 dark:bg-blue-950" : ""}`}
                      onClick={() => {
                        setSelectedMessage(message)
                        if (!message.read) {
                          handleMarkAsRead(message.id)
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.sender.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {message.sender.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{message.sender.name}</p>
                            <div className="flex items-center space-x-1">
                              {message.priority !== "normal" && (
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`} />
                              )}
                              {message.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                              <span className="text-xs text-muted-foreground">
                                {format(message.timestamp, "MMM dd")}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm font-medium truncate mt-1">{message.subject}</p>
                          <p className="text-sm text-muted-foreground truncate">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Message Detail */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedMessage ? t("Message Details") : t("Select a message")}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMessage ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedMessage.sender.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {selectedMessage.sender.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedMessage.sender.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedMessage.sender.email}</p>
                          <p className="text-sm text-muted-foreground">{format(selectedMessage.timestamp, "PPpp")}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleStarMessage(selectedMessage.id)}>
                          <Star
                            className={`h-4 w-4 ${selectedMessage.starred ? "text-yellow-500 fill-current" : ""}`}
                          />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleArchiveMessage(selectedMessage.id)}>
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-lg mb-2">{selectedMessage.subject}</h3>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                      </div>
                    </div>

                    {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">{t("Attachments")}</h4>
                        <div className="space-y-2">
                          {selectedMessage.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                              <Paperclip className="h-4 w-4" />
                              <span className="text-sm">{attachment.name}</span>
                              <span className="text-xs text-muted-foreground">({attachment.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm">{t("Reply")}</Button>
                      <Button variant="outline" size="sm">
                        {t("Forward")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>{t("Select a message to view its contents")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
