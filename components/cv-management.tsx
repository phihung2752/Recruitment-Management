"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ManualCVEntry } from "./manual-cv-entry"
import { CVParser } from "./cv-parser"
import { CVMatcher } from "./cv-matcher"
import { CVAggregator } from "./cv-aggregator"
import { Card } from "@/components/ui/card"

export function CVManagement() {
  const [activeTab, setActiveTab] = useState("manual")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="parser">CV Parser</TabsTrigger>
          <TabsTrigger value="matcher">CV Matcher</TabsTrigger>
          <TabsTrigger value="aggregator">Job Board Integration</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="manual">
            <ManualCVEntry />
          </TabsContent>

          <TabsContent value="parser">
            <CVParser />
          </TabsContent>

          <TabsContent value="matcher">
            <CVMatcher />
          </TabsContent>

          <TabsContent value="aggregator">
            <CVAggregator />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

