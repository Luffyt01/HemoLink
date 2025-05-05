// lib/persistConfig.ts
import { StateStorage } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import { useHydrationStore } from './hydration';

interface PersistConfig<T> {
    name: string;
    storage: StateStorage;
    partialize: (state: T) => Partial<T>;
    onRehydrateStorage: () => (state: T | undefined) => void;
}

export const createPersistConfig = <T>(name: string, whitelist?: (keyof T)[]): PersistConfig<T> => ({
    name,
    storage: createJSONStorage(() => localStorage) as unknown as StateStorage,
    partialize: (state: T): Partial<T> => {
        if (whitelist) {
            return whitelist.reduce((acc, key) => {
                acc[key] = state[key];
                return acc;
            }, {} as Partial<T>);
        }
        return state;
    },
    onRehydrateStorage: (): ((state: T | undefined) => void) => (state: T | undefined): void => {
        if (state) {
            // When all stores are hydrated, mark as complete
            useHydrationStore.getState().setHydrated(true);
        }
    },
});