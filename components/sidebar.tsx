"use client"

import { useState, useEffect } from "react"
import { BarChart, Calendar, FileText, LayoutDashboard, MessageSquare, Settings, Users, UserPlus, Layers, UserCog, MessageCircle, FileSignature, CalendarCheck2, Menu, FileSearch, X } from 'lucide-react'
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Job Postings", href: "/job-postings", icon: FileText },
  { name: "Candidates", href: "/candidates", icon: UserPlus },
  { name: "CV Management", href: "/cv-management", icon: FileSearch },
  { name: "Interviews", href: "/interviews", icon: CalendarCheck2 },
  { name: "User Management", href: "/user-management", icon: UserCog },
  { name: "Recruitment Requests", href: "/recruitment-requests", icon: FileSignature },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Layers className="h-6 w-6" />
        <span className="font-semibold">{t('HR System')}</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              "dark:text-gray-300 dark:hover:bg-gray-800"
            )}
            onClick={() => setIsOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            {t(item.name)}
          </Link>
        ))}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-3 left-3 z-40"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          {SidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-background">
          {SidebarContent}
        </div>
      </div>
    </>
  )
}
