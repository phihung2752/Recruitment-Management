"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotificationBadge() {
  return (
    <Button variant="outline" size="sm" className="relative">
      <Bell className="h-4 w-4" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        3
      </span>
    </Button>
  )
}