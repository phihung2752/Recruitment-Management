"use client"

import { Card, CardContent } from "@/components/ui/card"
import { InteractiveAttendanceChart } from "@/components/interactive-attendance-chart"
import { useLanguage } from "@/contexts/language-context"

const todaysMeetings = [
  { name: "Mariam Osama", date: "12/12/2022", duration: "2 Hours" },
  { name: "Ahmed Hassan", date: "12/12/2022", duration: "1 Hour" },
  { name: "Sara Ali", date: "12/12/2022", duration: "30 Minutes" },
]

const todaysRequests = [
  { id: "01", name: "Mariam Osama", jobTitle: "UI/UX Designer", details: "Holiday" },
  { id: "02", name: "Ahmed Hassan", jobTitle: "Software Engineer", details: "Leave Early" },
  { id: "03", name: "Sara Ali", jobTitle: "Product Manager", details: "Work from Home" },
]

export default function DashboardPage() {
  const { t } = useLanguage()

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('Dashboard')}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">{t('Total Employees')}</div>
            <div className="text-2xl font-bold">100</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">{t('Total Attendance')}</div>
            <div className="text-2xl font-bold">30</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">{t('Total Vacations')}</div>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InteractiveAttendanceChart />

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">{t("Today's Meetings")}</h3>
              <div className="space-y-4">
                {todaysMeetings.map((meeting, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{meeting.name}</div>
                      <div className="text-sm text-muted-foreground">{meeting.date}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{meeting.duration}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">{t("Today's Requests")}</h3>
              <div className="space-y-4">
                {todaysRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{request.name}</div>
                      <div className="text-sm text-muted-foreground">{request.jobTitle}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-md bg-green-100 dark:bg-green-900 px-3 py-1 text-sm text-green-600 dark:text-green-400">
                        {t('Accept')}
                      </button>
                      <button className="rounded-md bg-red-100 dark:bg-red-900 px-3 py-1 text-sm text-red-600 dark:text-red-400">
                        {t('Reject')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

