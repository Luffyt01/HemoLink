"use client";
import { LoginAction } from "@/actions/auth/Login_Action";
import { GoogleSubmitBtn } from "@/components/CommanComponents/GoogleSubmitBtn";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FaHandHoldingHeart, FaHospital } from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginForm() {
  // State management
  const [role, setRole] = useState<"DONOR" | "HOSPITAL">("DONOR");
  const [showPassword, setShowPassword] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  // Form state interface
  interface FormState {
    message: string;
    status: number;
    errors: {
      email?: string[];
      password?: string[];
      role?: string[];
    };
  }

  // Initial form state
  const intial: FormState = {
    errors: {},
    message: "",
    status: 0,
  };

  // Form action handler
  const [state, fromAction] = useActionState<FormState>(LoginAction, intial);

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setGooglePending(true);
    try {
      await signIn("google", {
        redirect: true,
        callbackUrl: "/",
      });
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
      transition={{ delay: 0.8 }}
      className="flex-1 p-6 md:p-8 overflow-y-auto"
    >
      {/* Header section */}
      <div className="text-center mb-6">
        <motion.h1 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-red-700 bg-clip-text text-transparent"
        >
          Welcome to HemoLink
        </motion.h1>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-2 text-gray-600"
        >
          Sign in to continue your lifesaving journey
        </motion.p>
      </div>

      {/* Role Selection Toggle */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex mb-6 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 p-1 shadow-inner"
      >
        <button
          type="button"
          onClick={() => setRole("DONOR")}
          className={`flex-1 py-1 md:py-3 px-2 md:px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
            role === "DONOR"
              ? "bg-gradient-to-r from-rose-100 to-red-100 shadow-md text-rose-700 font-medium"
              : "text-gray-600 hover:bg-rose-50"
          }`}
        >
          <FaHandHoldingHeart className="text-rose-600" />
          I'm a Donor
        </button>
        <button
          type="button"
          onClick={() => setRole("HOSPITAL")}
          className={`flex-1 py-1 md:py-3 px-2 md:px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
            role === "HOSPITAL"
              ? "bg-gradient-to-r from-rose-100 to-red-100 shadow-md text-rose-700 font-medium"
              : "text-gray-600 hover:bg-rose-50"
          }`}
        >
          <FaHospital className="text-red-600" />
          Hospital Staff
        </button>
      </motion.div>

      {/* Login Form */}
      <form action={fromAction} className=" space-y-2 md:space-y-4">
        <input type="hidden" name="userRole" value={role} />

        {/* Email Field */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-200"
            placeholder="your@email.com"
          />
          {state?.errors?.email && (
            <motion.p 
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xs text-red-500 mt-1"
            >
              {state.errors.email}
            </motion.p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-200 pr-12"
              placeholder="••••••••"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
            >
              {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
            </motion.button>
          </div>
          {state.errors?.password && (
            <motion.p 
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xs text-red-500 mt-1"
            >
              {state.errors?.password}
            </motion.p>
          )}
        </motion.div>

        <SubmitButton />
      </form>

      {/* Divider */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="relative my-3 md:my-6"
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-gray-500">
            OR CONTINUE WITH
          </span>
        </div>
      </motion.div>

      {/* Google Sign-In Button */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.7 }}
      >
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full h-12 rounded-xl border-gray-300 hover:bg-rose-50 transition-colors duration-200"
          disabled={googlePending}
        >
          <GoogleSubmitBtn
            pending={googlePending}
            setPending={setGooglePending}
          />
        </Button>
      </motion.div>

      {/* Footer with signup link */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-6 text-center text-sm text-gray-600"
      >
        Don't have an account?{" "}
        <Link
          href="/signup"
          prefetch
          className="font-medium text-rose-600 hover:text-rose-500 transition-colors duration-200"
        >
          Sign up here
        </Link>
      </motion.div>
    </motion.div>
  );
}

// Submit Button Component
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <motion.button
      type="submit"
      disabled={pending}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`w-full h-12 rounded-xl bg-gradient-to-r mt-2 from-rose-600 to-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 ${
        pending ? "opacity-75" : "hover:from-rose-700 hover:to-red-700"
      }`}
    >
      {pending ? (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2"
        >
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Signing in...
        </motion.span>
      ) : (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Sign In
        </motion.span>
      )}
    </motion.button>
  );
}