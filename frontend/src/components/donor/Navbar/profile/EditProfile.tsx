"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { MapPin, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
  address: z.string().min(5, "Address is too short"),
  isAvailable: z.boolean()
})

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
  isSubmitting: boolean
}

export function EditProfile({ donor, onCancel, onSubmit, isSubmitting }: EditProfileProps) {
  const [locationState, setLocationState] = useState({
    lat: donor.location.lat,
    lng: donor.location.lng,
    address: donor.address
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: donor.name,
      phone: donor.phone,
      address: donor.address,
      isAvailable: donor.isAvailable
    }
  })

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    toast.info("Detecting your location...")
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

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await onSubmit({
        ...data,
        email: donor.email,
        bloodType: donor.bloodType,
        location: {
          lat: locationState.lat,
          lng: locationState.lng
        }
      })
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  return (
    <Card className="p-4 sm:p-6 space-y-6 rounded-xl max-w-full overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="min-w-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" className="min-w-0" />
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
                    <p className="text-sm text-muted-foreground">
                      {field.value ? "Visible to seekers" : "Hidden from searches"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-red-500"
                    />
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
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="min-w-0 min-h-[100px]"
                      placeholder="Street, City, Postal Code"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Picker */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Pin Your Location</span>
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDetectLocation}
                  className="text-xs"
                >
                  Auto-detect
                </Button>
              </div>
              
              <div className="rounded-lg overflow-hidden border">
                <LocationPicker
                  onLocationChange={(location) => {
                    setLocationState({
                      lat: location.lat,
                      lng: location.lng,
                      address: location.address || field.value.address
                    })
                  }}
                  initialLocation={{
                    lat: locationState.lat,
                    lng: locationState.lng
                  }}
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Current coordinates: {locationState.lat.toFixed(6)}, {locationState.lng.toFixed(6)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}