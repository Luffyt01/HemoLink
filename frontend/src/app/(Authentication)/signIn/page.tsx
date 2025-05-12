"use client";
import LoginForm from "@/components/authForms/signInForm";
import { motion } from "framer-motion";
import Image from "next/image";


export default function LoginPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-screen bg-gradient-to-br from-rose-50 via-red-50 to-amber-50 flex items-center justify-center p-0"
    >
      {/* Main container with responsive layout */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="h-full w-full md:h-[90vh] md:max-h-[700px] md:w-[90vw] md:max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* Mobile Top Image (hidden on desktop) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative h-32 w-full md:hidden"
        >
           <Image
          src="/donor-hero.jpg"
          alt="Blood donor hero image"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          quality={80}
        />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl font-bold text-white"
            >
              Save Lives Today
            </motion.h1>
          </div>
        </motion.div>

        {/* Desktop Side Image (hidden on mobile) */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-rose-500 to-red-600"
        >
          <Image
          src="/donor-hero.jpg"
          alt="Blood donor hero image"
          fill
          className="object-fill"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          quality={80}
        />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent flex items-center p-10">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-white mb-4">
                Give the Gift of Life
              </h1>
              <p className="text-lg text-white/90 ">
                Your blood donation can save up to 3 lives. Join our community of heroes today.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Form Content - Now a separate component */}
        <LoginForm />
      </motion.div>
    </motion.div>
  );
}