"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "./Icon"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { hospitalInformationStore } from "@/lib/stores/hostpital/getInfromationHospital"
import { useEffect, useState } from "react"
import { useMediaQuery } from "./use-media-query"

interface HospitalProfile {
  id: string;
  hospitalName: string;
  user: {
    id: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    profileComplete: boolean;
  };
  hospitalType: string;
  establishmentYear: number;
  mainPhoneNo: string;
  emergencyPhoneNo: string;
  website: string;
  workingHours: string;
  hospitalStatus: string;
  licenceNumber: string;
  serviceArea: {
    coordinates: [number, number];
  };
  address: string;
  description: string;
  verificationStatus: string;
}

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const hospitalTypeColors: Record<string, string> = {
  GENERAL_HOSPITAL: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  TEACHING_HOSPITAL: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  SPECIALTY_HOSPITAL: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CHILDREN_HOSPITAL: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  TRAUMA_CENTER: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  CANCER_CENTER: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  BLOOD_BANK: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
}

const statusColors: Record<string, string> = {
  OPENED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  CLOSED: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
}

const verificationColors: Record<string, string> = {
  VERIFIED: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export function Hospital_Profile_Modal({ open, onOpenChange }: ProfileModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { hospitalProfile } = hospitalInformationStore();
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    onOpenChange(false);
  }

  if (!isMounted || !hospitalProfile) return null;

  const formattedDate = new Date(hospitalProfile.user?.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "max-h-[95vh] overflow-y-auto rounded-lg border shadow-xl",
        "w-[95vw] max-w-none sm:max-w-2xl",
        "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
        "border-gray-200 dark:border-gray-700"
      )}>
        <AnimatePresence>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            transition={{ duration: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Header Section */}
            <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6 text-pretty break-all wrap-anywhere">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <Icons.hospital className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white line-clamp-2">
                      {hospitalProfile.hospitalName}
                    </DialogTitle>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      ID: {hospitalProfile.id}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn(
                    "text-xs sm:text-sm font-semibold px-2 py-0.5 sm:px-3 sm:py-1",
                    statusColors[hospitalProfile.hospitalStatus] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  )}>
                    {hospitalProfile.hospitalStatus.toLowerCase()}
                  </Badge>
                  <Badge className={cn(
                    "text-xs sm:text-sm font-semibold px-2 py-0.5 sm:px-3 sm:py-1",
                    verificationColors[hospitalProfile.verificationStatus] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  )}>
                    {hospitalProfile.verificationStatus.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className=" pb-4 sm:px-6 sm:pb-6 text-pretty break-all space-y-4 sm:space-y-6 wrap-anywhere">
              {/* Basic Information Section */}
              <motion.section 
                variants={cardVariants}
                className="bg-white dark:bg-gray-800/50 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white mb-3 sm:mb-4">
                  <div className="p-1 rounded sm:p-1.5 sm:rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                    <Icons.info className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { label: "Hospital Type", value: (
                      <Badge className={cn(
                        "text-xs sm:text-sm font-semibold px-2 py-0.5 sm:px-3 sm:py-1",
                        hospitalTypeColors[hospitalProfile.hospitalType] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      )}>
                        {hospitalProfile.hospitalType.replace(/_/g, ' ').toLowerCase()}
                      </Badge>
                    )},
                    { label: "Established Year", value: hospitalProfile.establishmentYear },
                    { label: "Account Created", value: formattedDate },
                    { label: "Licence Number", value: hospitalProfile.licenceNumber }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="space-y-0.5 sm:space-y-1"
                    >
                      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                      <div className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                        {item.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Contact Information Section */}
              <motion.section 
                variants={cardVariants}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800/50 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white mb-3 sm:mb-4">
                  <div className="p-1 rounded sm:p-1.5 sm:rounded-md bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
                    <Icons.contact className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { 
                      label: "Main Phone", 
                      value: hospitalProfile.mainPhoneNo,
                      icon: <Icons.phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />,
                      href: `tel:${hospitalProfile.mainPhoneNo}`
                    },
                    { 
                      label: "Emergency Phone", 
                      value: hospitalProfile.emergencyPhoneNo,
                      icon: <Icons.emergency className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />,
                      href: `tel:${hospitalProfile.emergencyPhoneNo}`
                    },
                    { 
                      label: "Email", 
                      value: hospitalProfile.user?.email,
                      icon: <Icons.mail className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />,
                      href: `mailto:${hospitalProfile.user?.email}`
                    },
                    { 
                      label: "Website", 
                      value: hospitalProfile.website,
                      icon: <Icons.globe className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />,
                      href: hospitalProfile.website.startsWith('http') ? hospitalProfile.website : `https://${hospitalProfile.website}`
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                      className="space-y-0.5 sm:space-y-1"
                    >
                      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                      <a 
                        href={item.href} 
                        target={item.label === "Website" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 group"
                      >
                        <span className="p-1 rounded bg-gray-100 dark:bg-gray-700">
                          {item.icon}
                        </span>
                        <span className="text-sm text-pretty break-all sm:text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors truncate">
                          {item.value}
                        </span>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Service Information Section */}
              <motion.section 
                variants={cardVariants}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800/50 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white mb-3 sm:mb-4">
                  <div className="p-1 rounded sm:p-1.5 sm:rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300">
                    <Icons.services className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  Service Information
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-0.5 sm:space-y-1"
                  >
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Working Hours</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                      {hospitalProfile.workingHours}
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="space-y-0.5 sm:space-y-1"
                  >
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                    <div className="flex items-start gap-2">
                      <div className="p-1 rounded bg-gray-100 dark:bg-gray-700 mt-0.5">
                        <Icons.mapPin className="h-4 w-4 text-rose-500" />
                      </div>
                          <p className="text-sm sm:text-base font-semibold text-pretty break-all break-words text-gray-800 dark:text-gray-200">
                        {hospitalProfile.address}
                    
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-0.5 sm:space-y-1"
                  >
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Coordinates</p>
                    <p className="text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-100 dark:border-gray-700">
                      {hospitalProfile.serviceArea.coordinates[0]}, {hospitalProfile.serviceArea.coordinates[1]}
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="space-y-0.5 sm:space-y-1"
                  >
                    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                    <p className="text-sm text-gray-700 break-words text-pretty break-all dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded border border-gray-100 dark:border-gray-700">
                      {hospitalProfile.description}
                      
                    </p>
                  </motion.div>
                </div>
              </motion.section>
            </div>

            {/* Footer Actions */}
            <motion.div 
              className="px-4 pb-4 sm:px-6 sm:pb-6 flex justify-end gap-2 sm:gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-base border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}