// lib/hydration.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface HydrationState {
  _hasHydrated: boolean
  setHydrated: (hydrated: boolean) => void
}

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
    }),
    {
      name: 'hydration-store',
    }
  )
)