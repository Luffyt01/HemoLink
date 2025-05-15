"use client"

import fetchHospitalData from "@/actions/Hospital/Hostpital_data_fetch";
import Hospital_dashboard_page from "@/components/hospital/dashboard/dashboard_page"
import { donorInformationStore } from "@/lib/stores/donor/getInformation";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { toast } from "sonner";
import useSWR from "swr";

export default function dashboard() {
  const {session} = useAuthStore();
  const donorId = session?.user?.id as string;
  const accessToken = session?.token as string;
  const {userProfile,setUserProfile}=donorInformationStore()



  const { data, error, isLoading } = useSWR(
    userProfile ? null : `/api/hospital/dashboard/${donorId}`,
    async () => {
      
      const response = await fetchHospitalData({accessToken});
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
        setUserProfile(data);
        toast.success("Hospital data loaded successfully");
      },
      onError: (error) => {
        console.error("Donor data error:", error);
      },
    }
  );

  return (
    <div className="">
      
       <Hospital_dashboard_page/>
    </div>
  )
}
