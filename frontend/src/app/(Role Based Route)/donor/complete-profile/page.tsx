'use client'

import { useState } from "react"

import { toast } from "sonner"
import { completeDonorProfile } from '@/actions/donor/donor-complete-profile'
import DonorProfileForm from "@/components/donor/DonorProfileFormSteps"

export default function CompleteProfilePage() {

  const [isGeolocating, setIsGeolocating] = useState(false)


  // Handle form submission success/error
  // const handleFormAction = (state: any) => {
  //   if (state?.error) {
  //     toast.error(state.error)
  //   } else if (state?.success) {
  //     toast.success("Profile completed successfully!")
  //     window.location.href = '/donor/complete-profile'
  //   }
  //   return state
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
        
          <h1 className="text-4xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-700">
            Become a Life Saver
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Complete your profile to start helping others
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <DonorProfileForm 
            
            isGeolocating={isGeolocating}
            setIsGeolocating={setIsGeolocating}
            formAction={completeDonorProfile}
            // onFormAction={handleFormAction}
          />
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your information is securely stored and never shared without consent.</p>
        </div>
      </div>
    </div>
  )
}