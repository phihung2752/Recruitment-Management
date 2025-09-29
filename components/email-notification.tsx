"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { Label } from "@/components/ui/label"

type EmailNotificationProps = {
  to: string
  subject: string
  onSend: (to: string, subject: string, body: string) => void
}

export function EmailNotification({ to, subject, onSend }: EmailNotificationProps) {
  const [emailBody, setEmailBody] = useState("")
  const { t } = useLanguage()

  const handleSend = async () => {
    try {
      // Import communication service
      const { communicationService } = await import("@/src/api/services/communication")

      const response = await communicationService.sendEmail({
        to,
        subject,
        body: emailBody,
      })

      if (response.success) {
        onSend(to, subject, emailBody)
        setEmailBody("")
        // Show success toast
        const { toast } = await import("@/components/ui/use-toast")
        toast({
          title: "Email Sent",
          description: "Email has been sent successfully",
        })
      } else {
        // Show error toast
        const { toast } = await import("@/components/ui/use-toast")
        toast({
          title: "Error",
          description: response.error || "Failed to send email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to send email:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="to">{t("To")}</Label>
        <Input id="to" value={to} readOnly />
      </div>
      <div>
        <Label htmlFor="subject">{t("Subject")}</Label>
        <Input id="subject" value={subject} readOnly />
      </div>
      <div>
        <Label htmlFor="body">{t("Email Body")}</Label>
        <Textarea
          id="body"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          placeholder={t("Enter email content")}
          rows={5}
        />
      </div>
      <Button onClick={handleSend}>{t("Send Email")}</Button>
    </div>
  )
}
