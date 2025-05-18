/** @format */

"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { FiHome, FiSearch, FiMail } from "react-icons/fi"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()

  const handleGoHome = () => {
    router.push("/")
  }

  // const handleSearch = () => {
  //   router.push("/search")
  // }

  const handleContact = () => {
    window.location.href = "mailto:rockysheoran72@gmail.com?subject=404 Page Issue"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-background text-foreground text-center"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="max-w-2xl w-full space-y-8"
      >
        <div className="relative h-64 w-full">
          <Image
            src="/404-illustration.svg"
            alt="404 Not Found"
            fill
            priority
            className="object-contain"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold tracking-tight">Page Not Found</h1>
          <p className="text-lg text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="lg"
            className="gap-2 cursor-pointer"
          >
              <FiSearch className="h-5 w-5" />
            Refesh Page
          </Button>
          <Button
            onClick={handleGoHome}
            size="lg"
            className="gap-2 cursor-pointer"
          >
            <FiHome className="h-5 w-5" />
            Return Home
          </Button>
          <Button
            onClick={handleContact}
            variant="ghost"
            size="lg"
            className="gap-2 cursor-pointer "
          >
            <FiMail className="h-5 w-5" />
            Contact Support
          </Button>
        </motion.div>

        <motion.div
          className="mt-12 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p>Error code: 404</p>
          <p className="mt-1">If you believe this is a mistake, please let us know.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}