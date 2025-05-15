
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

type HospitalType = 
  | "GENERAL_HOSPITAL" 
  | "TEACHING_HOSPITAL" 
  | "SPECIALTY_HOSPITAL" 
  | "CHILDREN_HOSPITAL" 
  | "TRAUMA_CENTER" 
  | "CANCER_CENTER" 
  | "BLOOD_BANK" 
  | "RESEARCH_HOSPITAL" 
  | "COMMUNITY_HOSPITAL" 
  | "GOVERNMENT_HOSPITAL" 
  | "PRIVATE_HOSPITAL" 
  | "MILITARY_HOSPITAL";

type HospitalStatus = "OPENED" | "CLOSED";


type userRole = "USER" | "DONOR" | "HOSPITAL" | "ADMIN";

interface Location {
    coordinates: number[];
  }

  type VerificationStatus = "VERIFIED" | "PENDING" | "REJECTED";
    
  

interface HospitalProfile {
  id: string;
  hospitalName: string;
  user: {
    id: string;
    email: string;
    phone: string;
    role: userRole;
    createdAt: string;
    profileComplete: boolean;
  };
  hospitalType: HospitalType;
  establishmentYear: number;
  mainPhoneNo: string;
  emergencyPhoneNo: string;
  website: string;
  workingHours: string;
  hospitalStatus: HospitalStatus;
  licenceNumber: string;
  serviceArea: Location;
  address: string;
  description: string;
  verificationStatus: VerificationStatus;
}

interface HospitalInformationStore {
  hospitalProfile: HospitalProfile | null;
  setHospitalProfile: (profile: HospitalProfile) => void;
  updateHospitalProfile: (updates: Partial<HospitalProfile>) => void;
  clearHospitalProfile: () => void;
}

export const hospitalInformationStore = create<HospitalInformationStore>()(
  devtools(
    persist(
      (set, get) => ({
        hospitalProfile: null,
        
        setHospitalProfile: (profile) => {
          set(
            { 
              hospitalProfile: profile,
            },
            false,
            'hospital/setHospitalProfile'
          );
        },
        
        updateHospitalProfile: (updates) => {
          const { hospitalProfile } = get();
          if (!hospitalProfile) return;
          
          set(
            { 
              hospitalProfile: {
                ...hospitalProfile,
                ...updates
              }
            },
            false,
            'hospital/updateHospitalProfile'
          );
        },
        
        clearHospitalProfile: () => {
          set(
            { 
              hospitalProfile: null,
            },
            false,
            'hospital/clearHospitalProfile'
          );
        },
      }),
      {
        name: 'hospital-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ 
          hospitalProfile: state.hospitalProfile 
        }),
      }
    ),
    {
      name: 'HospitalStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);