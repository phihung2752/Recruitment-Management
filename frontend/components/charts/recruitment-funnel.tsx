"use client"

import { ResponsiveContainer, FunnelChart, Funnel, Cell, LabelList } from "recharts"

const data = [
  { name: "Applications", value: 1200, fill: "#3B82F6" },
  { name: "Screening", value: 800, fill: "#10B981" },
  { name: "First Interview", value: 400, fill: "#F59E0B" },
  { name: "Technical Test", value: 200, fill: "#EF4444" },
  { name: "Final Interview", value: 100, fill: "#8B5CF6" },
  { name: "Offers", value: 50, fill: "#06B6D4" },
  { name: "Hired", value: 35, fill: "#84CC16" },
]

export default function RecruitmentFunnel() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Funnel</h3>
      <ResponsiveContainer width="100%" height={400}>
        <FunnelChart>
          <Funnel dataKey="value" data={data} isAnimationActive labelLine={false}>
            <LabelList position="center" fill="#fff" stroke="none" />
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
            <span className="text-gray-600">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
