import { z } from "zod"

// Hospital type enum
export const HospitalType = {
  GENERAL: "General Hospital",
  SPECIALTY: "Specialty Hospital",
  TEACHING: "Teaching Hospital",
  RESEARCH: "Research Hospital",
  GOVERNMENT: "Government Hospital",
  PRIVATE: "Private Hospital",
} as const

// Form schema
export const formSchema = z.object({
  hospitalName: z.string().min(2, "Hospital name must be at least 2 characters"),
  licenseNumber: z.string().min(5, "License number must be at least 5 characters"),
  hospitalType: z.nativeEnum(HospitalType),
  establishmentYear: z.number().min(1800, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional()
  }),
  mainPhone: z.string().min(10, "Invalid phone number"),
  emergencyPhone: z.string().min(10, "Invalid emergency number"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  operatingHours: z.string().min(2, "Please specify operating hours"),
  description: z.string().optional(),
})
export type FormValues = z.infer<typeof formSchema>