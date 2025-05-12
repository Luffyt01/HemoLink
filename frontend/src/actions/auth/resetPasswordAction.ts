
"use server"
import { z } from "zod"

// Enhanced password schema with combined error message
const passwordSchema = z.string().superRefine((val, ctx) => {
    const errors = []
    if (val.length < 8) errors.push("at least 8 characters")
    if (!/[A-Z]/.test(val)) errors.push("one uppercase letter")
    if (!/[a-z]/.test(val)) errors.push("one lowercase letter")
    if (!/[0-9]/.test(val)) errors.push("one number")
    if (!/[^A-Za-z0-9]/.test(val)) errors.push("one special character")
    
    if (errors.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Password must contain: ${errors.join(", ")}`
      })
      return false
    }
    return true
  })
  
  const FormSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })
export async function resetPasswordAction(prevState: any, formData: FormData) {
    try {
      const password = formData.get("password")
      const confirmPassword = formData.get("confirmPassword")
      const token = formData.get("token")
      const email = formData.get("email")
  
      // Validate inputs
      const result = FormSchema.safeParse({
        password,
        confirmPassword
      })
      
      if (!result.success) {
        return {
          errors: result.error.flatten().fieldErrors,
          message: "Validation failed"
        }
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      return {
        success: true,
        message: "Password reset successfully!"
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to reset password. Please try again."
      }
    }
  }