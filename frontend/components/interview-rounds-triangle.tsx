"use client"

import { useState } from "react"

interface InterviewRound {
  id: number
  name: string
  status: "pending" | "passed" | "failed" | "current"
  interviewer: string
  interviewerAvatar?: string
  date?: string
  feedback?: string
}

interface InterviewRoundsTriangleProps {
  rounds: InterviewRound[]
}

export function InterviewRoundsTriangle({ rounds }: InterviewRoundsTriangleProps) {
  const [selectedRound, setSelectedRound] = useState<InterviewRound | null>(null)

  const getStatusIcon = (status: InterviewRound["status"]) => {
    switch (status) {
      case "passed":
        return "✅"
      case "failed":
        return "❌"
      case "current":
        return "🔄"
      case "pending":
      default:
        return "⏳"
    }
  }

  const getStatusColor = (status: InterviewRound["status"]) => {
    switch (status) {
      case "passed":
        return "bg-green-100 border-green-500 text-green-800"
      case "failed":
        return "bg-red-100 border-red-500 text-red-800"
      case "current":
        return "bg-blue-100 border-blue-500 text-blue-800"
      case "pending":
      default:
        return "bg-yellow-100 border-yellow-500 text-yellow-800"
    }
  }

  const getTrianglePosition = (index: number, total: number) => {
    if (total <= 4) {
      // Simple triangle layout for 4 or fewer rounds
      const positions = [
        { bottom: "20px", left: "50%", transform: "translateX(-50%)" }, // Round 1 (bottom center)
        { bottom: "120px", left: "30%", transform: "translateX(-50%)" }, // Round 2 (left)
        { bottom: "120px", left: "70%", transform: "translateX(-50%)" }, // Round 3 (right)
        { bottom: "220px", left: "50%", transform: "translateX(-50%)" }, // Round 4 (top)
      ]
      return positions[index] || positions[0]
    } else {
      // Pyramid layout for more than 4 rounds
      const layers = Math.ceil(total / 3)
      const layer = Math.floor(index / 3)
      const positionInLayer = index % 3

      const layerHeight = 280 / layers
      const bottom = 20 + layer * layerHeight

      let left = 50
      if (total > 4) {
        if (positionInLayer === 0) left = 25
        else if (positionInLayer === 1) left = 50
        else left = 75
      }

      return {
        bottom: `${bottom}px`,
        left: `${left}%`,
        transform: "translateX(-50%)",
      }
    }
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-4">
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span className="flex items-center gap-1">⏳ Pending</span>
          <span className="flex items-center gap-1">🔄 Current</span>
          <span className="flex items-center gap-1">✅ Passed</span>
          <span className="flex items-center gap-1">❌ Failed</span>
        </div>
      </div>

      <div className="relative h-80 bg-gradient-to-b from-blue-50 to-white rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
        {/* Triangle visualization */}
        {rounds.map((round, index) => {
          const position = getTrianglePosition(index, rounds.length)
          return (
            <div
              key={round.id}
              className={`absolute cursor-pointer transition-all duration-300 hover:scale-110 ${
                selectedRound?.id === round.id ? "scale-110 z-10" : ""
              }`}
              style={position}
              onClick={() => setSelectedRound(round)}
            >
              <div
                className={`relative w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow ${getStatusColor(
                  round.status,
                )}`}
              >
                <div className="text-lg mb-0.5">{getStatusIcon(round.status)}</div>
                <div className="text-xs font-bold text-center leading-tight">R{index + 1}</div>

                {/* Interviewer avatar */}
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                  {round.interviewerAvatar ? (
                    <img
                      src={round.interviewerAvatar || "/placeholder.svg"}
                      alt={round.interviewer}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {round.interviewer.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Round name tooltip */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                {round.name}
              </div>
            </div>
          )
        })}

        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {rounds.map((_, index) => {
            if (index === rounds.length - 1) return null

            const currentPos = getTrianglePosition(index, rounds.length)
            const nextPos = getTrianglePosition(index + 1, rounds.length)

            // Calculate line positions
            const x1 = currentPos.left === "50%" ? "50%" : currentPos.left === "30%" ? "30%" : "70%"
            const y1 = `calc(100% - ${currentPos.bottom} - 32px)`
            const x2 = nextPos.left === "50%" ? "50%" : nextPos.left === "30%" ? "30%" : "70%"
            const y2 = `calc(100% - ${nextPos.bottom} - 32px)`

            return (
              <line
                key={`line-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#d1d5db"
                strokeWidth="2"
                strokeDasharray="4,4"
                opacity="0.6"
              />
            )
          })}
        </svg>
      </div>

      {/* Selected round details */}
      {selectedRound && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-lg mb-3 text-gray-900">{selectedRound.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRound.status)}`}>
                {getStatusIcon(selectedRound.status)} {selectedRound.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600">Interviewer:</span>
              <span className="text-gray-800">{selectedRound.interviewer}</span>
            </div>
            {selectedRound.date && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Date:</span>
                <span className="text-gray-800">{selectedRound.date}</span>
              </div>
            )}
            {selectedRound.feedback && (
              <div className="md:col-span-2">
                <span className="font-medium text-gray-600">Feedback:</span>
                <p className="mt-1 text-gray-800 bg-white p-2 rounded border">{selectedRound.feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewRoundsTriangle
