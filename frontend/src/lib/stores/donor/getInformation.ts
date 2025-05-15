import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

type BloodType = 
  | "A_POSITIVE" | "A_NEGATIVE" 
  | "B_POSITIVE" | "B_NEGATIVE"
  | "AB_POSITIVE" | "AB_NEGATIVE"
  | "O_POSITIVE" | "O_NEGATIVE";


type Role = "USER" | "DONOR" | "HOSPITAL" | "ADMIN";

interface Location {
  coordinates: number[];

}

interface UserProfile {
  id: string;
  name: string;
  age: number;
  address: string;
  user: {
      id: string;
      email: string;
      phone: string;
      createdAt: string;
      profileComplete: boolean;
      role: Role;

  }
 
  bloodType?: BloodType;
  location?: Location;
  lastDonation?: string;
  available?: boolean;
}

interface DonorInformationStore1 {
  userProfile: UserProfile | null;
  
  
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  clearUserProfile: () => void;
 
}

export const donorInformationStore = create<DonorInformationStore1>()(
  devtools(
    persist(
      (set, get) => ({
        userProfile: null,
        
        
        setUserProfile: (profile) => {
          set(
            { 
              userProfile: profile,
              
            },
            false,
            'user/setUserProfile'
          );
        },
        
        updateUserProfile: (updates) => {
          const { userProfile } = get();
          if (!userProfile) return;
          
          set(
            { 
              userProfile: {
                ...userProfile,
                ...updates
              }
            },
            false,
            'user/updateUserProfile'
          );
        },
        
        clearUserProfile: () => {
          set(
            { 
              userProfile: null,
              
            },
            false,
            'user/clearUserProfile'
          );
        },
       
        
        
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ 
          userProfile: state.userProfile 
        }),
      }
    ),
    {
      name: 'UserStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);