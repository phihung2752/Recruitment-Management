'use client'

import { useState, useEffect } from 'react'

interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  currentPosition: string
  skills: string
  status: string
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/candidates')
      if (!response.ok) {
        throw new Error('Failed to fetch candidates')
      }
      const data = await response.json()
      setCandidates(data.candidates || [])
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Candidates Management</h1>
      <p className="text-gray-600 mb-6">Manage and track candidate applications</p>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {candidate.firstName} {candidate.lastName}
                  </h3>
                  <p className="text-gray-600">{candidate.currentPosition}</p>
                  <p className="text-gray-500">{candidate.email}</p>
                  <p className="text-gray-500">{candidate.phone}</p>
                  <p className="text-sm text-gray-400 mt-2">{candidate.skills}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  candidate.status === 'Hired' ? 'bg-green-100 text-green-800' :
                  candidate.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                  candidate.status === 'Interviewed' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {candidate.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}