"use client"

import { User as UserIcon, Phone, Mail, Droplet, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProfileViewProps {
  donor: {
    name: string
    email: string
    phone: string
    bloodType: string
    address: string
    isAvailable: boolean
    location: { lat: number; lng: number }
  }
  onEdit: () => void
}

export function ProfileView({ donor, onEdit }: ProfileViewProps) {
  return (
    <Card className=" px-2 sm:p-6 space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <Button variant="outline" onClick={onEdit}>
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Personal Information
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{donor.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{donor.email}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{donor.phone}</p>
          </div>
        </div>

        {/* Medical Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Droplet className="h-5 w-5 text-red-500" />
            Medical Information
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Blood Type</p>
            <p className="font-medium">{donor.bloodType}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Availability</p>
            <p className="font-medium">
              {donor.isAvailable ? (
                <span className="text-green-600">Available to donate</span>
              ) : (
                <span className="text-gray-500">Not currently available</span>
              )}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{donor.address}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Coordinates</p>
            <p className="font-medium">
              {donor.location.lat.toFixed(4)}, {donor.location.lng.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}