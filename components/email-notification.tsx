"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/components/language-context"

type EmailNotificationProps = {
  to: string
  subject: string
  onSend: (to: string, subject: string, body: string) => void
}

export function EmailNotification({ to, subject, onSend }: EmailNotificationProps) {
  const [emailBody, setEmailBody] = useState("")
  const { t } = useLanguage()

  const handleSend = () => {
    onSend(to, subject, emailBody)
    setEmailBody("")
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

