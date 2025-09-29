"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Camera, Save, Edit, MapPin, Phone, Mail, Calendar, Building, User } from "lucide-react"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Nguyễn Văn Admin",
    email: "admin@company.com",
    phone: "+84 123 456 789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    department: "Nhân sự",
    position: "Quản lý HR",
    employeeId: "HR001",
    hireDate: "2020-01-15",
    manager: "Trần Văn CEO",
    bio: "Quản lý nhân sự với 5 năm kinh nghiệm trong lĩnh vực tuyển dụng và phát triển nhân tài.",
    skills: ["Tuyển dụng", "Quản lý nhân sự", "Đào tạo", "Đánh giá hiệu suất"],
    avatar: "/placeholder.svg?height=100&width=100&text=Admin",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSaveProfile = () => {
    // Gọi API để cập nhật profile
    toast({
      title: t("Profile Updated"),
      description: t("Your profile has been updated successfully."),
    })
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: t("Error"),
        description: t("New passwords do not match."),
        variant: "destructive",
      })
      return
    }

    // Gọi API để đổi mật khẩu
    toast({
      title: t("Password Changed"),
      description: t("Your password has been changed successfully."),
    })
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          avatar: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("Profile")}</h1>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
          <Edit className="mr-2 h-4 w-4" />
          {isEditing ? t("Cancel") : t("Edit Profile")}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">{t("Personal Info")}</TabsTrigger>
          <TabsTrigger value="work">{t("Work Info")}</TabsTrigger>
          <TabsTrigger value="security">{t("Security")}</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                {t("Personal Information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 cursor-pointer">
                      <div className="rounded-full bg-primary p-2 text-primary-foreground">
                        <Camera className="h-4 w-4" />
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{profileData.name}</h3>
                  <p className="text-muted-foreground">{profileData.position}</p>
                  <Badge variant="secondary">{profileData.employeeId}</Badge>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t("Full Name")}</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t("Email")}</Label>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">{t("Phone")}</Label>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">{t("Address")}</Label>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">{t("Bio")}</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div>
                <Label>{t("Skills")}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {isEditing && (
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  {t("Save Changes")}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                {t("Work Information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeId">{t("Employee ID")}</Label>
                  <Input id="employeeId" value={profileData.employeeId} disabled />
                </div>
                <div>
                  <Label htmlFor="department">{t("Department")}</Label>
                  <Input id="department" value={profileData.department} disabled />
                </div>
                <div>
                  <Label htmlFor="position">{t("Position")}</Label>
                  <Input id="position" value={profileData.position} disabled />
                </div>
                <div>
                  <Label htmlFor="manager">{t("Manager")}</Label>
                  <Input id="manager" value={profileData.manager} disabled />
                </div>
                <div>
                  <Label htmlFor="hireDate">{t("Hire Date")}</Label>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input id="hireDate" value={profileData.hireDate} disabled />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Change Password")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">{t("Current Password")}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="newPassword">{t("New Password")}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">{t("Confirm New Password")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              <Button onClick={handleChangePassword}>
                <Save className="mr-2 h-4 w-4" />
                {t("Change Password")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
