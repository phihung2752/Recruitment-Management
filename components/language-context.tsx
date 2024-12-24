"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
]

const translations = {
  en: {
    "search": "Search...",
    "notifications": "Notifications",
    "profile": "Profile",
    "settings": "Settings",
    "logout": "Logout",
    // Add more translations as needed
  },
  ar: {
    "search": "بحث...",
    "notifications": "إشعارات",
    "profile": "الملف الشخصي",
    "settings": "الإعدادات",
    "logout": "تسجيل الخروج",
    // Add more translations as needed
  },
  fr: {
    "search": "Rechercher...",
    "notifications": "Notifications",
    "profile": "Profil",
    "settings": "Paramètres",
    "logout": "Déconnexion",
    // Add more translations as needed
  },
  es: {
    "search": "Buscar...",
    "notifications": "Notificaciones",
    "profile": "Perfil",
    "settings": "Configuración",
    "logout": "Cerrar sesión",
    // Add more translations as needed
  },
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string) => {
    return translations[language as keyof typeof translations]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

