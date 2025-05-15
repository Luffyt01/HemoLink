"use client"

import fetchHospitalData from "@/actions/Hospital/Hostpital_data_fetch";
import Hospital_dashboard_page from "@/components/hospital/dashboard/dashboard_page"
import { hospitalInformationStore } from "@/lib/stores/hostpital/getInfromationHospital";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { toast } from "sonner";
import useSWR from "swr";

export default function dashboard() {
  const {session} = useAuthStore();
  const donorId = session?.user?.id as string;
  const accessToken = session?.token as string;
 const {hospitalProfile,setHospitalProfile}=hospitalInformationStore()



  const { data, error, isLoading } = useSWR(
    hospitalProfile ? null : `/api/hospital/dashboard/${donorId}`,
    async () => {
      
      const response = await fetchHospitalData({accessToken});
      if(response.status !== 200  || response.data === null){
          throw new Error(response.message || "Failed to fetch hospital data");
      }
      return response.data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      onSuccess: (data) => {

        console.log("Hospital data loaded:", data);
        setHospitalProfile(data);
        toast.success("Hospital data loaded successfully");
      },
      onError: (error) => {
        console.error("Hospital data error:", error);
      },
    }
  );

  return (
    <div className="">
      
       <Hospital_dashboard_page/>
    </div>
  )
}
