"use client";
import { signupAction } from "@/actions/auth/signUp_Action";
import { GoogleSubmitBtn } from "@/components/CommanComponents/GoogleSubmitBtn";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FaHandHoldingHeart, FaHospital } from "react-icons/fa";
import { toast } from "sonner";

export default function SignupPage() {
  const [role, setRole] = useState<"DONOR" | "HOSPITAL">("DONOR");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  interface FormState {
    message: string;
    status: number;
    errors: {
      role?: string[];
      phone?: string[];
      email?: string[];
      password?: string[];
      confirmPassword?: string[];
    };
  }

  const intial: FormState = {
    errors: {},
    message: "",
    status: 0,
  };

  const [state, fromAction] = useActionState<FormState>(signupAction, intial);

  const handleGoogleSignIn = async () => {
    setGooglePending(true);
    try {
      await signIn("google", {
        redirect: true,
        callbackUrl: "/",
        role: role,
      });
    } catch (error) {
      toast.error("Google sign-in failed");
    } finally {
      setGooglePending(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-rose-50 via-red-50 to-amber-50 flex items-center justify-center p-0">
      {/* Container - switches layout at md breakpoint */}
      <div className="h-full w-full md:h-[90vh] md:max-h-[800px] md:w-[90vw] md:max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Mobile Top Image (hidden on md+) */}
        <div className="relative h-32 w-full md:hidden">
          <Image
            src={role === "DONOR" ? "/donor-hero.jpg" : "/donor-hero.jpg"}
            alt={role === "DONOR" ? "Blood donor hero" : "Hospital staff"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
            <h1 className="text-2xl font-bold text-white">
              {role === "DONOR" ? "Become a Lifesaver" : "Join Our Network"}
            </h1>
          </div>
        </div>

        {/* Desktop Side Image (hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-rose-500 to-red-600">
          <Image
            src={role === "DONOR" ? "/donor-hero.jpg" : "/donor-hero.jpg"}
            alt={role === "DONOR" ? "Blood donor hero" : "Hospital staff"}
            fill
            className=" opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent flex items-center p-10">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {role === "DONOR"
                  ? "Join Our Hero Community"
                  : "Connect With Donors"}
              </h1>
              <p className="text-lg text-white/90">
                {role === "DONOR"
                  ? "Your registration starts a journey of saving lives through blood donation."
                  : "Register your hospital to access our network of committed blood donors."}
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-red-700 bg-clip-text text-transparent">
              Join HemoLink
            </h1>
            <p className="mt-2 text-gray-600">Create your account to begin</p>
          </div>

          {/* Role Selection */}
          <div className="flex mb-6 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setRole("DONOR")}
              className={`flex-1 py-1 md:py-3 px-2 md:px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
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
              className={`flex-1 py-1 md:py-3 px-2 md:px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                role === "HOSPITAL"
                  ? "bg-gradient-to-r from-rose-100 to-red-100 shadow-md text-rose-700 font-medium"
                  : "text-gray-600 hover:bg-rose-50"
              }`}
            >
              <FaHospital className="text-red-600" />
              Hospital Staff
            </button>
          </div>
          {state?.errors?.role && (
            <p className="text-xs text-red-500 text-center mb-2">
              {state.errors.role}
            </p>
          )}

          <form action={fromAction} className="space-y-4">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="your@email.com"
              />
              {state?.errors?.email && (
                <p className="text-xs text-red-500 mt-1">
                  {state.errors.email}
                </p>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                placeholder="+1 234 567 8900"
              />
              {state.errors?.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {state.errors?.phone}
                </p>
              )}
            </div>

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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
                >
                  {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                </button>
              </div>
              {state.errors?.password && (
                <p className="text-xs text-red-500 mt-1">
                  {state.errors?.password}
                </p>
              )}
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <IoEye size={20} />
                  ) : (
                    <IoEyeOff size={20} />
                  )}
                </button>
              </div>
              {state.errors?.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {state.errors?.confirmPassword}
                </p>
              )}
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

          {/* Google Sign-In */}
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full h-12 rounded-xl border-gray-300 hover:bg-rose-50 transition-colors"
            disabled={googlePending}
          >
            <GoogleSubmitBtn
              pending={googlePending}
              setPending={setGooglePending}
            />
          </Button>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/signIn"
              className="font-medium text-rose-600 hover:text-rose-500 transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full h-12 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all ${
        pending ? "opacity-75" : "hover:from-rose-700 hover:to-red-700"
      }`}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
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
        "Register"
      )}
    </button>
  );
}
