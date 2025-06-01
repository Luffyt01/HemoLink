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
import { Clock, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
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
  itemsPerPage?: number
}

export function RequestTables({ 
  activeRequests,
  
}: RequestTablesProps) {
 const itemsPerPage = 7 // Default items per page
  const [currentPage, setCurrentPage] = useState(1)
  
  // Calculate total pages
  const totalPages = Math.ceil(activeRequests.length / itemsPerPage)
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = activeRequests.slice(indexOfFirstItem, indexOfLastItem)

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": 
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-4 w-4 mr-1" />
            Pending
          </Badge>
        )
      case "FULFILLED": 
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Fulfilled
          </Badge>
        )
      case "EXPIRED": 
        return (
          <Badge className="bg-amber-100 text-amber-800">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Expired
          </Badge>
        )
      default: 
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Clock className="h-4 w-4 mr-1" />
            Unknown
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead className="w-[120px]">Blood Type</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((request) => (
                <TableRow key={request.id} className="">
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {formatBloodType(request.bloodType)}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.unitsRequired}</TableCell>
                  <TableCell>
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency.charAt(0) + request.urgency.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(request.createdAt)}</TableCell>
                  <TableCell>{formatDate(request.expiryTime)}</TableCell>
                  <TableCell>
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <RequestActions request={request} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {activeRequests.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-2">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, activeRequests.length)}</strong> of <strong>{activeRequests.length}</strong> requests
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="flex items-center justify-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}