"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import * as XLSX from "xlsx"
import { useToast } from "@/components/ui/use-toast"
// import { useTranslation } from "i18next"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
  status: string
  createdAt: Date
  lastLogin: Date | null
  permissions: string[]
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const { toast } = useToast()
  // const { t } = useTranslation()
  const t = (key: string) => key // Mock translation function

  useEffect(() => {
    // Replace with your actual data fetching logic
    const mockUsers: User[] = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        role: "Admin",
        department: "IT",
        status: "Active",
        createdAt: new Date(),
        lastLogin: new Date(),
        permissions: ["read", "write", "delete"],
      },
      {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        role: "User",
        department: "Marketing",
        status: "Inactive",
        createdAt: new Date(),
        lastLogin: null,
        permissions: ["read"],
      },
    ]
    setUsers(mockUsers)
  }, [])

  const handleExport = () => {
    const exportData = users.map((user) => ({
      "User ID": user.id,
      "First Name": user.firstName,
      "Last Name": user.lastName,
      Email: user.email,
      Role: user.role,
      Department: user.department,
      Status: user.status,
      "Created Date": format(user.createdAt, "yyyy-MM-dd"),
      "Last Login": user.lastLogin ? format(user.lastLogin, "yyyy-MM-dd HH:mm") : "Never",
      Permissions: user.permissions.join(", "),
    }))

    try {
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Users")

      // Create blob and download
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([wbout], { type: "application/octet-stream" })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `users-${format(new Date(), "yyyy-MM-dd")}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: t("Export Successful"),
        description: t("User data has been exported successfully."),
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: t("Export Failed"),
        description: t("Failed to export user data. Please try again."),
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h1>User Management</h1>
      <button onClick={handleExport}>Export Users</button>
      {/* Display user data in a table or list */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            {/* Add more headers as needed */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              {/* Add more data cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagement
