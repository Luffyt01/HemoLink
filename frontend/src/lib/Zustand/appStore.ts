// lib/stores/appStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AppState = {
  _hasHydrated: boolean
  user: {
    id: string
    name: string
    email: string
  } | null
  settings: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

type AppActions = {
  setHydrated: (hydrated: boolean) => void
  setUser: (user: AppState['user']) => void
  updateSettings: (settings: Partial<AppState['settings']>) => void
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      // Initial state
      _hasHydrated: false,
      user: null,
      settings: {
        theme: 'light',
        notifications: true
      },

      // Actions
      setHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
      setUser: (user) => set({ user }),
      updateSettings: (settings) => set((state) => ({ 
        settings: { ...state.settings, ...settings } 
      }))
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
      partialize: (state) => ({
        _hasHydrated: state._hasHydrated,
        user: state.user,
        settings: state.settings
      })
    }
  )
)

// Selector hooks for optimized re-renders
export const useUser = () => useAppStore((state) => state.user)
export const useSettings = () => useAppStore((state) => state.settings)
export const useHydrationStatus = () => useAppStore((state) => state._hasHydrated)