"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import { ProfileView } from "./ProfileView"
import { EditProfile } from "./EditProfile"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Donor } from "@/lib/types"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [donor, setDonor] = useState<Donor | null>(null)
  const { data: session, update } = useSession()

  // Initialize donor data
  useEffect(() => {
    if (open) {
      // Simulate loading from API
      const timer = setTimeout(() => {
        setDonor({
          name: session?.user?.name || "John Doe",
          email: session?.user?.email || "john@example.com",
          phone: session?.user?.phone || "+1 (555) 123-4567",
          bloodType: "O+",
          address: "123 Main St, Anytown, USA",
          isAvailable: true,
          location: { lat: 28.6139, lng: 77.209 }
        })
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [open, session])

  const handleSubmit = async (data: Donor) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          phone: data.phone
        }
      })

      setDonor(data)
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
      console.error("Update error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset to view mode when closing
    setTimeout(() => setIsEditing(false), 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full sm:max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-2xl flex items-center gap-2">
            {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {isEditing ? "Edit Profile" : "Your Profile"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {!donor ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : isEditing ? (
            <EditProfile 
              donor={donor} 
              onCancel={() => setIsEditing(false)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          ) : (
            <ProfileView 
              donor={donor} 
              onEdit={() => setIsEditing(true)} 
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}