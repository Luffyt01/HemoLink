"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { HeartPulse } from 'lucide-react'
import { useState, useEffect, useActionState, startTransition } from 'react'
import { format, addDays } from 'date-fns'
import { HospitalNewRequestAction } from '@/actions/Hospital/new_request_all_action/HospitalNewRequestAction'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { toast } from 'sonner'

const formSchema = z.object({
  bloodType: z.enum(["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"]),
  unitsRequired: z.number().min(1).max(100),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]),
  token: z.string().optional(),
  expiryTime: z.string().refine(val => {
    const date = new Date(val)
    const now = new Date()
    return date > now
  }, "Expiry time must be in the future")
})

interface NewRequestDialogProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void
}

export function NewRequestDialog({ onSubmit }: NewRequestDialogProps) {
  const [open, setOpen] = useState(false)
  const [minExpiryDate, setMinExpiryDate] = useState('')
  const [state, formAction, isPending] = useActionState(HospitalNewRequestAction, null)
  const session = useAuthStore()

  // Format datetime-local input value from ISO string
  const formatForInput = (date: Date | string) => {
    const d = new Date(date)
    return format(d, "yyyy-MM-dd'T'HH:mm")
  }

  // Format ISO string from datetime-local input value
  const formatForSubmission = (dateString: string) => {
    return new Date(dateString).toISOString()
  }

  useEffect(() => {
    if (state?.status === 200) {
      toast.success(state.message)
      setOpen(false)
    }
    if (state?.status === 400) {
      toast.error(state.message)
      setOpen(false)
    }
    if (state?.status === 500) {
      toast.error(state.message)
      setOpen(false)
    }
  }, [state])
  
  useEffect(() => {
    // Set minimum expiry date to current time + 1 hour
    const now = new Date()
    now.setHours(now.getHours() + 1)
    setMinExpiryDate(formatForInput(now))
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodType: "A_POSITIVE",
      unitsRequired: 1,
      urgency: "MEDIUM",
      token: session.session?.token,
      expiryTime: formatForInput(addDays(new Date(), 5)) // Default to 5 days from now
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Convert datetime-local to ISO string before submission
      const submissionValues = {
        ...values,
        expiryTime: formatForSubmission(values.expiryTime),
        token: session.session?.token
      }

      console.log("Submitting:", submissionValues)
      
      startTransition(async () => {
        await formAction(submissionValues)
      })

      onSubmit(submissionValues)
      form.reset()
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Failed to prepare submission data")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg">
          <HeartPulse className="mr-2 h-4 w-4" />
          New Blood Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <HeartPulse className="text-red-600" />
            Create Blood Donation Request
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Blood Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-muted">
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="A_POSITIVE" className="hover:bg-red-50">A+</SelectItem>
                        <SelectItem value="A_NEGATIVE" className="hover:bg-red-50">A-</SelectItem>
                        <SelectItem value="B_POSITIVE" className="hover:bg-red-50">B+</SelectItem>
                        <SelectItem value="B_NEGATIVE" className="hover:bg-red-50">B-</SelectItem>
                        <SelectItem value="AB_POSITIVE" className="hover:bg-red-50">AB+</SelectItem>
                        <SelectItem value="AB_NEGATIVE" className="hover:bg-red-50">AB-</SelectItem>
                        <SelectItem value="O_POSITIVE" className="hover:bg-red-50">O+</SelectItem>
                        <SelectItem value="O_NEGATIVE" className="hover:bg-red-50">O-</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitsRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Units Required</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        className="bg-muted border-border"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Urgency Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-muted">
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="LOW" className="hover:bg-green-50">Low</SelectItem>
                        <SelectItem value="MEDIUM" className="hover:bg-yellow-50">Medium</SelectItem>
                        <SelectItem value="HIGH" className="hover:bg-red-50">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Expiry Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="bg-muted border-border"
                        min={format(new Date(), "yyyy-MM-dd'T'HH:mm")} // Ensure current time is the minimum
                        {...field}
                        onChange={e => {
                          const selectedDate = new Date(e.target.value)
                          const now = new Date()
                          
                          if (selectedDate <= now) {
                            form.setError('expiryTime', {
                              type: 'manual',
                              message: 'Expiry time must be in the future'
                            })
                          } else {
                            form.clearErrors('expiryTime')
                            field.onChange(e.target.value)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                disabled={isPending}
              >
                {isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}