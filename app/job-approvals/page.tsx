'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import ProtectedRoute from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Eye, Check, X, Calendar, MapPin, Briefcase, Users, Clock } from 'lucide-react'

interface JobPosting {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  workType: string
  employmentType: string
  experienceLevel: string
  status: string
  publishedAt: string | null
  applicationDeadline: string | null
  numberOfPositions: number
  createdAt: string
  updatedAt: string
  createdBy: string
}

export default function JobApprovalsPage() {
  const { user, isAuthenticated } = useAuth()
  const [pendingJobs, setPendingJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewComment, setReviewComment] = useState('')
  const [approving, setApproving] = useState(false)

  // Fetch pending job postings
  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch('/api/job-postings?status=Draft', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setPendingJobs(data.jobPostings || [])
        } else {
          console.error('Failed to fetch pending jobs')
        }
      } catch (error) {
        console.error('Error fetching pending jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingJobs()
  }, [])

  // Handle approve job
  const handleApprove = async (jobId: string) => {
    try {
      setApproving(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/job-postings/${jobId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'Active',
          publishedAt: new Date().toISOString(),
          reviewComment: reviewComment
        })
      })

      if (response.ok) {
        // Remove from pending list
        setPendingJobs(prev => prev.filter(job => job.id !== jobId))
        setShowReviewDialog(false)
        setReviewComment('')
        alert('Job posting approved and published successfully!')
      } else {
        alert('Failed to approve job posting. Please try again.')
      }
    } catch (error) {
      console.error('Error approving job:', error)
      alert('Failed to approve job posting. Please try again.')
    } finally {
      setApproving(false)
    }
  }

  // Handle reject job
  const handleReject = async (jobId: string) => {
    try {
      setApproving(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/job-postings/${jobId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'Rejected',
          reviewComment: reviewComment
        })
      })

      if (response.ok) {
        // Remove from pending list
        setPendingJobs(prev => prev.filter(job => job.id !== jobId))
        setShowReviewDialog(false)
        setReviewComment('')
        alert('Job posting rejected successfully!')
      } else {
        alert('Failed to reject job posting. Please try again.')
      }
    } catch (error) {
      console.error('Error rejecting job:', error)
      alert('Failed to reject job posting. Please try again.')
    } finally {
      setApproving(false)
    }
  }

  if (!isAuthenticated) {
    return <div>Please log in to view job approvals.</div>
  }

  return (
    <ProtectedRoute requiredPermissions={['job.approve']}>
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-hr-text-primary">Job Approvals</h2>
            <p className="text-hr-text-secondary">Review and approve pending job postings.</p>
          </div>
          <Badge variant="outline" className="text-hr-text-secondary">
            {pendingJobs.length} Pending
          </Badge>
        </div>

        {/* Pending Jobs List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-8 text-hr-text-secondary">Loading...</div>
          ) : pendingJobs.length === 0 ? (
            <div className="text-center py-8 text-hr-text-secondary">No pending job postings.</div>
          ) : (
            pendingJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-all bg-hr-bg-secondary border-hr-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-hr-text-primary">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-hr-text-secondary">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.workType}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.numberOfPositions} position{job.numberOfPositions > 1 ? 's' : ''}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedJob(job)
                          setShowReviewDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-hr-text-secondary text-sm line-clamp-2">
                    {job.description}
                  </p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {job.experienceLevel} Level
                    </Badge>
                    <Badge variant="secondary" className="text-xs ml-2">
                      {job.employmentType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Review Dialog */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-hr-bg-primary rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-hr-text-primary mb-4">Review Job Posting</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-hr-text-primary">{selectedJob.title}</h4>
                  <p className="text-sm text-hr-text-secondary">{selectedJob.location} • {selectedJob.workType}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-hr-text-primary">Description</h5>
                  <p className="text-sm text-hr-text-secondary">{selectedJob.description}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-hr-text-primary">Requirements</h5>
                  <p className="text-sm text-hr-text-secondary">{selectedJob.requirements}</p>
                </div>
                
                <div>
                  <Label htmlFor="reviewComment">Review Comment</Label>
                  <Textarea
                    id="reviewComment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Add your review comments..."
                    rows={3}
                    className="bg-hr-bg-secondary border-hr-border text-hr-text-primary"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewDialog(false)
                    setSelectedJob(null)
                    setReviewComment('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedJob.id)}
                  disabled={approving}
                >
                  <X className="h-4 w-4 mr-1" />
                  {approving ? 'Rejecting...' : 'Reject'}
                </Button>
                <Button
                  onClick={() => handleApprove(selectedJob.id)}
                  disabled={approving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {approving ? 'Approving...' : 'Approve & Publish'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
