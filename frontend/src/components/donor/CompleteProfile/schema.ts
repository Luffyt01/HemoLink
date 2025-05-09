
import { z } from "zod"

export enum BloodType {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE",
}

export const formSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be at most 100 characters." })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
  age: z.number()
    .int({ message: "Age must be an integer" })
    .min(18, { message: "You must be at least 18 years old." })
    .max(65, { message: "You must be at most 65 years old." }),
  address: z.string()
    .max(200, { message: "Address must be at most 200 characters." }),
  bloodType: z.nativeEnum(BloodType, {
    required_error: "Please select your blood type",
  }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).refine(val => val.lat !== 0 && val.lng !== 0, {
    message: "Please select your location on the map",
  }),
  isAvailable: z.boolean().default(true),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Please enter a valid phone number with country code",
  }),
  emergencyContact: z.string().regex(/^[+]?[0-9]{10,15}$/, {
    message: "Please enter a valid phone number with optional country code (10-15 digits)",
  }),
})

export type FormValues = z.infer<typeof formSchema>