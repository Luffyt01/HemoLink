'use server'

import { z } from 'zod'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { stat } from 'fs'

const schema = z.object({
    

  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(2, 'Password must be at least 2 characters')
})
interface FormState {
    message: string
    status: number
    errors: {
      
      email?: string[]
      password?: string[]
      
    }
  }
    const intial : FormState = {
        errors:{},
        message:"",
        status:0,
    }
export async function LoginAction(prevState: any, formData: FormData) {
    // console.log(formData)
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }
  // console.log(rawData)
  // Validate with Zod
  const result = schema.safeParse(rawData)
  // console.log(result)
  // console.log(result.error)
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
  
   return {
    status: 200,
    email:result.data.email,
    password:result.data.password,
   }
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

//   redirect('/dashboard')
}