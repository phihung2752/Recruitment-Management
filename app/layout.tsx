import { Inter } from 'next/font/google'
import Sidebar from "@/components/sidebar"
import { Header } from "@/components/header"
import { LanguageProvider } from "@/components/language-context"
import { ThemeProvider } from "@/components/theme-context"
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
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
              </div>
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

