import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

export default function DonorsPage() {
  // Sample donor data
  const donors = [
    { id: 1, name: "John Doe", bloodType: "A+", location: "New York", lastDonation: "2 months ago", available: true },
    { id: 2, name: "Jane Smith", bloodType: "O-", location: "Chicago", lastDonation: "1 month ago", available: true },
    {
      id: 3,
      name: "Robert Johnson",
      bloodType: "B+",
      location: "Los Angeles",
      lastDonation: "3 months ago",
      available: false,
    },
    { id: 4, name: "Emily Davis", bloodType: "AB+", location: "Houston", lastDonation: "2 weeks ago", available: true },
    {
      id: 5,
      name: "Michael Wilson",
      bloodType: "A-",
      location: "Miami",
      lastDonation: "5 months ago",
      available: true,
    },
    { id: 6, name: "Sarah Brown", bloodType: "O+", location: "Seattle", lastDonation: "Never", available: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Donor Directory</h1>
        <Button className="bg-teal-600 hover:bg-teal-700">Register as Donor</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Donors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search donors..." className="pl-8" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Blood Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blood Types</SelectItem>
                <SelectItem value="a+">A+</SelectItem>
                <SelectItem value="a-">A-</SelectItem>
                <SelectItem value="b+">B+</SelectItem>
                <SelectItem value="b-">B-</SelectItem>
                <SelectItem value="ab+">AB+</SelectItem>
                <SelectItem value="ab-">AB-</SelectItem>
                <SelectItem value="o+">O+</SelectItem>
                <SelectItem value="o-">O-</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="newyork">New York</SelectItem>
                <SelectItem value="chicago">Chicago</SelectItem>
                <SelectItem value="losangeles">Los Angeles</SelectItem>
                <SelectItem value="houston">Houston</SelectItem>
                <SelectItem value="miami">Miami</SelectItem>
                <SelectItem value="seattle">Seattle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donors.map((donor) => (
          <Card key={donor.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={donor.name} />
                <AvatarFallback>
                  {donor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{donor.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                    {donor.bloodType}
                  </Badge>
                  {donor.available ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                      Unavailable
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Location:</div>
                <div>{donor.location}</div>
                <div className="text-muted-foreground">Last Donation:</div>
                <div>{donor.lastDonation}</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Send Request
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
