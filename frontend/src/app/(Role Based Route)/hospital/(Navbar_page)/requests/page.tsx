import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

export default function RequestsPage() {
  // Sample request data
  const activeRequests = [
    {
      id: 1,
      patientName: "Maria Garcia",
      bloodType: "O+",
      hospital: "General Hospital",
      urgency: "High",
      date: "May 12, 2025",
      status: "Pending",
    },
    {
      id: 2,
      patientName: "David Lee",
      bloodType: "AB-",
      hospital: "Memorial Hospital",
      urgency: "Medium",
      date: "May 13, 2025",
      status: "Matched",
    },
    {
      id: 3,
      patientName: "Susan Taylor",
      bloodType: "B+",
      hospital: "City Medical Center",
      urgency: "Low",
      date: "May 15, 2025",
      status: "Pending",
    },
  ]

  const completedRequests = [
    {
      id: 4,
      patientName: "James Wilson",
      bloodType: "A+",
      hospital: "General Hospital",
      urgency: "High",
      date: "May 5, 2025",
      status: "Completed",
    },
    {
      id: 5,
      patientName: "Patricia Moore",
      bloodType: "O-",
      hospital: "Memorial Hospital",
      urgency: "High",
      date: "May 2, 2025",
      status: "Completed",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Donation Requests</h1>
        <Button className="bg-teal-600 hover:bg-teal-700">Create New Request</Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="completed">Completed Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {activeRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {completedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RequestCard({ request }: { request: any }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>
      case "Matched":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
      case "Completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "High":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            {urgency}
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
            {urgency}
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            {urgency}
          </Badge>
        )
      default:
        return <Badge variant="outline">{urgency}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{request.patientName}</CardTitle>
            <CardDescription>Blood Type: {request.bloodType}</CardDescription>
          </div>
          <div className="flex gap-2">
            {getStatusBadge(request.status)}
            {getUrgencyBadge(request.urgency)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{request.hospital}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{request.date}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Details</Button>
        {request.status === "Pending" && <Button className="bg-teal-600 hover:bg-teal-700">Find Donors</Button>}
        {request.status === "Matched" && <Button className="bg-teal-600 hover:bg-teal-700">Complete Donation</Button>}
        {request.status === "Completed" && <Button variant="outline">View Receipt</Button>}
      </CardFooter>
    </Card>
  )
}
