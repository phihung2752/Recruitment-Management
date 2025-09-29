import { BarChart, Calendar, FileText, LayoutDashboard, MessageSquare, Settings, Users, UserPlus, Layers } from 'lucide-react'
import Link from "next/link"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Job Postings", href: "/job-postings", icon: FileText },
  { name: "Candidates", href: "/candidates", icon: UserPlus },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 z-50 hidden w-64 bg-white lg:block">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Layers className="h-6 w-6" />
        <span className="font-semibold">HR System</span>
      </div>
      <nav className="space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
