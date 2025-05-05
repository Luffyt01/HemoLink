'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import axios, { AxiosError } from 'axios'

const schema = z.object({
  role: z.enum(['DONOR', 'HOSPITAL']),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter (a-z)')
    .regex(/[0-9]/, 'Must contain at least one digit (0-9)')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
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
  data?: any
  errors: {
    role?: string[]
    phone?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
}

export async function signupAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawData = {
    role: formData.get('userRole'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }
console.log("rawData",rawData)
  // Validate with Zod
  const result = schema.safeParse(rawData)

  if (!result.success) {
    return {
      status: 422,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
      data: null
    }
  }
  console.log(result.data)

  try {
    const response = await axios.post(
      `${process.env.BACKEND_APP_URL}/auth/signup`, 
      {
        email: result.data.email,
        phone: result.data.phone,
        password: result.data.password,
        role: result.data.role
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
console.log(response)
    // Redirect on successful signup
    // redirect('/signin')

    return {
      status: 200,
      message: "Signup successful",
      data: response.data,
      errors: {},
    }
  } catch (error) {
    console.log("error",error)
    if (error instanceof AxiosError) {
      if (error.response?.status === 422) {
        return {
          status: 422,
          message: error.response?.data?.error || 'Validation failed',
          errors: error.response?.data?.errors || {},
          data: null
        }
      }
      if (error.response?.status === 400) {
        return {
          status: 400,
          message: error.response?.data?.error || 'Validation failed',
          errors: error.response?.data?.errors || {},
          data: null
        }
      }
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'An unexpected error occurred',
        errors: error.response?.data?.errors || {},
        data: null
      }
    }

    return {
      status: 500,
      message: 'An unexpected error occurred. Please try again.',
      errors: {},
      data: null
    }
  }
}