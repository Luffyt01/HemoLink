"use client"
import { useActionState, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Lock, ArrowLeft, HeartPulse, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { resetPasswordAction } from "@/actions/auth/resetPasswordAction"

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

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email") || "test@test.com"
  const [state, formAction] = useActionState(resetPasswordAction, null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
    } else if (state?.message && !state?.success) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-50 to-white p-4">
      <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
        <CardHeader className="space-y-1 bg-gradient-to-r from-rose-600 to-red-600 p-6">
          <div className="flex items-center gap-3">
            <HeartPulse className="h-8 w-8 text-white" />
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                Hemolink
              </CardTitle>
              <CardDescription className="text-white/90">
                Connecting donors with hospitals
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {token && email ? (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold text-rose-700">Reset Your Password</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  For: <span className="font-medium">{email}</span>
                </p>
              </div>
              
              <Form {...form}>
                <form action={formAction} className="space-y-4">
                  <input type="hidden" name="token" value={token || ""} />
                  <input type="hidden" name="email" value={email || ""} />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              {...field}
                              name="password"
                              className="focus-visible:ring-rose-500 pr-10"
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground mt-1">
                          Requirements: 8+ characters, uppercase, lowercase, number, special character
                        </p>
                        <p className="text-xs text-red-500 mt-1">

                          {state?.errors?.password?.[0]}
                        </p>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              {...field}
                              name="confirmPassword"
                              className="focus-visible:ring-rose-500 pr-10"
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                        <p className="text-xs text-red-500 mt-1">

                          {state?.errors?.confirmPassword?.[0]}
                        </p>
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <HeartPulse className="h-4 w-4 animate-pulse" />
                        Resetting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Reset Password
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center text-sm">
                <Button variant="link" asChild className="text-rose-600 hover:text-rose-800">
                  <Link href="/signin" className="flex items-center justify-center gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <Lock className="h-12 w-12 mx-auto text-red-500" />
              <h3 className="text-lg font-medium">Invalid Reset Link</h3>
              <p className="text-sm text-muted-foreground">
                The password reset link is invalid or has expired. Please request a new one.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/forgot-password" className="text-rose-600">
                  Request New Reset Link
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

