"use client"

import { Donor_data_fetch } from "@/actions/donor/Donor_data_fetch";
import { DashboardPage } from "@/components/donor/dashboard/dashboard_page";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import useSWR from "swr";


export default function DonorDashboard() {
  const {session} = useAuthStore();
  const donorId = session?.user?.id as string;
  const accessToken = session?.token as string;

  const { data, error, isLoading } = useSWR(
    `/api/donor/dashboard/${donorId}`,
    async () => {
      const response = await Donor_data_fetch({donorId,accessToken});
      if(response.status !== 200  || response.data === null){
        throw new Error(response.message || "Failed to fetch donor data");
      }
      return response.data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      onSuccess: (data) => {
        console.log("Donor data loaded:", data);
      },
      onError: (error) => {
        console.error("Donor data error:", error);
      },
    }
  );
  return (
    <div>
      <DashboardPage />
    </div>
  );
}