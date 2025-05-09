"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { MapPin, Loader2, X } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"

const LocationPicker = dynamic(
  () => import("@/components/CommanComponents/location-picker"),
  { 
    ssr: false, 
    loading: () => <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse" /> 
  }
)

interface EditProfileProps {
  donor: {
    name: string
    email: string
    phone: string
    bloodType: string
    address: string
    isAvailable: boolean
    location: { lat: number; lng: number }
  }
  onCancel: () => void
  onSubmit: (data: any) => Promise<void>
}

export function EditProfile({ donor, onCancel, onSubmit }: EditProfileProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationState, setLocationState] = useState({
    lat: donor.location.lat,
    lng: donor.location.lng,
    address: donor.address
  })

  const form = useForm({
    defaultValues: {
      phone: donor.phone,
      address: donor.address,
      isAvailable: donor.isAvailable
    }
  })

  const handleDetectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: locationState.address
        })
        toast.success("Location detected successfully")
      },
      (error) => {
        toast.error("Could not detect your location. Please select manually.")
      }
    )
  }

  useEffect(() => {
    if (locationState.address) {
      form.setValue("address", locationState.address, { shouldValidate: true })
    }
    form.setValue("location", { 
      lat: locationState.lat, 
      lng: locationState.lng 
    }, { shouldValidate: true })
  }, [locationState, form])

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...data,
        location: {
          lat: locationState.lat,
          lng: locationState.lng
        }
      })
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="px-2 sm:p-6 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Availability */}
            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Available to donate</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Picker */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Location</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDetectLocation}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Auto-detect
                </Button>
              </div>
              <LocationPicker
                onLocationChange={(location) => {
                  setLocationState({
                    lat: location.lat,
                    lng: location.lng,
                    address: location.address || ""
                  })
                }}
                initialLocation={{
                  lat: locationState.lat,
                  lng: locationState.lng
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}