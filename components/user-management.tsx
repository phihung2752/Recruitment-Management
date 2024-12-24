"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

type User = {
  id: string
  name: string
  email: string
  role: string
  department: string
  permissions: string[]
}

const initialUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Department Manager", department: "Sales", permissions: ["create_request", "approve_request"] },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Recruiter", department: "HR", permissions: ["create_job_posting", "manage_candidates"] },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "HR Manager", department: "HR", permissions: ["approve_request", "manage_onboarding"] },
]

const roles = ["Department Manager", "Recruiter", "HR Manager", "Interviewer", "Employee"]
const departments = ["Sales", "HR", "Engineering", "Marketing", "Finance"]
const allPermissions = [
  { id: "create_request", label: "Create Recruitment Request" },
  { id: "approve_request", label: "Approve Recruitment Request" },
  { id: "create_job_posting", label: "Create Job Posting" },
  { id: "manage_candidates", label: "Manage Candidates" },
  { id: "schedule_interview", label: "Schedule Interview" },
  { id: "manage_onboarding", label: "Manage Onboarding" },
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', role: '', department: '', permissions: [] })

  const handleAddUser = () => {
    const user: User = { ...newUser, id: (users.length + 1).toString() }
    setUsers([...users, user])
    setNewUser({ name: '', email: '', role: '', department: '', permissions: [] })
  }

  const handlePermissionChange = (permission: string) => {
    setNewUser(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select onValueChange={(value) => setNewUser({ ...newUser, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {allPermissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={newUser.permissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionChange(permission.id)}
                  />
                  <label htmlFor={permission.id}>{permission.label}</label>
                </div>
              ))}
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddUser}>Add User</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Permissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.permissions.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

