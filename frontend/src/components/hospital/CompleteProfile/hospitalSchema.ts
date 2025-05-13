import { z } from "zod"

// Hospital type enum
export const HospitalType = {
  GENERAL_HOSPITAL: "GENERAL_HOSPITAL",
  TEACHING_HOSPITAL: "TEACHING_HOSPITAL",
  SPECIALTY_HOSPITAL: "SPECIALTY_HOSPITAL",
  CHILDREN_HOSPITAL: "CHILDREN_HOSPITAL",
  TRAUMA_CENTER: "TRAUMA_CENTER",
  CANCER_CENTER: "CANCER_CENTER",
  BLOOD_BANK: "BLOOD_BANK",
  RESEARCH_HOSPITAL: "RESEARCH_HOSPITAL",
  COMMUNITY_HOSPITAL: "COMMUNITY_HOSPITAL",
  GOVERNMENT_HOSPITAL: "GOVERNMENT_HOSPITAL",
  PRIVATE_HOSPITAL: "PRIVATE_HOSPITAL",
  MILITARY_HOSPITAL: "MILITARY_HOSPITAL",
} as const;

// Form schema
export const formSchema = z.object({
  hospitalName: z.string()
    .min(3, "Hospital name must be at least 3 characters")
    .max(100, "Hospital name must be at most 100 characters"),
  licenseNumber: z.string()
    .regex(/^[A-Za-z0-9-]{8,20}$/, "License must be 8-20 alphanumeric characters with optional hyphens"),
  hospitalType: z.nativeEnum(HospitalType),
  establishmentYear: z.number()
    .min(1800, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  address: z.string()
    .max(200, "Address must be at most 200 characters"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().max(200).optional()
  }),
  mainPhone: z.string()
    .regex(/^[+]?[0-9]{10,15}$/, "Please enter a valid phone number with optional country code"),
  emergencyPhone: z.string()
    .regex(/^[+]?[0-9]{10,15}$/, "Please enter a valid emergency number with optional country code"),
  email: z.string()
    .email("Invalid email address"),
  website: z.string()
    .max(150, "Website must be at most 150 characters")
    .url("Invalid website URL")
    .optional()
    .or(z.literal("")),
  operatingHours: z.string()
    .max(50, "Operating hours must be at most 50 characters"),
  description: z.string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  hospitalStatus: z.enum(["OPENED", "CLOSED", "UNDER_MAINTENANCE"]),
  serviceArea: z.object({
    address: z.string().max(200).optional()
  }).optional()
})

export type FormValues = z.infer<typeof formSchema>