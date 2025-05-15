import { useAuthStore } from "@/lib/stores/useAuthStore";
import { hospitalInformationStore } from "@/lib/stores/hostpital/getInfromationHospital";
import { donorInformationStore } from "@/lib/stores/donor/getInformation";

const {clearSession} = useAuthStore.getState();
  const {clearHospitalProfile} = hospitalInformationStore.getState();
  const {clearUserProfile} = donorInformationStore.getState();
  //! when user logout clear the session and the other data
  const removeGlobalData=()=>{
    clearSession();
    clearHospitalProfile();
    clearUserProfile();
  }
  export default removeGlobalData;