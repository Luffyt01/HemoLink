"use client"
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { RequestActions } from "./RequestActions"

interface Request {
  id: string
  bloodType: string
  unitsRequired: number
  urgency: string
  createdAt: string
  expiryTime: string
  status: "PENDING" | "FULFILLED" | "EXPIRED"
}

interface RequestTablesProps {
  activeRequests: Request[]
  completedRequests: Request[]

}

export function RequestTables({ 
  activeRequests, 
  completedRequests,
  
}: RequestTablesProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')

  const formatBloodType = (type: string) => {
    const map: Record<string, string> = {
      "A_POSITIVE": "A+",
      "A_NEGATIVE": "A-",
      "B_POSITIVE": "B+",
      "B_NEGATIVE": "B-",
      "AB_POSITIVE": "AB+",
      "AB_NEGATIVE": "AB-",
      "O_POSITIVE": "O+",
      "O_NEGATIVE": "O-"
    }
    return map[type] || type
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "HIGH": return "bg-red-100 text-red-800"
      case "MEDIUM": return "bg-yellow-100 text-yellow-800"
      case "LOW": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="h-4 w-4 mr-1.5" />
      case "FULFILLED": return <CheckCircle className="h-4 w-4 mr-1.5" />
      case "EXPIRED": return <AlertTriangle className="h-4 w-4 mr-1.5" />
      default: return <Clock className="h-4 w-4 mr-1.5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      {/* Toggle Buttons */}
      <div className="flex border-b border-gray-200 w-full">
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 text-sm sm:text-base ${activeTab === 'active' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-600'}`}
          onClick={() => setActiveTab('active')}
        >
          <span className="whitespace-nowrap">Active</span>
          <Badge variant="secondary" className="ml-1 sm:ml-2">
            {activeRequests.length}
          </Badge>
        </Button>
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 text-sm sm:text-base ${activeTab === 'completed' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-600'}`}
          onClick={() => setActiveTab('completed')}
        >
          <span className="whitespace-nowrap">Completed</span>
          <Badge variant="secondary" className="ml-1 sm:ml-2">
            {completedRequests.length}
          </Badge>
        </Button>
      </div>

      {/* Active Requests Table */}
      {activeTab === 'active' && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="">
              <TableRow>
                <TableHead>Blood Type</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeRequests.length > 0 ? (
                activeRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        {formatBloodType(request.bloodType)}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.unitsRequired}</TableCell>
                    <TableCell>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                    <TableCell>{formatDate(request.expiryTime)}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">
                        <Clock className="h-4 w-4 mr-1" />
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <RequestActions 
                        request={request}
                       
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No active requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Completed Requests Table */}
      {activeTab === 'completed' && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Blood Type</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead>Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedRequests.length > 0 ? (
                completedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        {formatBloodType(request.bloodType)}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.unitsRequired}</TableCell>
                    <TableCell>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                    <TableCell>{formatDate(request.expiryTime)}</TableCell>
                    <TableCell>
                      <Badge className={request.status === 'FULFILLED' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}>
                        {request.status === 'FULFILLED' ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 mr-1" />
                        )}
                        {request.status}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>
                      <RequestActions 
                        request={request}
                     
                      />
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No completed requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}