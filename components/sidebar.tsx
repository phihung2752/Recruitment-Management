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
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight
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
  const [searchTerm, setSearchTerm] = useState('')
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})
  
  // Debug logs
  console.log('Sidebar - User:', user)
  console.log('Sidebar - IsAuthenticated:', isAuthenticated)

  const menuItems = [
    // Main Dashboard
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      permission: "dashboard.view",
      group: "main"
    },
    
    // Recruitment & Hiring
    {
      title: "Job Postings",
      href: "/job-postings",
      icon: Briefcase,
      permission: "job.read",
      group: "recruitment"
    },
    {
      title: "Candidates",
      href: "/candidates",
      icon: UserCheck,
      permission: "candidate.read",
      group: "recruitment"
    },
    {
      title: "CV Management",
      href: "/cv-management",
      icon: FileText,
      permission: "candidate.read",
      group: "recruitment"
    },
    {
      title: "Interviews",
      href: "/interviews",
      icon: Calendar,
      permission: "interview.read",
      group: "recruitment"
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: CalendarIcon,
      permission: "interview.read",
      group: "recruitment"
    },
    
    // Employee Management
    {
      title: "Employees",
      href: "/employees",
      icon: Users,
      permission: "employee.read",
      group: "employees"
    },
    
    // Analytics & Reports
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      permission: "analytics.view",
      group: "analytics"
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
      permission: "report.read",
      group: "analytics"
    },
    
    // Communication
    {
      title: "Chat",
      href: "/chat",
      icon: MessageCircle,
      permission: null,
      group: "communication"
    },
    {
      title: "Messages",
      href: "/messages",
      icon: Mail,
      permission: null,
      group: "communication"
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
      permission: null,
      group: "communication"
    },
    
    // Administration
    {
      title: "User Management",
      href: "/user-management",
      icon: UserCog,
      permission: "user.read",
      group: "admin"
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      permission: "system.settings",
      group: "admin"
    },
    
    // Support
    {
      title: "Help & Support",
      href: "/help",
      icon: HelpCircle,
      permission: null,
      group: "support"
    }
  ]

  // Group menu items
  const groupedMenuItems = {
    main: menuItems.filter(item => item.group === "main"),
    recruitment: menuItems.filter(item => item.group === "recruitment"),
    employees: menuItems.filter(item => item.group === "employees"),
    analytics: menuItems.filter(item => item.group === "analytics"),
    communication: menuItems.filter(item => item.group === "communication"),
    admin: menuItems.filter(item => item.group === "admin"),
    support: menuItems.filter(item => item.group === "support")
  }

  // Toggle group collapse
  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  // Filter menu items based on search
  const filteredGroupedItems = Object.entries(groupedMenuItems).reduce((acc, [groupName, items]) => {
    const filteredItems = items.filter(item => 
      (!item.permission || hasPermission(item.permission)) &&
      (searchTerm === '' || item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    
    if (filteredItems.length > 0) {
      (acc as any)[groupName] = filteredItems
    }
    
    return acc
  }, {} as typeof groupedMenuItems)

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

      {/* Search */}
      <div className="px-4 py-2 border-b border-hr-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hr-text-muted h-4 w-4" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-hr-bg-primary border border-hr-border rounded-lg focus:outline-none focus:ring-2 focus:ring-hr-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {/* Main Dashboard */}
        {filteredGroupedItems.main?.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all",
                isActive
                  ? "bg-hr-primary text-white"
                  : "text-hr-text-secondary hover:bg-hr-bg-primary hover:text-hr-text-primary hover:shadow-md"
              )}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          )
        })}

        {/* Recruitment & Hiring */}
        {filteredGroupedItems.recruitment && filteredGroupedItems.recruitment.length > 0 && (
          <div>
            <button
              onClick={() => toggleGroup('recruitment')}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-hr-text-muted uppercase tracking-wider hover:text-hr-text-primary transition-colors"
            >
              <span>Recruitment</span>
              {collapsedGroups.recruitment ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {!collapsedGroups.recruitment && (
              <div className="space-y-1">
                {filteredGroupedItems.recruitment.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={isMobile ? onClose : undefined}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all",
                        isActive
                          ? "bg-hr-primary text-white"
                          : "text-hr-text-secondary hover:bg-hr-bg-primary hover:text-hr-text-primary hover:shadow-md"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Employee Management */}
        {filteredGroupedItems.employees && filteredGroupedItems.employees.length > 0 && (
          <div>
            <button
              onClick={() => toggleGroup('employees')}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-hr-text-muted uppercase tracking-wider hover:text-hr-text-primary transition-colors"
            >
              <span>Employee Management</span>
              {collapsedGroups.employees ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {!collapsedGroups.employees && (
              <div className="space-y-1">
                {filteredGroupedItems.employees.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={isMobile ? onClose : undefined}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all",
                        isActive
                          ? "bg-hr-primary text-white"
                          : "text-hr-text-secondary hover:bg-hr-bg-primary hover:text-hr-text-primary hover:shadow-md"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Analytics & Reports */}
        {filteredGroupedItems.analytics && filteredGroupedItems.analytics.length > 0 && (
          <div>
            <button
              onClick={() => toggleGroup('analytics')}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-hr-text-muted uppercase tracking-wider hover:text-hr-text-primary transition-colors"
            >
              <span>Analytics & Reports</span>
              {collapsedGroups.analytics ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {!collapsedGroups.analytics && (
              <div className="space-y-1">
                {filteredGroupedItems.analytics.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={isMobile ? onClose : undefined}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all",
                        isActive
                          ? "bg-hr-primary text-white"
                          : "text-hr-text-secondary hover:bg-hr-bg-primary hover:text-hr-text-primary hover:shadow-md"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Communication */}
        {filteredGroupedItems.communication && filteredGroupedItems.communication.length > 0 && (
          <div>
            <button
              onClick={() => toggleGroup('communication')}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-hr-text-muted uppercase tracking-wider hover:text-hr-text-primary transition-colors"
            >
              <span>Communication</span>
              {collapsedGroups.communication ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {!collapsedGroups.communication && (
              <div className="space-y-1">
                {filteredGroupedItems.communication.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={isMobile ? onClose : undefined}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all",
                        isActive
                          ? "bg-hr-primary text-white"
                          : "text-hr-text-secondary hover:bg-hr-bg-primary hover:text-hr-text-primary hover:shadow-md"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Administration */}
        {filteredGroupedItems.admin && filteredGroupedItems.admin.length > 0 && (
          <div>
            <button
              onClick={() => toggleGroup('admin')}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-hr-text-muted uppercase tracking-wider hover:text-hr-text-primary transition-colors"
            >
              <span>Administration</span>
              {collapsedGroups.admin ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {!collapsedGroups.admin && (
              <div className="space-y-1">
                {filteredGroupedItems.admin.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
          <Link
                      key={item.href}
            href={item.href}
                      onClick={isMobile ? onClose : undefined}
            className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all",
                        isActive
                          ? "bg-hr-primary text-white"
                          : "text-hr-text-secondary hover:bg-hr-bg-primary hover:text-hr-text-primary hover:shadow-md"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Support */}
        {filteredGroupedItems.support && filteredGroupedItems.support.length > 0 && (
          <div>
            <button
              onClick={() => toggleGroup('support')}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-hr-text-muted uppercase tracking-wider hover:text-hr-text-primary transition-colors"
            >
              <span>Support</span>
              {collapsedGroups.support ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {!collapsedGroups.support && (
              <div className="space-y-1">
                {filteredGroupedItems.support.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={isMobile ? onClose : undefined}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all",
                        isActive
                          ? "bg-hr-primary text-white"
                          : "text-hr-text-secondary hover:bg-hr-bg-primary hover:text-hr-text-primary hover:shadow-md"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
          </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}
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