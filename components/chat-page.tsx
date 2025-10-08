"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Paperclip, Check, Users, Reply, Edit, Trash2, Smile, ChevronLeft, Loader2, MessageSquare, MoreHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import EmojiPicker from 'emoji-picker-react'
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
id: string
sender: string
content: string
timestamp: Date
read: boolean
readBy: string[]
attachment?: {
  name: string
  url: string
}
replyTo?: string
reactions: { [key: string]: string[] }
threadId?: string
isThreadStarter?: boolean
}

type User = {
id: number
name: string
avatar: string
status: 'online' | 'offline' | 'away'
}

const initialMessages: Message[] = [
{ id: "1", sender: "John Doe", content: "Hello team!", timestamp: new Date(2023, 5, 1, 9, 0), read: true, readBy: ["John Doe"], reactions: {}, isThreadStarter: true },
{ id: "2", sender: "Jane Smith", content: "Hi John, how are you?", timestamp: new Date(2023, 5, 1, 9, 5), read: true, readBy: ["Jane Smith"], reactions: {} },
{ id: "3", sender: "Mike Johnson", content: "Good morning everyone!", timestamp: new Date(2023, 5, 1, 9, 10), read: true, readBy: ["Mike Johnson"], reactions: {} },
]

const users: User[] = [
{ id: 1, name: "John Doe", avatar: "/avatars/john.png", status: 'online' },
{ id: 2, name: "Jane Smith", avatar: "/avatars/jane.png", status: 'away' },
{ id: 3, name: "Mike Johnson", avatar: "/avatars/mike.png", status: 'offline' },
{ id: 4, name: "Sarah Williams", avatar: "/avatars/sarah.png", status: 'online' },
{ id: 5, name: "David Brown", avatar: "/avatars/david.png", status: 'online' },
]

export default function ChatPage() {
const { t } = useLanguage()
const [messages, setMessages] = useState<Message[]>(initialMessages)
const [newMessage, setNewMessage] = useState("")
const [currentUser, setCurrentUser] = useState<User>(users[0])
const messagesEndRef = useRef<HTMLDivElement>(null)
const [searchTerm, setSearchTerm] = useState("")
const [selectedFile, setSelectedFile] = useState<File | null>(null)
const [groupName, setGroupName] = useState("")
const [showCreateGroup, setShowCreateGroup] = useState(false)
const [replyingTo, setReplyingTo] = useState<string | null>(null)
const [editingMessage, setEditingMessage] = useState<string | null>(null)
const [isTyping, setIsTyping] = useState<string | null>(null)
const { toast } = useToast()
const [threads, setThreads] = useState<{ [key: string]: Message[] }>({})
const [selectedThread, setSelectedThread] = useState<string | null>(null)
const [showUserList, setShowUserList] = useState(true)
const isMobile = useMediaQuery("(max-width: 640px)")
const [page, setPage] = useState(1)
const messagesPerPage = 20
const [isLoading, setIsLoading] = useState(false)
const [showEmojiPicker, setShowEmojiPicker] = useState(false)

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}, [messages])

useEffect(() => {
  // Simulated real-time updates
  const interval = setInterval(() => {
    const randomUser = users[Math.floor(Math.random() * users.length)]
    if (randomUser.name !== currentUser.name) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: randomUser.name,
        content: `This is a simulated message from ${randomUser.name}`,
        timestamp: new Date(),
        read: false,
        readBy: [],
        reactions: {},
      }
      setMessages(prevMessages => [...prevMessages, newMessage])
    }
  }, 30000) // New message every 30 seconds

  return () => clearInterval(interval)
}, [currentUser])

const handleSendMessage = (e: React.FormEvent) => {
  e.preventDefault()
  sendMessage()
}

const sendMessage = () => {
  if (newMessage.trim() || selectedFile) {
    const message: Message = {
      id: Date.now().toString(),
      sender: currentUser.name,
      content: newMessage,
      timestamp: new Date(),
      read: false,
      readBy: [currentUser.name],
      replyTo: replyingTo || undefined,
      reactions: {},
      threadId: replyingTo || (editingMessage ? messages.find(m => m.id === editingMessage)?.threadId : undefined),
      isThreadStarter: !replyingTo && !editingMessage
    }

    if (selectedFile) {
      message.attachment = {
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile)
      }
    }

    if (editingMessage) {
      setMessages(prevMessages => prevMessages.map(m =>
        m.id === editingMessage ? message : m
      ))
      setEditingMessage(null)
    } else {
      setMessages([...messages, message])
    }


    if (message.threadId) {
      setThreads(prevThreads => ({
        ...prevThreads,
        [message.threadId as string]: [...(prevThreads[message.threadId as string] || []), message]
      }))
    } else if (message.isThreadStarter) {
      setThreads(prevThreads => ({
        ...prevThreads,
        [message.id]: [message]
      }))
    }

    setNewMessage("")
    setSelectedFile(null)
    setReplyingTo(null)
    setIsTyping(null)
  }
}

const handleSearch = () => {
  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  )
  // Update UI to show filtered messages
  toast({
    title: t("Search Results"),
    description: `Found ${filteredMessages.length} messages containing "${searchTerm}"`,
  })
}

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file) {
    setSelectedFile(file)
  }
}

const handleCreateGroup = () => {
  if (groupName) {
    // Implement group creation logic
    toast({
      title: t("Group Created"),
      description: `Group "${groupName}" has been created.`,
    })
    setGroupName("")
    setShowCreateGroup(false)
  }
}

const handleReply = (messageId: string) => {
  setReplyingTo(messageId)
  setShowEmojiPicker(false) // Hide emoji picker when replying
}

const handleEdit = (messageId: string) => {
  setEditingMessage(messageId)
  const messageToEdit = messages.find(m => m.id === messageId)
  if (messageToEdit) {
    setNewMessage(messageToEdit.content)
    setShowEmojiPicker(false) // Hide emoji picker when editing
  }
}

const handleDelete = (messageId: string) => {
  setMessages(messages.filter(m => m.id !== messageId))
  toast({
    title: t("Message Deleted"),
    description: t("The message has been removed from the conversation."),
  })
}

const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
  setNewMessage(e.target.value)
  setIsTyping(currentUser.name)
  // Simulated typing indicator
  setTimeout(() => setIsTyping(null), 2000)
}

const handleEmojiSelect = (emoji: any) => {
  setNewMessage(prevMessage => prevMessage + emoji.emoji)
}

const handleReaction = (messageId: string, emoji: string) => {
  setMessages(messages.map(message => {
    if (message.id === messageId) {
      const updatedReactions = { ...message.reactions }
      if (updatedReactions[emoji]) {
        updatedReactions[emoji] = updatedReactions[emoji].includes(currentUser.name)
          ? updatedReactions[emoji].filter(user => user !== currentUser.name)
          : [...updatedReactions[emoji], currentUser.name]
      } else {
        updatedReactions[emoji] = [currentUser.name]
      }
      return { ...message, reactions: updatedReactions }
    }
    return message
  }))
}

const handleReadReceipt = (messageId: string) => {
  setMessages(messages.map(message => {
    if (message.id === messageId && !message.readBy.includes(currentUser.name)) {
      return { ...message, readBy: [...message.readBy, currentUser.name] }
    }
    return message
  }))
}

const handleViewThread = (threadId: string) => {
  setSelectedThread(threadId)
  setShowEmojiPicker(false) // Hide emoji picker when viewing thread
}

useEffect(() => {
  const scrollArea = messagesEndRef.current?.parentElement
  if (scrollArea) {
    const handleScroll = () => {
      if (scrollArea.scrollTop === 0 && !isLoading) {
        setIsLoading(true)
        // Simulate loading more messages
        setTimeout(() => {
          setPage((prevPage) => prevPage + 1)
          setIsLoading(false)
        }, 1000)
      }
    }
    scrollArea.addEventListener('scroll', handleScroll)
    return () => scrollArea.removeEventListener('scroll', handleScroll)
  }
}, [isLoading])

const handleToggleEmojiPicker = () => {
  setShowEmojiPicker(!showEmojiPicker)
}

return (
  <div className="h-[calc(100vh-4rem)] flex flex-col sm:flex-row">
    <div className="flex-grow flex space-x-4 overflow-hidden">
      {(!isMobile || showUserList) && (
        <Card className={`w-full sm:w-1/4 mb-4 sm:mb-0 sm:mr-4`}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{t("Users")}</span>
              {isMobile && (
                <Button variant="ghost" size="sm" onClick={() => setShowUserList(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer ${
                    user.id === currentUser.id ? "bg-secondary" : "hover:bg-secondary/50"
                  }`}
                  onClick={() => {
                    setCurrentUser(user)
                    if (isMobile) setShowUserList(false)
                  }}
                >
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className={`text-xs ${
                      user.status === 'online' ? 'text-green-500' :
                      user.status === 'away' ? 'text-yellow-500' :
                      'text-gray-500'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      {(!isMobile || !showUserList) && (
        <Card className={`flex-grow flex flex-col`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                {isMobile && (
                  <Button variant="ghost" size="sm" className="mr-2" onClick={() => setShowUserList(true)}>
                    <Users className="h-4 w-4" />
                  </Button>
                )}
                <span>{t("Messages")}</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      {t("Search")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("Search Messages")}</DialogTitle>
                    </DialogHeader>
                    <div className="flex space-x-2">
                      <Input
                        placeholder={t("Search messages...")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button onClick={handleSearch}>{t("Search")}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setShowCreateGroup(true)}>
                      <Users className="h-4 w-4 mr-2" />
                      {t("Create Group")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("Create Group Chat")}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                      <Input
                        placeholder={t("Enter group name")}
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                      <Button onClick={handleCreateGroup}>{t("Create Group")}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-4">
            <ScrollArea className="flex-grow mb-4 pr-4 h-[calc(100vh-16rem)]" type="always">
              {isLoading && (
                <div className="text-center py-2">
                  <Loader2 className="h-6 w-6 animate-spin inline-block" />
                  <span className="ml-2">{t("Loading more messages...")}</span>
                </div>
              )}
              {messages.slice(-page * messagesPerPage).map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 group peer ${message.sender === currentUser.name ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg max-w-[70%] break-words relative ${
                      message.sender === currentUser.name
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-secondary mr-auto"
                    }`}
                  >
                    {message.replyTo && (
                      <div className="absolute -top-4 -left-4 sm:-left-2 bg-muted p-1 rounded text-xs text-muted-foreground">
                        Replying to: {messages.find(m => m.id === message.replyTo)?.sender}
                      </div>
                    )}
                    <div className="flex items-start">
                      {!message.sender.startsWith("Current") && (
                        <Avatar className="mr-2">
                          <AvatarImage src={`/avatars/${message.sender.toLowerCase().replace(" ", "-")}.png`} alt={message.sender} />
                          <AvatarFallback>{message.sender.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{message.sender}</p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleReply(message.id)}>
                                <Reply className="h-4 w-4 mr-2" />
                                Reply
                              </DropdownMenuItem>
                              {message.sender === currentUser.name && (
                                <>
                                  <DropdownMenuItem onClick={() => handleEdit(message.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(message.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                              {message.isThreadStarter && (
                                <DropdownMenuItem onClick={() => handleViewThread(message.id)}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  View Thread
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="break-words">{message.content}</p>
                        {message.attachment && (
                          <a
                            href={message.attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {message.attachment.name}
                          </a>
                        )}
                        <div className="text-xs text-right mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center mt-2">
                          {Object.entries(message.reactions).map(([emoji, users]) => (
                            <div key={emoji} className="flex items-center space-x-1 mr-2">
                              <span>{emoji}</span>
                              <span className="text-xs text-muted-foreground">({users.length})</span>
                            </div>
                          ))}
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleReaction(message.id, "👍")}>
                            👍
                          </Button>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleReaction(message.id, "❤️")}>
                            ❤️
                          </Button>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleReaction(message.id, "😂")}>
                            😂
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {message.threadId && threads[message.threadId]?.length > 1 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="ml-auto mt-1 text-xs text-muted-foreground"
                      onClick={() => handleViewThread(message.threadId || "")}
                    >
                      View thread ({threads[message.threadId]?.length - 1})
                    </Button>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            {isTyping && (
              <div className="text-sm text-muted-foreground mb-2">
                {isTyping} {t("is typing...")}
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              {replyingTo && (
                <div className="text-sm text-muted-foreground mb-2 flex items-center">
                  <Reply className="h-4 w-4 mr-1" />
                  {t("Replying to:")} {messages.find(m => m.id === replyingTo)?.sender}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                    className="ml-2"
                  >
                    {t("Cancel")}
                  </Button>
                </div>
              )}
              <Input
                type="text"
                placeholder={t("Type your message...")}
                value={newMessage}
                onChange={handleTyping}
                className="flex-grow"
              />
              <Button variant="ghost" size="icon" onClick={handleToggleEmojiPicker}>
                <Smile className="h-4 w-4" />
              </Button>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Paperclip className="h-6 w-6" />
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button type="submit">
                {editingMessage ? t("Update") : t("Send")}
              </Button>
            </form>
            {showEmojiPicker && (
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverContent className="p-0">
                  <EmojiPicker onEmojiClick={(emoji) => handleEmojiSelect(emoji)} />
                </PopoverContent>
              </Popover>
            )}
          </CardContent>
        </Card>
      )}
    </div>
    {selectedThread && (
      <Dialog open={!!selectedThread} onOpenChange={() => setSelectedThread(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Thread")}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            {threads[selectedThread]?.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === currentUser.name ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === currentUser.name
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <p className="font-semibold">{message.sender}</p>
                  <p>{message.content}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs mr-1">{message.readBy.length} {t("read")}</span>
                      {message.read && <Check className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )}
  </div>
)
}
