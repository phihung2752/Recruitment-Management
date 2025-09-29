import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CV } from "@/types/cv-management"

interface ApprovalWorkflowProps {
  cvs: CV[]
  onApprovalRequest: (cvId: string, approver: string) => void
  onApprovalDecision: (cvId: string, decision: "Approved" | "Rejected") => void
}

export function ApprovalWorkflow({ cvs, onApprovalRequest, onApprovalDecision }: ApprovalWorkflowProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cvs.map((cv) => (
              <TableRow key={cv.id}>
                <TableCell>{cv.name}</TableCell>
                <TableCell>{cv.position}</TableCell>
                <TableCell>{cv.approvalStatus || "Not Submitted"}</TableCell>
                <TableCell>{cv.approver || "-"}</TableCell>
                <TableCell>
                  {!cv.approvalStatus && (
                    <Select onValueChange={(approver) => onApprovalRequest(cv.id, approver)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Request Approval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager1">Manager 1</SelectItem>
                        <SelectItem value="manager2">Manager 2</SelectItem>
                        <SelectItem value="hr">HR Department</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  {cv.approvalStatus === "Pending" && (
                    <>
                      <Button onClick={() => onApprovalDecision(cv.id, "Approved")} className="mr-2">
                        Approve
                      </Button>
                      <Button onClick={() => onApprovalDecision(cv.id, "Rejected")} variant="destructive">
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
