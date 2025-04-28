'use client'

import { useForm } from "react-hook-form"
import { useActionState, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input} from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { BloodType, formSchema } from "./schema"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"
import SubmitButton from "./SubmitButton"


// Lazy loaded components
const LocationPicker = dynamic(() => import("@/components/donor/location-picker"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse" />
})

interface DonorProfileFormProps {
  session: any
  isGeolocating: boolean
  setIsGeolocating: (value: boolean) => void
  formAction: (formData: FormData) => Promise<any>
  onFormAction: (state: any) => any
}

export default function DonorProfileForm({
  session,
  isGeolocating,
  setIsGeolocating,
  formAction,
  onFormAction
}: DonorProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [state, formActionWithState] = useActionState(formAction, null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 18,
      address: "",
      bloodType: undefined,
      location: { lat: 0, lng: 0 },
      isAvailable: true,
      phone: "",
      emergencyContact: "",
    },
  })

  // Handle server response
  useEffect(() => {
    if (state) {
      onFormAction(state)
      
      // Set field errors if they exist
      if (state.fieldErrors) {
        Object.entries(state.fieldErrors).forEach(([field, message]) => {
          form.setError(field as any, { type: 'server', message: message as string })
        })
      }
    }
  }, [state, form, onFormAction])

  // Auto-detect location
  const handleDetectLocation = () => {
    setIsGeolocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue('location', {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }, { shouldValidate: true, shouldDirty: true })
        setIsGeolocating(false)
      },
      (error) => {
        toast.error("Could not detect your location. Please select manually.")
        setIsGeolocating(false)
      }
    )
  }

  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData()
    
    // Append all form values
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'location') {
        if (typeof value === 'object' && value !== null && 'lat' in value && 'lng' in value) {
          formData.append('location[lat]', value.lat.toString())
          formData.append('location[lng]', value.lng.toString())
        }
      } else {
        formData.append(key, value?.toString() ?? '')
      }
    })

    // Add userId if available
    if (session?.user?.id) {
      formData.append('userId', session.user.id)
    }

    return formActionWithState(formData)
  }

  // Handle step navigation
  const handleNextStep = async () => {
    const fields = currentStep === 1 
      ? ['name', 'age', 'phone', 'emergencyContact'] 
      : ['bloodType', 'address', 'location']
    
    const isValid = await form.trigger(fields as any)
    if (isValid) setCurrentStep(currentStep + 1)
  }

  // Form field configurations
  const step1Fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
    { 
      name: "age", 
      label: "Age", 
      type: "number", 
      props: { min: 18, max: 40 },
      render: ({ field }: any) => (
        <Input
          type="number"
          min={18}
          max={40}
          {...field}
          onChange={(e) => field.onChange(parseInt(e.target.value))}
          className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-500"
        />
      )
    },
    { name: "phone", label: "Phone Number", type: "text", placeholder: "+91xyz" },
    { 
      name: "emergencyContact", 
      label: "Emergency Contact", 
      type: "text",
      placeholder: "Name and phone number",
      description: "Who should we contact in case of emergency?"
    }
  ]

  const step2Fields = [
    {
      name: "bloodType",
      label: "Blood Type",
      type: "select",
      render: ({ field }: any) => (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-500">
            <SelectValue placeholder="Select your blood type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {Object.values(BloodType).map((type) => (
              <SelectItem key={type} value={type} className="hover:bg-pink-50 focus:bg-pink-50">
                <div className="flex items-center">
                  <span className="font-medium">{type.replace('_', ' ')}</span>
                  {type.includes('POSITIVE') && (
                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      Most Needed
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    {
      name: "address",
      label: "Full Address",
      type: "textarea",
      placeholder: "Street, City, Postal Code",
      props: { rows: 3 }
    },
    {
      name: "location",
      label: "Pin Your Location",
      type: "custom",
      render: ({ field }: any) => (
        <>
          <div className="flex justify-between items-center">
            <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 
              {field.label}
            </FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDetectLocation}
              disabled={isGeolocating}
              className="text-xs"
            >
              {isGeolocating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Auto-detect"}
            </Button>
          </div>
          <FormDescription className="mb-2 text-gray-500 text-sm">
            Drag the pin to adjust your exact location
          </FormDescription>
          <LocationPicker
            onLocationChange={field.onChange}
            initialLocation={field.value}
          />
        </>
      )
    }
  ]

  return (
    <>
      {/* Progress Bar */}
      <div className="h-2 bg-gray-100">
        <div 
          className="h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-500 ease-out" 
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 sm:p-8">
          <div className="space-y-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {step1Fields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof z.infer<typeof formSchema>}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">{field.label}</FormLabel>
                        <FormControl>
                          {field.render ? field.render({ field: formField }) : (
                            <Input
                              type={field.type}
                              placeholder={field.placeholder}
                              {...formField}
                              className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-500"
                              {...(typeof (field as any).props === 'object' && (field as any).props)}
                            />
                          )}
                        </FormControl>
                        {"description" in field && field.description && (
                          <FormDescription className="text-gray-500 text-sm">
                            {field.description}
                          </FormDescription>
                        )}
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            {/* Step 2: Medical Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {step2Fields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof z.infer<typeof formSchema>}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">{field.label}</FormLabel>
                        <FormControl>
                          {field.render ? field.render({ field: formField }) : (
                            field.type === "textarea" ? (
                              <Textarea
                                placeholder={field.placeholder}
                                {...formField}
                                value={formField.value?.toString() || ""}
                                className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-500"
                                {...field.props}
                              />
                            ) : (
                              <Input
                                type={field.type}
                                placeholder={field.placeholder}
                                {...formField}
                                value={formField.value?.toString() || ""}
                                className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-500"
                                {...field.props}
                              />
                            )
                          )}
                        </FormControl>
                        {field.description && (
                          <FormDescription className="text-gray-500 text-sm">
                            {field.description}
                          </FormDescription>
                        )}
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            {/* Step 3: Review and Availability */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800">Availability</h3>
                  <p className="text-blue-600 text-sm mt-1">
                    When are you typically available for donations?
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 bg-gray-50">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-gray-700 font-medium">
                          I'm currently available to donate
                        </FormLabel>
                        <FormDescription className="text-gray-500 text-sm">
                          You can change this anytime in your profile
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800">Review Your Information</h3>
                  <p className="text-green-600 text-sm mt-1">
                    Please verify all details before submitting
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </Button>
            ) : (
              <div /> // Empty div for spacing
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-md"
              >
                Continue
              </Button>
            ) : (
              <SubmitButton />
            )}
          </div>
        </form>
      </Form>
    </>
  )
}