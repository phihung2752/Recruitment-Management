"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Upload, User } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PersonalDetails {
  name: string
  dateOfBirth: Date | undefined
  gender: string
  nationality: string
  address: string
  email: string
  phone: string
  socialStatus: string
  religion: string
  qualifications: string
}

interface IDDetails {
  idType: "personal" | "passport"
  idNumber: string
  placeOfIssue: string
  issueDate: Date | undefined
  expiryDate: Date | undefined
}

interface OrganizationDetails {
  joinDate: Date | undefined
  jobTitle: string
  department: string
  branch: string
  shift: string
  email: string
  directManager: string
  role: string
}

export function ManualCVEntry() {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    name: "",
    dateOfBirth: undefined,
    gender: "",
    nationality: "",
    address: "",
    email: "",
    phone: "",
    socialStatus: "",
    religion: "",
    qualifications: ""
  })

  const [idDetails, setIdDetails] = useState<IDDetails>({
    idType: "personal",
    idNumber: "",
    placeOfIssue: "",
    issueDate: undefined,
    expiryDate: undefined
  })

  const [orgDetails, setOrgDetails] = useState<OrganizationDetails>({
    joinDate: undefined,
    jobTitle: "",
    department: "",
    branch: "",
    shift: "",
    email: "",
    directManager: "",
    role: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // In a real application, this would send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "CV details have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save CV details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Manual CV Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="id">ID Details</TabsTrigger>
            <TabsTrigger value="organization">Organization Details</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={personalDetails.name}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !personalDetails.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {personalDetails.dateOfBirth ? (
                        format(personalDetails.dateOfBirth, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={personalDetails.dateOfBirth}
                      onSelect={(date) => setPersonalDetails(prev => ({ ...prev, dateOfBirth: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={personalDetails.gender}
                  onValueChange={(value) => setPersonalDetails(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nationality</Label>
                <Input
                  value={personalDetails.nationality}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, nationality: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={personalDetails.address}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={personalDetails.email}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={personalDetails.phone}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Social Status</Label>
                <Select
                  value={personalDetails.socialStatus}
                  onValueChange={(value) => setPersonalDetails(prev => ({ ...prev, socialStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Religion</Label>
                <Input
                  value={personalDetails.religion}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, religion: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Qualifications</Label>
                <Input
                  value={personalDetails.qualifications}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, qualifications: e.target.value }))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="id" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ID Type</Label>
                <Select
                  value={idDetails.idType}
                  onValueChange={(value: "personal" | "passport") => setIdDetails(prev => ({ ...prev, idType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal ID</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ID Number</Label>
                <Input
                  value={idDetails.idNumber}
                  onChange={(e) => setIdDetails(prev => ({ ...prev, idNumber: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Place of Issue</Label>
                <Input
                  value={idDetails.placeOfIssue}
                  onChange={(e) => setIdDetails(prev => ({ ...prev, placeOfIssue: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !idDetails.issueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {idDetails.issueDate ? (
                        format(idDetails.issueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={idDetails.issueDate}
                      onSelect={(date) => setIdDetails(prev => ({ ...prev, issueDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !idDetails.expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {idDetails.expiryDate ? (
                        format(idDetails.expiryDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={idDetails.expiryDate}
                      onSelect={(date) => setIdDetails(prev => ({ ...prev, expiryDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="organization" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Join Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !orgDetails.joinDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {orgDetails.joinDate ? (
                        format(orgDetails.joinDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={orgDetails.joinDate}
                      onSelect={(date) => setOrgDetails(prev => ({ ...prev, joinDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={orgDetails.jobTitle}
                  onChange={(e) => setOrgDetails(prev => ({ ...prev, jobTitle: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={orgDetails.department}
                  onChange={(e) => setOrgDetails(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Branch</Label>
                <Input
                  value={orgDetails.branch}
                  onChange={(e) => setOrgDetails(prev => ({ ...prev, branch: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Shift</Label>
                <Input
                  value={orgDetails.shift}
                  onChange={(e) => setOrgDetails(prev => ({ ...prev, shift: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={orgDetails.email}
                  onChange={(e) => setOrgDetails(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Direct Manager</Label>
                <Input
                  value={orgDetails.directManager}
                  onChange={(e) => setOrgDetails(prev => ({ ...prev, directManager: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={orgDetails.role}
                  onValueChange={(value) => setOrgDetails(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save CV"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
