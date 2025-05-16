"use client"

import { Donor_data_fetch } from "@/actions/donor/Donor_data_fetch"
import { DashboardPage } from "@/components/donor/dashboard/dashboard_page"
import { donorInformationStore } from "@/lib/stores/donor/getInformation"
import { useAuthStore } from "@/lib/stores/useAuthStore"
import { toast } from "sonner"
import useSWR from "swr"

export default function DonorDashboard() {
  const { session } = useAuthStore()
  const donorId = session?.user?.id as string
  const accessToken = session?.token as string
  const { userProfile, setUserProfile } = donorInformationStore()

  const { data, error, isLoading } = useSWR(
    // Only fetch if userProfile is not available
    userProfile ? null : `/api/donor/dashboard/${donorId}`,
    async () => {
      const response = await Donor_data_fetch({ accessToken })
      if (response.status !== 200 || response.data === null) {
        throw new Error(response.message || "Failed to fetch donor data")
      }
      return response.data
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 1,
      errorRetryInterval: 15000,
      onSuccess: (data) => {
        console.log("Donor data loaded:", data)
        setUserProfile(data)
        toast.success("Donor data loaded successfully")
      },
      onError: (error) => {
        console.error("Donor data error:", error)
        toast.error(error.message || "Failed to load donor data")
      },
    }
  )

  return (
    <div>
      <DashboardPage />
    </div>
  )
}