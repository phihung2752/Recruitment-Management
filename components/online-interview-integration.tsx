import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export function OnlineInterviewIntegration() {
  const [platform, setPlatform] = useState<'zoom' | 'meet'>('zoom')
  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')

  const handleIntegration = () => {
    // In a real application, this would securely store the API credentials
    // and set up the integration with the chosen platform
    toast({
      title: "Integration Successful",
      description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} has been integrated successfully.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Online Interview Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={platform} onValueChange={(value: 'zoom' | 'meet') => setPlatform(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zoom">Zoom</SelectItem>
              <SelectItem value="meet">Google Meet</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Input
            type="password"
            placeholder="API Secret"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
          />
          <Button onClick={handleIntegration}>Integrate</Button>
        </div>
      </CardContent>
    </Card>
  )
}
