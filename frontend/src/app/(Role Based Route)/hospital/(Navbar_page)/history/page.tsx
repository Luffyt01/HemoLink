import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function HistoryPage() {
  // Sample history data
  const donationHistory = [
    {
      id: 1,
      donor: "John Doe",
      recipient: "Maria Garcia",
      bloodType: "O+",
      date: "May 5, 2025",
      hospital: "General Hospital",
    },
    {
      id: 2,
      donor: "Jane Smith",
      recipient: "David Lee",
      bloodType: "AB-",
      date: "May 2, 2025",
      hospital: "Memorial Hospital",
    },
    {
      id: 3,
      donor: "Robert Johnson",
      recipient: "James Wilson",
      bloodType: "B+",
      date: "April 28, 2025",
      hospital: "City Medical Center",
    },
    {
      id: 4,
      donor: "Emily Davis",
      recipient: "Susan Taylor",
      bloodType: "A+",
      date: "April 20, 2025",
      hospital: "General Hospital",
    },
    {
      id: 5,
      donor: "Michael Wilson",
      recipient: "Patricia Moore",
      bloodType: "O-",
      date: "April 15, 2025",
      hospital: "Memorial Hospital",
    },
  ]

  const requestHistory = [
    {
      id: 1,
      patientName: "Maria Garcia",
      bloodType: "O+",
      date: "May 5, 2025",
      status: "Completed",
      hospital: "General Hospital",
    },
    {
      id: 2,
      patientName: "David Lee",
      bloodType: "AB-",
      date: "May 2, 2025",
      status: "Completed",
      hospital: "Memorial Hospital",
    },
    {
      id: 3,
      patientName: "James Wilson",
      bloodType: "A+",
      date: "April 28, 2025",
      status: "Cancelled",
      hospital: "City Medical Center",
    },
    {
      id: 4,
      patientName: "Susan Taylor",
      bloodType: "B+",
      date: "April 20, 2025",
      status: "Completed",
      hospital: "General Hospital",
    },
    {
      id: 5,
      patientName: "Patricia Moore",
      bloodType: "O-",
      date: "April 15, 2025",
      status: "Completed",
      hospital: "Memorial Hospital",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Donation History</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>History Overview</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">43</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">-3% from last month</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="donations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="donations">Donation History</TabsTrigger>
          <TabsTrigger value="requests">Request History</TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donationHistory.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">{donation.donor}</TableCell>
                      <TableCell>{donation.recipient}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                          {donation.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell>{donation.date}</TableCell>
                      <TableCell>{donation.hospital}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestHistory.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.patientName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                          {request.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>{request.hospital}</TableCell>
                      <TableCell>
                        {request.status === "Completed" ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
