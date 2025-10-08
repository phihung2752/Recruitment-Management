"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Users } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Room {
  id: string
  name: string
  capacity: number
  equipment: string[]
  status: "available" | "occupied" | "maintenance"
  currentBooking?: {
    startTime: Date
    endTime: Date
    interviewer: string
    candidate: string
  }
}

export function InterviewRoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "Interview Room A",
      capacity: 4,
      equipment: ["Whiteboard", "Projector", "Video Conference"],
      status: "available"
    },
    {
      id: "2",
      name: "Conference Room B",
      capacity: 8,
      equipment: ["Whiteboard", "Projector", "Video Conference", "Recording Equipment"],
      status: "occupied",
      currentBooking: {
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        interviewer: "John Doe",
        candidate: "Jane Smith"
      }
    }
  ])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: 0,
    equipment: [] as string[]
  })

  const handleAddRoom = () => {
    if (newRoom.name && newRoom.capacity > 0) {
      setRooms([...rooms, {
        id: (rooms.length + 1).toString(),
        name: newRoom.name,
        capacity: newRoom.capacity,
        equipment: newRoom.equipment,
        status: "available"
      }])
      setNewRoom({ name: "", capacity: 0, equipment: [] })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <Card key={room.id} className={cn(
            "transition-colors",
            room.status === "available" && "border-green-500",
            room.status === "occupied" && "border-yellow-500",
            room.status === "maintenance" && "border-red-500"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{room.name}</CardTitle>
              <Badge 
                variant={
                  room.status === "available" ? "default" :
                  room.status === "occupied" ? "secondary" :
                  "destructive"
                }
              >
                {room.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4" />
                  Capacity: {room.capacity}
                </div>
                <div className="flex flex-wrap gap-2">
                  {room.equipment.map(item => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
                {room.currentBooking && (
                  <div className="mt-4 space-y-2 border-t pt-2">
                    <p className="text-sm font-medium">Current Booking</p>
                    <div className="text-sm">
                      <p>Interviewer: {room.currentBooking.interviewer}</p>
                      <p>Candidate: {room.currentBooking.candidate}</p>
                      <p>Time: {format(room.currentBooking.startTime, "HH:mm")} - {format(room.currentBooking.endTime, "HH:mm")}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Add New Room</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={newRoom.capacity || ""}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
              />
            </div>
            <Button onClick={handleAddRoom} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-[2]">
              {/* Room schedule grid would go here */}
              <div className="h-[400px] border rounded-lg p-4">
                <div className="text-center text-muted-foreground">
                  Select a date to view room schedule
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
