"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard,
  Users,
  Briefcase,
  UserCheck,
  FileText,
  Calendar,
  UserCog,
  ClipboardList,
  MessageCircle,
  Calendar as CalendarIcon,
  Mail,
  BarChart3,
  Palette,
  Settings,
  X,
  Bell,
  HelpCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
}

export default function Sidebar({ isOpen = false, onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname()
  const { hasPermission, user, isAuthenticated } = useAuth()
  
  // Debug logs
  console.log('Sidebar - User:', user)
  console.log('Sidebar - IsAuthenticated:', isAuthenticated)

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      permission: "dashboard.view"
    },
    {
      title: "Candidates",
      href: "/candidates",
      icon: UserCheck,
      permission: "candidate.read"
    },
    {
      title: "Interviews",
      href: "/interviews",
      icon: Calendar,
      permission: "interview.read"
    },
    {
      title: "CV Management",
      href: "/cv-management",
      icon: FileText,
      permission: "candidate.read"
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: CalendarIcon,
      permission: "interview.read"
    },
    {
      title: "Job Postings",
      href: "/job-postings",
      icon: Briefcase,
      permission: "job.read"
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
      permission: "report.read"
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      permission: "system.settings"
    },
    {
      title: "Employees",
      href: "/employees",
      icon: Users,
      permission: "employee.read"
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      permission: "analytics.view"
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
      permission: null
    },
    {
      title: "Help & Support",
      href: "/help",
      icon: HelpCircle,
      permission: null
    },
    {
      title: "User Management",
      href: "/user-management",
      icon: UserCog,
      permission: "user.read"
    },
    {
      title: "Chat",
      href: "/chat",
      icon: MessageCircle,
      permission: null
    },
    {
      title: "Messages",
      href: "/messages",
      icon: Mail,
      permission: null
    }
  ]

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-hr-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-hr-primary rounded-lg flex items-center justify-center">
            <UserCog className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-hr-text-primary">
            HR System
          </span>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-hr-primary text-white"
                  : "text-hr-text-secondary hover:bg-hr-bg-primary hover:text-hr-text-primary"
              )}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-hr-border">
        <div className="text-xs text-hr-text-secondary text-center">
          HR Management System v1.0
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex flex-col flex-grow bg-hr-bg-secondary border-r border-hr-border">
        <SidebarContent />
      </div>
    </div>
  )
}