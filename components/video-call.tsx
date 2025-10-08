'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Settings, 
  Share, 
  Users, 
  MessageCircle,
  MoreHorizontal,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  ScreenShare,
  ScreenShareOff,
  StopCircle,
  Clock,
  User,
  Star,
  Flag
} from 'lucide-react'

interface VideoCallProps {
  isOpen: boolean
  onClose: () => void
  event: {
    id: string
    title: string
    candidateName?: string
    position?: string
    interviewer?: string
    videoLink?: string
    meetingId?: string
    meetingPassword?: string
    platform?: string
  }
}

interface Participant {
  id: string
  name: string
  role: 'interviewer' | 'candidate' | 'observer'
  isVideoOn: boolean
  isAudioOn: boolean
  isSpeaking: boolean
  avatar?: string
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  timestamp: Date
  type: 'text' | 'system'
}

export default function VideoCall({ isOpen, onClose, event }: VideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenShareRef = useRef<HTMLVideoElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  // Mock participants
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: event.interviewer || 'Interviewer',
      role: 'interviewer',
      isVideoOn: true,
      isAudioOn: true,
      isSpeaking: false
    },
    {
      id: '2',
      name: event.candidateName || 'Candidate',
      role: 'candidate',
      isVideoOn: true,
      isAudioOn: true,
      isSpeaking: false
    }
  ])

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isOpen) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isOpen])

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    // In real implementation, this would control the camera
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
    // In real implementation, this would control the microphone
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    // In real implementation, this would start/stop screen sharing
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In real implementation, this would start/stop recording
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'You',
        message: chatMessage.trim(),
        timestamp: new Date(),
        type: 'text'
      }
      setChatMessages(prev => [...prev, newMessage])
      setChatMessage('')
    }
  }

  const addSystemMessage = (message: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'System',
      message,
      timestamp: new Date(),
      type: 'system'
    }
    setChatMessages(prev => [...prev, systemMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-none w-screen h-screen' : 'max-w-6xl'} p-0`}>
        <div className="flex h-full">
          {/* Main Video Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Recording</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{formatTime(callDuration)}</span>
                </div>
                <Badge variant="secondary" className="bg-gray-700 text-white">
                  {event.platform || 'Zoom'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="text-white hover:bg-gray-700"
                >
                  <Users className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                  className="text-white hover:bg-gray-700"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-white hover:bg-gray-700"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-gray-700"
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1 bg-gray-800 p-4">
              <div className="grid grid-cols-2 gap-4 h-full">
                {participants.map((participant) => (
                  <div key={participant.id} className="relative bg-gray-700 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {participant.isVideoOn ? (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                          <Video className="h-12 w-12 text-gray-400" />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                          <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-300" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Participant Info */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-white text-sm font-medium">{participant.name}</span>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              participant.role === 'interviewer' 
                                ? 'bg-blue-600 text-white' 
                                : participant.role === 'candidate'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-600 text-white'
                            }`}
                          >
                            {participant.role}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!participant.isVideoOn && (
                            <VideoOff className="h-4 w-4 text-red-400" />
                          )}
                          {!participant.isAudioOn && (
                            <MicOff className="h-4 w-4 text-red-400" />
                          )}
                          {participant.isSpeaking && (
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-900 p-4">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={toggleMute}
                  className={`text-white hover:bg-gray-700 ${
                    isMuted ? 'bg-red-600 hover:bg-red-700' : ''
                  }`}
                >
                  {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={toggleAudio}
                  className={`text-white hover:bg-gray-700 ${
                    !isAudioOn ? 'bg-red-600 hover:bg-red-700' : ''
                  }`}
                >
                  {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={toggleVideo}
                  className={`text-white hover:bg-gray-700 ${
                    !isVideoOn ? 'bg-red-600 hover:bg-red-700' : ''
                  }`}
                >
                  {isVideoOn ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={toggleScreenShare}
                  className={`text-white hover:bg-gray-700 ${
                    isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : ''
                  }`}
                >
                  {isScreenSharing ? <ScreenShareOff className="h-6 w-6" /> : <ScreenShare className="h-6 w-6" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={toggleRecording}
                  className={`text-white hover:bg-gray-700 ${
                    isRecording ? 'bg-red-600 hover:bg-red-700' : ''
                  }`}
                >
                  {isRecording ? <StopCircle className="h-6 w-6" /> : <StopCircle className="h-6 w-6" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:bg-gray-700"
                >
                  <Settings className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onClose}
                  className="text-white hover:bg-red-600 bg-red-500"
                >
                  <PhoneOff className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {(showChat || showParticipants) && (
            <div className="w-80 bg-white border-l flex flex-col">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  className={`flex-1 p-3 text-sm font-medium ${
                    showParticipants ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                  }`}
                  onClick={() => {
                    setShowParticipants(true)
                    setShowChat(false)
                  }}
                >
                  Participants ({participants.length})
                </button>
                <button
                  className={`flex-1 p-3 text-sm font-medium ${
                    showChat ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                  }`}
                  onClick={() => {
                    setShowChat(true)
                    setShowParticipants(false)
                  }}
                >
                  Chat
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                {showParticipants && (
                  <div className="p-4 space-y-3">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{participant.name}</span>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                participant.role === 'interviewer' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : participant.role === 'candidate'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {participant.role}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            {participant.isVideoOn ? (
                              <Video className="h-3 w-3" />
                            ) : (
                              <VideoOff className="h-3 w-3" />
                            )}
                            {participant.isAudioOn ? (
                              <Mic className="h-3 w-3" />
                            ) : (
                              <MicOff className="h-3 w-3" />
                            )}
                            {participant.isSpeaking && (
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {showChat && (
                  <div className="flex flex-col h-full">
                    {/* Chat Messages */}
                    <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                      {chatMessages.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm">
                          No messages yet
                        </div>
                      ) : (
                        chatMessages.map((message) => (
                          <div key={message.id} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                              message.sender === 'You' 
                                ? 'bg-blue-500 text-white' 
                                : message.type === 'system'
                                ? 'bg-gray-100 text-gray-600 text-center'
                                : 'bg-gray-200 text-gray-900'
                            }`}>
                              {message.type !== 'system' && (
                                <div className="text-xs font-medium mb-1">{message.sender}</div>
                              )}
                              <div>{message.message}</div>
                              <div className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Input
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          className="flex-1"
                        />
                        <Button onClick={sendChatMessage} size="sm">
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}



