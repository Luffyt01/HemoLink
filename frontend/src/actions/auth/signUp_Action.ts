'use server'

import { z } from 'zod'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const schema = z.object({
    role: z.enum(['DONOR', 'HOSPITAL']),

  phone:z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string()
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"]
    })
  }

})
interface FormState {
    message: string
    status: number
    errors: {
        role?: string[]
      phone?: string[]
      email?: string[]
      password?: string[]
      confirmPassword?: string[]
    }
  }
    const intial : FormState = {
        errors:{},
        message:"",
        status:0,
    }
export async function signupAction(prevState: any, formData: FormData) {
    console.log(formData)
  const rawData = {
    role: formData.get('userRole'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }
console.log(rawData)
  // Validate with Zod
  const result = schema.safeParse(rawData)
  
  console.log(result.error)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    console.log(errors)
    return {
      errors,
      message: 'Validation failed',
    }
  }

  try {
    // Check if user exists

   
  } catch (error) {
    console.error('Signup error:', error)
    console.log(error)
    // if (error instanceof AxiosError) {
    //   if (error.response?.status === 422) {
    //     return {
    //       status: 422,
    //       message: error.response?.data?.message,
    //       errors: error.response?.data?.errors,
    //     }
    //   }
    // }
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors:error,
    }
  }

  redirect('/dashboard')
}