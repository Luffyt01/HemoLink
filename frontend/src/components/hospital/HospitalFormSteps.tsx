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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2, CheckCircle2, Clock, Building2, Mail, Phone, Globe } from "lucide-react"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"
import { Card } from "../ui/card"
import SubmitButton from "../CommanComponents/SubmitButton"
import { formSchema, HospitalType } from "./hospitalSchema"
import { completeHospitalProfile } from "@/actions/Hospital/Hospital-Complete-Profile"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/useAuthStore"

// Lazy loaded components
const LocationPicker = dynamic(() => import("@/components/CommanComponents/location-picker"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse" />
})


interface HospitalProfileFormProps {
  session: any
  isGeolocating: boolean
  setIsGeolocating: (value: boolean) => void
  formAction: (formData: FormData) => Promise<any>
//   onFormAction: (state: any) => any
}

export default function HospitalProfileForm({
 
  isGeolocating,
  setIsGeolocating,
  formAction,
//   onFormAction
}: HospitalProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [state, formActionWithState] = useActionState(completeHospitalProfile, null)
  const router = useRouter()
  const {session} = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalName: "",
      licenseNumber: "",
      hospitalType: undefined,
      establishmentYear: new Date().getFullYear(),
      address: "",
      location: { lat: 28.6139, lng: 77.2090 }, // Default location (India)
      mainPhone: session?.user?.phone || "",
      emergencyPhone: "",
      email: "",
      website: "",
      operatingHours: "24/7",
      description: "",
    },
  })

  // Handle server response
  useEffect(() => {
    if (state) {
    //   onFormAction(state)
      
      if (state.fieldErrors) {
        Object.entries(state.fieldErrors).forEach(([field, message]) => {
          form.setError(field as any, { type: 'server', message: Array.isArray(message) ? message.join(", ") : message })
        })
      }
      
      // If successful submission, show success
      if (state.success) {
        toast.success("Hospital profile saved successfully!", {
          icon: <CheckCircle2 className="text-green-500" />,

        })
        
            router.push("/hospital/dashboard")
          
            // window.location.href = '/hospital/dashboard';
          
      }
    }
  }, [state, form,router])
//   }, [state, form, onFormAction,])

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
        toast.success("Location detected successfully")
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

    if (session?.token) {
      formData.append('token', session.token)
    }

    return formActionWithState(formData)
  }

  // Handle step navigation with validation
  const handleNextStep = async () => {
    const fields = currentStep === 1 
      ? ['hospitalName', 'licenseNumber', 'hospitalType', 'establishmentYear'] 
      : ['address', 'location', 'mainPhone', 'emergencyPhone', 'email', 'operatingHours']
    
    const isValid = await form.trigger(fields as any)
    if (isValid) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      toast.error("Please fill all required fields correctly")
    }
  }

  // Form field configurations
  const step1Fields = [
    { 
      name: "hospitalName", 
      label: "Hospital Name", 
      type: "text", 
      placeholder: "City General Hospital",
      description: "Official name of your hospital",
      icon: <Building2 className="w-4 h-4" />
    },
    { 
      name: "licenseNumber", 
      label: "License Number", 
      type: "text", 
      placeholder: "MH-12345-2023",
      description: "Government issued hospital license number",
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    { 
      name: "hospitalType", 
      label: "Hospital Type", 
      type: "select",
      description: "Select the type of your hospital",
      icon: <Building2 className="w-4 h-4" />,
      render: ({ field }: any) => (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Select hospital type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {Object.values(HospitalType).map((type) => (
              <SelectItem key={type} value={type} className="hover:bg-blue-50 focus:bg-blue-50">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    { 
      name: "establishmentYear", 
      label: "Establishment Year", 
      type: "number", 
      description: "Year when the hospital was established",
      render: ({ field }: any) => (
        <Input
          type="number"
          min={1800}
          max={new Date().getFullYear()}
          {...field}
          onChange={(e) => field.onChange(parseInt(e.target.value))}
          className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500"
        />
      )
    }
  ]

  const step2Fields = [
    {
      name: "address",
      label: "Full Address",
      type: "textarea",
      placeholder: "123 Medical Street, Health District, City, Postal Code",
      description: "Complete physical address of the hospital",
      icon: <MapPin className="w-4 h-4" />,
      props: { rows: 3 }
    },
    {
      name: "location",
      label: "Hospital Location",
      type: "custom",
      description: "Drag the pin to adjust your exact location",
      icon: <MapPin className="w-4 h-4" />,
      render: ({ field }: any) => (
        <div className="space-y-2">
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
          <LocationPicker
            onLocationChange={(location) => {
              field.onChange(location)
              form.setValue('address', location.address || '', { shouldValidate: true })
            }}
            initialLocation={field.value}
          />
        </div>
      )
    },
    {
      name: "mainPhone",
      label: "Main Phone Number",
      type: "tel",
      placeholder: "+91 1234567890",
      description: "Primary contact number for the hospital",
      icon: <Phone className="w-4 h-4" />
    },
    {
      name: "emergencyPhone",
      label: "Emergency Phone Number",
      type: "tel",
      placeholder: "+91 9876543210",
      description: "24/7 emergency contact number",
      icon: <Phone className="w-4 h-4 text-red-500" />
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "contact@hospitalname.com",
      description: "Official email address for communications",
      icon: <Mail className="w-4 h-4" />
    },
    {
      name: "website",
      label: "Website URL",
      type: "url",
      placeholder: "https://www.hospitalname.com",
      description: "Official website (if available)",
      icon: <Globe className="w-4 h-4" />
    },
    {
      name: "operatingHours",
      label: "Operating Hours",
      type: "text",
      placeholder: "24/7 or 9:00 AM - 9:00 PM",
      description: "Regular operating hours of the hospital",
      icon: <Clock className="w-4 h-4" />
    }
  ]

  return (
    <div className="max-w-3xl mx-auto my-3">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 mb-6 rounded-full">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out rounded-full" 
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Step Indicators */}
          <div className="flex justify-center gap-4 mb-8">
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                onClick={() => currentStep > step && setCurrentStep(step)}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="p-3 md:p-6 space-y-1">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Basic Hospital Information
              </h2>
              {step1Fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as keyof z.infer<typeof formSchema>}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        {field.icon}
                        {field.label}
                      </FormLabel>
                      <FormControl>
                        {field.render ? field.render({ field: formField }) : (
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            {...formField}
                            className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500"
                          />
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
            </Card>
          )}

          {/* Step 2: Contact & Location */}
          {currentStep === 2 && (
            <Card className="p-3 md:p-6 space-y-1">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Contact & Location Information
              </h2>
              {step2Fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as keyof z.infer<typeof formSchema>}
                  render={({ field: formField }) => (
                    <FormItem>
                      {field.icon && (
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          {field.icon}
                          {field.label}
                        </FormLabel>
                      )}
                      <FormControl>
                        {field.render ? field.render({ field: formField }) : (
                          field.type === "textarea" ? (
                            <Textarea
                              placeholder={field.placeholder}
                              {...formField}
                              className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500"
                              rows={field.props?.rows || 3}
                            />
                          ) : (
                            <Input
                              type={field.type}
                              placeholder={field.placeholder}
                              {...formField}
                              className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500"
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
            </Card>
          )}

          {/* Step 3: Review & Additional Info */}
          {currentStep === 3 && (
            <Card className="p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Review & Additional Information
              </h2>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Operating Hours
                </h3>
                <p className="text-blue-600 text-sm mt-1">
                  Verify your hospital's operating schedule
                </p>
              </div>

              <FormField
                control={form.control}
                name="operatingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Current Operating Hours
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 text-sm">
                      You can update these hours anytime
                    </FormDescription>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Hospital Description (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description about your hospital, specialties, facilities..."
                        {...field}
                        className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 text-sm">
                      This will be displayed on your public profile
                    </FormDescription>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-800">Review Your Information</h3>
                <p className="text-green-600 text-sm mt-1">
                  Please verify all details before submitting
                </p>
              </div>

              {/* Summary of entered data */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Hospital Details:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(form.getValues()).map(([key, value]) => {
                    if (key === 'location' || key === "description") return null
                    return (
                      <div key={key} className="bg-gray-50 p-3 rounded">
                        <p className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace('hospital ', '')}
                        </p>
                        <p className="text-gray-800">
                          {value?.toString() || <span className="text-gray-400">Not provided</span>}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 px-2">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-50 flex-1 sm:flex-none"
              >
                Back
              </Button>
            ) : (
              <div className="flex-1" /> // Empty div for spacing
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="bg-gradient-to-r from-blue-500 cursor-pointer to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md flex-1 sm:flex-none"
              >
                Continue
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  Edit Information
                </Button>
                <SubmitButton />
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}