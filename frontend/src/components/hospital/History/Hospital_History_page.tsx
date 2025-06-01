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
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Calendar as CalendarIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BloodRequest {
  id: string
  hospitalId: string
  hospitalName: string
  bloodType: "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE" | "O_POSITIVE" | "O_NEGATIVE"
  unitsRequired: number
  urgency: "LOW" | "MEDIUM" | "HIGH"
  location: {
    coordinates: number[]
    type: string
  }
  createdAt: string
  expiryTime: string
  status: "PENDING" | "FULFILLED" | "EXPIRED" | "CANCELLED"
}

interface ApiResponse {
  totalPages: number
  totalElements: number
  pageable: {
    unpaged: boolean
    pageNumber: number
    paged: boolean
    pageSize: number
    offset: number
    sort: {
      unsorted: boolean
      sorted: boolean
      empty: boolean
    }
  }
  numberOfElements: number
  size: number
  content: BloodRequest[]
  number: number
  sort: {
    unsorted: boolean
    sorted: boolean
    empty: boolean
  }
  first: boolean
  last: boolean
  empty: boolean
}

export function Hospital_History_page() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "",
    bloodType: "",
    urgency: "",
    expiryStart: undefined as Date | undefined,
    expiryEnd: undefined as Date | undefined
  })

  const fetchData = async (page = 0, size = 10) => {
    setLoading(true)
    setError(null)
    try {
      // Construct query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status && { status: filters.status }),
        ...(filters.bloodType && { bloodType: filters.bloodType }),
        ...(filters.urgency && { urgency: filters.urgency }),
        ...(filters.expiryStart && { expiryStart: filters.expiryStart.toISOString() }),
        ...(filters.expiryEnd && { expiryEnd: filters.expiryEnd.toISOString() })
      })

      const response = await fetch(`/api/requests/history?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch data')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

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
      case "HIGH": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "LOW": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": 
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <Clock className="h-4 w-4 mr-1" />
            Pending
          </Badge>
        )
      case "FULFILLED": 
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="h-4 w-4 mr-1" />
            Fulfilled
          </Badge>
        )
      case "EXPIRED": 
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Expired
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            <XCircle className="h-4 w-4 mr-1" />
            Cancelled
          </Badge>
        )
      default: 
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
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

  const handleSearch = () => {
    fetchData(0)
  }

  const handlePageChange = (page: number) => {
    if (data && page >= 0 && page < data.totalPages) {
      fetchData(page)
    }
  }

  const handleFilterChange = (key: string, value: string | Date | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      status: "",
      bloodType: "",
      urgency: "",
      expiryStart: undefined,
      expiryEnd: undefined
    })
    setSearchTerm("")
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Blood Request History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hospital name..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.bloodType} onValueChange={(value) => handleFilterChange('bloodType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A_POSITIVE">A+</SelectItem>
                <SelectItem value="A_NEGATIVE">A-</SelectItem>
                <SelectItem value="B_POSITIVE">B+</SelectItem>
                <SelectItem value="B_NEGATIVE">B-</SelectItem>
                <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                <SelectItem value="O_POSITIVE">O+</SelectItem>
                <SelectItem value="O_NEGATIVE">O-</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.urgency} onValueChange={(value) => handleFilterChange('urgency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.expiryStart && "text-muted-foreground"
                    )}
                  >
                    {filters.expiryStart ? (
                      format(filters.expiryStart, "PPP")
                    ) : (
                      <span>Expiry start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.expiryStart}
                    onSelect={(date) => handleFilterChange('expiryStart', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.expiryEnd && "text-muted-foreground"
                    )}
                    disabled={!filters.expiryStart}
                  >
                    {filters.expiryEnd ? (
                      format(filters.expiryEnd, "PPP")
                    ) : (
                      <span>Expiry end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.expiryEnd}
                    onSelect={(date) => handleFilterChange('expiryEnd', date)}
                    initialFocus
                    fromDate={filters.expiryStart}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.status || filters.bloodType || filters.urgency || filters.expiryStart || filters.expiryEnd) && (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
              <div className="flex flex-wrap gap-2">
                {filters.status && (
                  <Badge className="px-2 py-1 text-xs">
                    Status: {filters.status}
                  </Badge>
                )}
                {filters.bloodType && (
                  <Badge className="px-2 py-1 text-xs">
                    Blood Type: {formatBloodType(filters.bloodType)}
                  </Badge>
                )}
                {filters.urgency && (
                  <Badge className="px-2 py-1 text-xs">
                    Urgency: {filters.urgency}
                  </Badge>
                )}
                {filters.expiryStart && (
                  <Badge className="px-2 py-1 text-xs">
                    From: {format(filters.expiryStart, "PPP")}
                  </Badge>
                )}
                {filters.expiryEnd && (
                  <Badge className="px-2 py-1 text-xs">
                    To: {format(filters.expiryEnd, "PPP")}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Table Section */}
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="w-[120px]">Blood Type</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : data?.content?.length ? (
                  data.content.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800">
                          {formatBloodType(request.bloodType)}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.hospitalName}</TableCell>
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

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{data.pageable.offset + 1}-{data.pageable.offset + data.numberOfElements}</strong> of <strong>{data.totalElements}</strong> requests
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(0)}
                  disabled={data.first || loading}
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First page</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.number - 1)}
                  disabled={data.first || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <div className="flex items-center justify-center text-sm font-medium">
                  Page {data.number + 1} of {data.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.number + 1)}
                  disabled={data.last || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.totalPages - 1)}
                  disabled={data.last || loading}
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last page</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
