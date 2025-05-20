"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import HospitalProfileForm from "@/components/hospital/CompleteProfile/HospitalFormSteps";
import { completeHospitalProfile } from "@/actions/Hospital/Hospital-Complete-Profile";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useRouter } from "next/router";

export default function CompleteHospitalProfilePage() {
 
  const [isGeolocating, setIsGeolocating] = useState(false);

  // Handle form submission success/error
  // const handleFormAction = (state: any) => {
  //   if (state?.error) {
  //     toast.error(state.error);
  //   } else if (state?.fieldErrors) {
  //     // Display the first field error if available
  //     const firstError = Object.values(state.fieldErrors)[0]?.[0];
  //     if (firstError) {
  //       toast.error(firstError);
  //     }
  //   } else if (state?.success) {
  //     toast.success("Hospital profile completed successfully!1111111111111111111111");
  //     // window.location.href = "/hospital/dashboard";
  //   }
  //   return state;
  // };
  const {session} = useAuthStore();
  const router = useRouter();
  useEffect(()=>{
    if(session?.user.profileComplete === true){
      router.push("/hospital/dashboard")
    }
  },[router])


  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8  ">
          <h1 className="text-4xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            Register Your Hospital
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Complete your hospital profile to join our network
          </p>
        </div>

        {/* Form Container */}
        <div className=" rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <HospitalProfileForm
          
            isGeolocating={isGeolocating}
            setIsGeolocating={setIsGeolocating}
            formAction={completeHospitalProfile}
            // onFormAction={handleFormAction}
          />
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Your hospital information will be verified before being published.
          </p>
          <p className="mt-1">
            All data is securely stored and compliant with healthcare regulations.
          </p>
        </div>
      </div>
    </div>
  );
}