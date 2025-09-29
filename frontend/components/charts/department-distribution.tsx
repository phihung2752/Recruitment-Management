"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

const data = [
  { name: "Engineering", value: 45, color: "#3B82F6" },
  { name: "Marketing", value: 20, color: "#10B981" },
  { name: "Sales", value: 15, color: "#F59E0B" },
  { name: "HR", value: 8, color: "#EF4444" },
  { name: "Finance", value: 7, color: "#8B5CF6" },
  { name: "Operations", value: 5, color: "#06B6D4" },
]

export default function DepartmentDistribution() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
