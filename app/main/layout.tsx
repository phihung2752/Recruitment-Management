import type React from "react"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <title>HR Management System - SQL Server</title>
        <meta name="description" content="Hệ thống quản lý nhân sự với SQL Server" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

