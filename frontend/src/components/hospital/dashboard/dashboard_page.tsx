

"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Droplet, Heart, History, PlusCircle } from "lucide-react"

export default function Hospital_dashboard_page() {
  return (
    <div className="space-y-8 py-6">
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Hospital Management System
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Connecting donors with patients in need. Manage requests and track donation history.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-teal-600 hover:bg-teal-700">
                <Link href="/hospital/donors">
                  Find Donors <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/hospital/requests">
                  Make Request <PlusCircle className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Heart className="h-8 w-8 text-teal-600 mb-2" />
                <CardTitle>Donor Management</CardTitle>
                <CardDescription>Connect with available donors</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Find and connect with donors based on blood type, location, and availability.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/hospital/donors">View Donors</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Droplet className="h-8 w-8 text-teal-600 mb-2" />
                <CardTitle>Request Management</CardTitle>
                <CardDescription>Create and track donation requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Submit new donation requests and track their status in real-time.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/hospital/requests">Manage Requests</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <History className="h-8 w-8 text-teal-600 mb-2" />
                <CardTitle>Donation History</CardTitle>
                <CardDescription>View past donations and requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access complete history of donations and requests for reporting and analysis.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/hospital/history">View History</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
