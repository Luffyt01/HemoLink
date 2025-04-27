"use client"
import { LoginAction } from '@/actions/auth/Login_Action';
import { signupAction } from '@/actions/auth/signUp_Action';
import { GoogleSubmitBtn } from '@/components/CommanComponents/GoogleSubmitBtn';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from 'sonner';
export default function LoginPage() {
  const [role, setRole] = useState<'DONOR' | 'HOSPITAL'>('DONOR')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})
const [googlePending, setGooglePending] = useState(false)
  interface FormState {
    message: string
    status: number
    errors: {
        
      email?: string[]
      password?: string[]
      role?: string[]
      
    }
  }
    const intial : FormState = {
        errors:{},
        message:"",
        status:0,
    }
   const [state, fromAction] = useActionState<FormState>(LoginAction, intial);

   const handleGoogleSignIn = async () => {
    setGooglePending(true)
    try {
    
      await signIn("google", { redirect: true, callbackUrl: "/",  })
    } catch (error) {
      toast.error("Google sign-in failed")
    } finally {
      setGooglePending(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center px-4 py-3">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
              Join HemoLink
            </h1>
            <p className="mt-2 text-gray-600">
              Become a lifesaver in your community
            </p>
          </div>

          {/* Role Selection */}
          <div className="flex mb-6 rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setRole('DONOR')}
              className={`flex-1 py-2 px-4 rounded-md ${role === 'DONOR' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              I'm a Donor
            </button>
            <button
              type="button"
              onClick={() => setRole('HOSPITAL')}
              className={`flex-1 py-2 px-4 rounded-md ${role === 'HOSPITAL' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Hospital Staff
            </button>

          </div>
            {state?.errors?.role && <p className="text-sm text-red-500 mx-auto">{state.errors.role}</p>}

          <form action={fromAction} className="space-y-[11px]">
          <input type="hidden" name="userRole"   value={role} />
            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                />
                {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
            </div>

            

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-200 pr-10"
                  />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500"
                >
                  {showPassword ? <IoEye size={25}/> : <IoEyeOff size={25} />}
                </button>
              </div>
                  {state.errors?.password && <p className="text-sm text-red-500">{state.errors?.password}</p>}
            </div>


            {/* <button
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-r from-rose-500 to-red-600 text-white py-2 px-4 rounded-lg hover:shadow-md transition-all"
            >
              Create Account
            </button> */}
             <SubmitButton />
          </form>
          <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full cursor-pointer"
          disabled={googlePending}>
          <GoogleSubmitBtn pending={googlePending} setPending={setGooglePending} />
        </Button>
      </div>
        </div>
        
        <div className="bg-gradient-to-r from-rose-50 to-red-50 p-4 text-center">
          <p className="text-sm text-gray-600">
          Don't have an account?{' '}
            <Link href="/signUp" prefetch className="font-medium text-rose-600 hover:text-rose-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="w-full mt-3 rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      disabled={pending}
      aria-disabled={pending}>
      {pending ? "Processing..." : "Register"}
    </button>
  )
}