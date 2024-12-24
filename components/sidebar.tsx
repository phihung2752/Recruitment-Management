"use client"

import { BarChart, Calendar, FileText, LayoutDashboard, MessageSquare, Settings, Users, UserPlus, Layers, UserCog, MessageCircle, FileSignature, CalendarCheck2 } from 'lucide-react'
import Link from "next/link"
import { useLanguage } from "@/components/language-context"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Job Postings", href: "/job-postings", icon: FileText },
  { name: "Candidates", href: "/candidates", icon: UserPlus },
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

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 h-screen">
      <div className="flex h-16 items-center gap-2 border-b dark:border-gray-700 px-6">
        <Layers className="h-6 w-6" />
        <span className="font-semibold">{t('HR System')}</span>
      </div>
      <nav className="space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <item.icon className="h-5 w-5" />
            {t(item.name)}
          </Link>
        ))}
      </nav>
    </div>
  )
}

