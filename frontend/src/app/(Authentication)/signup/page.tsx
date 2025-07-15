"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";
import SignupForm from "@/components/authForms/signUpForm";


export default function SignupPage() {
  const [role, setRole] = useState<"DONOR" | "HOSPITAL">("DONOR");
  const [googlePending, setGooglePending] = useState(false);

  const handleGoogleSignIn = async () => {
    setGooglePending(true);
    try {
      // await signIn("google", { redirect: true, callbackUrl: "/" });
    } catch (error) {
      toast.error("Google sign-in failed");
    } finally {
      setGooglePending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen w-screen bg-gradient-to-br from-rose-50 via-red-50 to-amber-50 flex items-center justify-center p-0"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-full w-full md:h-[90vh] md:max-h-[800px] md:w-[90vw] md:max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* Image Section */}
        <div className="relative h-32 w-full md:hidden">
          <Image
            src="/donor-hero.jpg"
            alt={role === "DONOR" ? "Blood donor hero" : "Hospital staff"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
            <motion.h1
              key={role}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold text-white"
            >
              {role === "DONOR" ? "Become a Lifesaver" : "Join Our Network"}
            </motion.h1>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-rose-500 to-red-600">
          <Image
            src="/donor-hero.jpg"
            alt={role === "DONOR" ? "Blood donor hero" : "Hospital staff"}
            fill
            className="object-fill"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent flex items-center p-10">
            <motion.div
              key={role}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1 className="text-4xl font-bold text-white mb-4">
                {role === "DONOR"
                  ? "Join Our Hero Community"
                  : "Connect With Donors"}
              </h1>
              <p className="text-lg text-white/90">
                {role === "DONOR"
                  ? "Your registration starts a journey of saving lives."
                  : "Register your hospital to access our donor network."}
              </p>
            </motion.div>
          </div>
        </div>
       

        {/* Form Section */}
        <SignupForm
          role={role}
          setRole={setRole}
          onGoogleSignIn={handleGoogleSignIn}
          googlePending={googlePending}
          setGooglePending={setGooglePending}
        />
      </motion.div>
    </motion.div>
  );
}
