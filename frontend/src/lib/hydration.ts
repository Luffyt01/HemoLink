// lib/hydration.ts
import { create } from 'zustand';

interface HydrationState {
  _hasHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

export const useHydrationStore = create<HydrationState>(set => ({
  _hasHydrated: false,
  setHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
}));

export function waitForHydration() {
  return new Promise<void>((resolve) => {
    const unsubscribe = useHydrationStore.subscribe(
      (state) => {
        if (state._hasHydrated) {
          unsubscribe();
          resolve();
        }
      }
    );
  });
}