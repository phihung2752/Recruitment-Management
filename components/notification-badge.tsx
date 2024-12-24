"use client"

import { useState, useEffect } from "react"
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-context"

export function NotificationBadge() {
  const [notificationCount, setNotificationCount] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    // Simulate receiving new notifications
    const interval = setInterval(() => {
      setNotificationCount(prev => prev + 1)
    }, 30000) // Add a new notification every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {notificationCount}
            </span>
          )}
          <span className="sr-only">{t('notifications')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">{t('notifications')}</h4>
            <ul className="space-y-2">
              <li>New leave request from John Doe</li>
              <li>Meeting scheduled for 2 PM</li>
              <li>New job application received</li>
            </ul>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

