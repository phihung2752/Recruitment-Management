import type React from "react"

export default function SQLServerMainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <title>HR Management System - SQL Server</title>
        <meta name="description" content="Hệ thống quản lý nhân sự với SQL Server" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}