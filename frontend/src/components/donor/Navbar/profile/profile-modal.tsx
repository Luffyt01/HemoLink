"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import { ProfileView } from "./ProfileView"
import { EditProfile } from "./EditProfile"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { data: session } = useSession()

  const donor = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: session?.user?.phone || "",
    bloodType: "O+",
    address: "123 Main St, Anytown",
    isAvailable: true,
    location: { lat: 28.6139, lng: 77.209 }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}  >
      <DialogContent className="w-full!  sm:max-w-5xl h-[90vh] flex m-0 flex-col">
        <DialogHeader className=" sm:px-2 pt-2 pb-0">
          <DialogTitle className="text-2xl">
            {isEditing ? "Edit Profile" : "Your Profile"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1  mx-0 overflow-y-auto px-0 sm:px-2 pb-3">
          {isEditing ? (
            <EditProfile 
              donor={donor} 
              onCancel={() => setIsEditing(false)}
               onSubmit={async (data) => {
                // Handle form submission here
                console.log(data)
                setIsEditing(false)
              }}
              
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