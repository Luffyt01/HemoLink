// components/HydrationWrapper.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHydrationStore } from '@/lib/hydration'
import { usePathname, useSearchParams } from 'next/navigation'

export default function HydrationWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { _hasHydrated, setHydrated } = useHydrationStore()
  const [showLoader, setShowLoader] = useState(true)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Skip hydration if already hydrated or not on client side
    if (_hasHydrated || typeof window === 'undefined') {
      setShowLoader(false)
      return
    }

    // Check if this is the initial page load
    const isInitialLoad = performance.navigation.type === performance.navigation.TYPE_NAVIGATE ||
                         performance.navigation.type === performance.navigation.TYPE_RELOAD

    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setHydrated(true)
        setShowLoader(false)
      }, 1500) // Adjust timing as needed
      
      return () => clearTimeout(timer)
    } else {
      // For client-side navigation, skip loading
      setHydrated(true)
      setShowLoader(false)
    }
  }, [_hasHydrated, setHydrated, pathname, searchParams])

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
          >
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Loading your experience...
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="mx-auto mt-6 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always render children but control visibility */}
      <div className={showLoader ? 'invisible' : 'visible'}>
        {children}
      </div>
    </>
  )
}