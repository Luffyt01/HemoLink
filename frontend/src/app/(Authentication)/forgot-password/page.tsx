"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { ArrowLeft, Droplets, HeartPulse } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useActionState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import forgotPasswordAction from "@/actions/auth/forgotPasswordAction"



export default function ForgotPasswordPage() {
  const [state,formState,isPending] = useActionState(forgotPasswordAction,null)
  useEffect(() => {
    if(state?.status === 200){
      toast.success(state.success)
    }
    if(state?.status === 500){
      toast.error(state.error)
    }
  },[state])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-50/50 to-white p-4">
      <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
        <CardHeader className="space-y-1 bg-gradient-to-r from-rose-600 to-red-600 p-6">
          <div className="flex items-center gap-2">
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
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-rose-700">Password Recovery</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your email to receive a reset link
            </p>
          </div>
          
          
            <form action={formState} className="space-y-6">
              {/* <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your@email.com" 
                        {...field} 
                        className="focus-visible:ring-rose-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <div className="space-y-3">
                <Label>Email address</Label>
                <Input
                  placeholder="your@email.com"
                  name="email"
                  type="email"
                  className="focus-visible:ring-rose-500"
                    // aria-describedby="email-error"
                />
                <p className="text-red-500 text-sm">{state?.email}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r cursor-pointer from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <HeartPulse className="h-4 w-4 animate-pulse" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      Send Reset Link
                    </span>
                  )}
                </Button>
                
                <Button variant="link" asChild className="text-rose-600 hover:text-rose-800">
                  <Link href="/signin" className="flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </Button>
              </div>
            </form>
        
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            If you don't receive an email within 5 minutes, please check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}   