"use client"

import { User as UserIcon, Phone, Mail, Droplet, MapPin, Check, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
    <Card className="p-4 sm:p-6 lg:p-8 space-y-6 rounded-xl shadow-sm border-0 bg-white dark:bg-gray-900 max-w-full overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1 min-w-0 max-w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
            {donor.name}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 break-all">
            {donor.email}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={onEdit}
          className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 dark:border-primary dark:text-primary dark:hover:bg-primary/20 shrink-0"
        >
          Edit Profile
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 shrink-0">
              <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Personal Information
            </h3>
          </div>
          
          <div className="space-y-4 pl-2 md:pl-11">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 shrink-0">
                <Phone className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {donor.phone || "Not provided"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 shrink-0">
                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white break-all">
                  {donor.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 shrink-0">
              <Droplet className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Medical Information
            </h3>
          </div>
          
          <div className="space-y-4 pl-2 md:pl-11">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                <Droplet className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">Blood Type</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {donor.bloodType}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0">
                {donor.isAvailable ? (
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">Availability</p>
                <Badge 
                  variant={donor.isAvailable ? "default" : "secondary"}
                  className={`mt-1 ${donor.isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}
                >
                  {donor.isAvailable ? "Available to donate" : "Not available"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Location - Full Width */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 shrink-0">
              <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Location
            </h3>
          </div>
          
          <div className="space-y-4 pl-2 md:pl-11">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 shrink-0">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-medium text-gray-900 dark:text-white break-words">
                    {donor.address}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 shrink-0">
                  <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Coordinates</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {donor.location.lat.toFixed(4)}, {donor.location.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}