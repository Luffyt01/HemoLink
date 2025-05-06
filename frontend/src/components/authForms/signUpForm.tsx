"use client";
import { signupAction } from "@/actions/auth/signUp_Action";
import { GoogleSubmitBtn } from "@/components/CommanComponents/GoogleSubmitBtn";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FaHandHoldingHeart, FaHospital } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { any } from "zod";
import { useRouter } from "next/navigation";

interface SignupFormProps {
  role: "DONOR" | "HOSPITAL";
  setRole: (role: "DONOR" | "HOSPITAL") => void;
  onGoogleSignIn: () => void;
  googlePending: boolean;
  setGooglePending: (pending: boolean) => void;
}

interface FormState {
  message: string;
  status: number;
  data?: any;
  errors?: {
    role?: string[];
    phone?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
}

export default function SignupForm({
  role,
  setRole,
  onGoogleSignIn,
  googlePending,
  setGooglePending,
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialState: FormState = {
    errors: {},
    message: "",
    status: 0,
    data:any,
  };
  const router = useRouter()
  const [state, formAction] = useActionState<FormState>(
    signupAction,
    initialState
  );
  useEffect(() => {
    console.log(state)
    if (!state) return
    
    if (state.status === 422) {
      const errorMessages = state.errors
        ? Object.entries(state.errors)
            .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
            .join('\n')
        : "Validation failed"
      // toast.error(errorMessages)
    } 
    else if (state.status === 500) {
      toast.error(state.message || "An error occurred")
    }
    else if (state.status === 400) {
      toast.error(state.message || "An error occurred")
    }
    else if (state.status === 200) {
      toast.success(state.message || "Account created successfully")
      setTimeout(() => {
        router.push('/signIn') // or your login route
      }, 700) //  .9 second delay to let user see the success message
    }
  }, [state])


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex-1 p-6 md:p-8 overflow-y-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-red-700 bg-clip-text text-transparent">
          Join HemoLink
        </h1>
        <p className="mt-2 text-gray-600">Create your account to begin</p>
      </div>

      {/* Role Toggle */}
      <div className="flex mb-6 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 p-1 shadow-inner">
        <motion.button
          whileHover={{ scale: 1.02 }}
          type="button"
          onClick={() => setRole("DONOR")}
          className={`flex-1 py-1 px-3 md:py-3 md:px-4  rounded-lg flex items-center justify-center gap-2 ${
            role === "DONOR"
              ? "bg-gradient-to-r from-rose-100 to-red-100 text-rose-700"
              : "text-gray-600"
          }`}
        >
          <FaHandHoldingHeart className="text-rose-600" />
          I'm a Donor
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          type="button"
          onClick={() => setRole("HOSPITAL")}
          className={`flex-1 py-1 px-3 md:py-3 md:px-4 rounded-lg flex items-center justify-center gap-2 ${
            role === "HOSPITAL"
              ? "bg-gradient-to-r from-rose-100 to-red-100 text-rose-700"
              : "text-gray-600"
          }`}
        >
          <FaHospital className="text-red-600" />
          Hospital Staff
        </motion.button>
      </div>

      {/* Form */}
      <form action={formAction} className=" space-y-2 md:space-y-4">
        <input type="hidden" name="userRole" value={role} />

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            placeholder="your@email.com"
          />
          <AnimatePresence>
            {state?.errors?.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500 mt-1"
              >
                {state.errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {/* Phone Number Field */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
            placeholder="+912345678900"
          />
          <AnimatePresence>
            {state.errors?.phone && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-red-500 mt-1"
              >
                {state.errors?.phone}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 pr-12"
              placeholder="••••••••"
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600"
              whileHover={{ scale: 1.1 }}
            >
              {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
            </motion.button>
          </div>
          <AnimatePresence>
            {state?.errors?.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500 mt-1"
              >
                {state.errors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 pr-12"
              placeholder="••••••••"
            />
            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600"
              whileHover={{ scale: 1.1 }}
            >
              {showConfirmPassword ? (
                <IoEye size={20} />
              ) : (
                <IoEyeOff size={20} />
              )}
            </motion.button>
          </div>
          <AnimatePresence>
            {state?.errors?.confirmPassword && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500 mt-1"
              >
                {state.errors.confirmPassword}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <SubmitButton />
      </form>

      {/* Divider */}
      <div className="relative my-3 md:my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-gray-500">
            OR CONTINUE WITH
          </span>
        </div>
      </div>

      {/* Google Sign In */}
      <Button
        variant="outline"
        onClick={onGoogleSignIn}
        className="w-full h-12 cursor-pointer  rounded-xl  border-gray-300 hover:bg-rose-50"
        disabled={googlePending}
      >
        <GoogleSubmitBtn
          pending={googlePending}
          setPending={setGooglePending}
        />
      </Button>

      {/* Footer Link */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/signIn"
          className="font-medium text-rose-600 hover:text-rose-500"
        >
          Sign in here
        </Link>
      </div>
    </motion.div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <motion.button
      type="submit"
      disabled={pending}
      className={`w-full h-12  cursor-pointer mt-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all ${
        pending ? "opacity-75" : "hover:from-rose-700 hover:to-red-700"
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {pending ? (
        <span className="flex items-center cursor-pointer  justify-center gap-2">
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
          Creating account...
        </span>
      ) : (
        "Sign Up"
      )}
    </motion.button>
  );
}
