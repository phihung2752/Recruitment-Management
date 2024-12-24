"use client"

import { Card } from "@/components/ui/card"

interface OrgChartNode {
  id: string
  name: string
  jobTitle: string
  children?: OrgChartNode[]
}

interface OrgChartProps {
  data: OrgChartNode
}

export default function OrgChart({ data }: OrgChartProps) {
  const renderNode = (node: OrgChartNode) => {
    return (
      <div key={node.id} className="flex flex-col items-center">
        <Card className="p-4 min-w-[200px] text-center">
          <div className="space-y-2">
            <div className="font-semibold">{node.name}</div>
            <div className="text-sm text-gray-500">{node.jobTitle}</div>
            <div className="text-xs text-gray-400">ID: {node.id}</div>
          </div>
        </Card>
        {node.children && node.children.length > 0 && (
          <div className="relative mt-4">
            <div className="absolute top-0 left-1/2 h-4 w-px bg-gray-300" />
            <div className="flex gap-8 pt-4">
              {node.children.map((child) => (
                <div key={child.id} className="relative">
                  <div className="absolute top-0 left-1/2 h-4 w-px bg-gray-300" />
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-8 overflow-auto">
      {renderNode(data)}
    </div>
  )
}

