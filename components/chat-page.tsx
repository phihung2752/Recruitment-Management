"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: number
  sender: string
  content: string
  timestamp: Date
}

type User = {
  id: number
  name: string
  avatar: string
}

const initialMessages: Message[] = [
  { id: 1, sender: "John Doe", content: "Hello team!", timestamp: new Date(2023, 5, 1, 9, 0) },
  { id: 2, sender: "Jane Smith", content: "Hi John, how are you?", timestamp: new Date(2023, 5, 1, 9, 5) },
  { id: 3, sender: "Mike Johnson", content: "Good morning everyone!", timestamp: new Date(2023, 5, 1, 9, 10) },
]

const users: User[] = [
  { id: 1, name: "John Doe", avatar: "/avatars/john.png" },
  { id: 2, name: "Jane Smith", avatar: "/avatars/jane.png" },
  { id: 3, name: "Mike Johnson", avatar: "/avatars/mike.png" },
  { id: 4, name: "Sarah Williams", avatar: "/avatars/sarah.png" },
  { id: 5, name: "David Brown", avatar: "/avatars/david.png" },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<User>(users[0])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    const message: Message = {
      id: messages.length + 1,
      sender: currentUser.name,
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="flex-grow flex space-x-4 overflow-hidden">
        <Card className="w-1/4">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer ${
                    user.id === currentUser.id ? "bg-secondary" : "hover:bg-secondary/50"
                  }`}
                  onClick={() => setCurrentUser(user)}
                >
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <ScrollArea className="flex-grow">
              {messages.map((message) => (
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
                    <p className="text-xs mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit">Send</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

