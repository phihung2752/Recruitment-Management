"use client"

import { useState } from "react"
import { Search, Bell, Globe, Sun, Moon, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage, languages } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { NotificationBadge } from "@/components/notification-badge"
import { useSidebar } from "@/components/ui/sidebar"

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { toggleSidebar } = useSidebar()

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('search')}
              className="w-full bg-background pl-8 md:w-2/3 lg:w-1/2"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <NotificationBadge />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User avatar" />
                  <AvatarFallback>IM</AvatarFallback>
                </Avatar>
                <span>Islam Mohamed</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t('profile')}</DropdownMenuItem>
              <DropdownMenuItem>{t('settings')}</DropdownMenuItem>
              <DropdownMenuItem>{t('logout')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

