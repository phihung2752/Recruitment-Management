import { Inter } from 'next/font/google'
import Sidebar from "@/components/sidebar"
import { Header } from "@/components/header"
import { LanguageProvider } from "@/contexts/language-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import "./globals.css"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <ThemeProvider>
            <SidebarProvider>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-auto p-4">
                    {children}
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

