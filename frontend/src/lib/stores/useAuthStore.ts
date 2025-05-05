import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';


interface CustomUser {
  id: string;
  token?: string;
  phone?: string | null;
  email: string;
  role?: string;
  provider?: string;
  googleId?: string | null;
  profileComplete?: boolean;
}

interface CustomSession {
  token?: string;
  user: CustomUser;
  expires?: string;
}

interface AuthStore {
  session: CustomSession | null;
 
  setSession: (session: CustomSession) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
 
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        session: null,
        loading: false,
        error: null,
        
        setSession: (session) => {
          set(
            { 
              session,
            },
            false,
            'auth/setSession' // Action name for DevTools
          );
        },
        
        clearSession: () => {
          set(
            { 
              session: null,
              error: null,
              loading: false 
            },
            false,
            'auth/clearSession'
          );
        },
        
        isAuthenticated: () => {
          const { session } = get();
          if (!session) return false;
          if (session.expires) {
            return new Date(session.expires) > new Date();
          }
          return true;
        },
        
       
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ session: state.session }),
      }
    ),
    {
      name: 'AuthStore', // Name to show in DevTools
      enabled: process.env.NODE_ENV === 'development', // Only in dev
    }
  )
);

