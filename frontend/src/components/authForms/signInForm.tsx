"use client";
import { GoogleSubmitBtn } from "@/components/CommanComponents/GoogleSubmitBtn";
import { Button } from "@/components/ui/button";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FaHandHoldingHeart, FaHospital } from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { CustomSession } from "@/app/api/auth/[...nextauth]/options";
import { ArrowRight } from "lucide-react";
import { hospitalInformationStore } from "@/lib/stores/hostpital/getInfromationHospital";
import { donorInformationStore } from "@/lib/stores/donor/getInformation";
import removeGlobalData from "../CommanComponents/RemoveGlobalData";





export default function LoginForm() {
  const [role, setRole] = useState<"DONOR" | "HOSPITAL">("DONOR");
  const [showPassword, setShowPassword] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(()=>{
    // removeGlobalData();
  },[])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Get Zustand actions at the component level, not inside the handler
    const { setSession } = useAuthStore.getState();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userRole = formData.get("userRole") as string;

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        // role: userRole, // Make sure your auth API handles this
      });

      if (result?.error) {
        toast.error(
          result.error.includes("credentials")
            ? "Invalid email or password"
            : result.error
        );
        return;
      }

      // Get the updated session after successful sign-in
      const session = await getSession();

      if (!session?.user) {
        throw new Error("No user data in session");
      }
      

      // Prepare session data for storage
      const customSession: CustomSession = {
        token: session.token, // Make sure your session actually has a token
        user: {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
          phone: session.user.phone,
          profileComplete: session.user.profileComplete,
          // Add other necessary user fields
        },
        expires: session.expires, // If available
      };

      // Store session in Zustand
      setSession(customSession);

      toast.success("Login successful!");

      // Handle redirection
      if (session.user.role) {
        const basePath = session.user.role.toLowerCase();
        const profileComplete = session.user.profileComplete === true;

        router.push(
          profileComplete
            ? `/${basePath}/dashboard`
            : `/${basePath}/complete-profile`
        );
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGooglePending(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
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
      <Header />

      <RoleToggle role={role} setRole={setRole} />

      <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
        <input type="hidden" name="userRole" value={role} />

        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          delay={1.3}
        />

        <PasswordField
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        <div className="mt-3 text-end">
          <Link
            href="/forgot-password"
            className=" text-sm font-medium text-black hover:text-black/90 transition-colors duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2  rounded-sm inline-flex items-center group
    "
          >
            Forgot password?
            <ArrowRight className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <SubmitButton isLoading={isLoading} />
      </form>

      <Divider />

      <GoogleSignInButton
        pending={googlePending}
        setPending={setGooglePending}
        onClick={handleGoogleSignIn}
      />

      <SignUpLink />
    </motion.div>
  );
}

// Reusable Components (keep the same as before)
const Header = () => (
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
);

const RoleToggle = ({
  role,
  setRole,
}: {
  role: "DONOR" | "HOSPITAL";
  setRole: (role: "DONOR" | "HOSPITAL") => void;
}) => (
  <motion.div
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 1.2 }}
    className="flex mb-6 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 p-1 shadow-inner"
  >
    {(["DONOR", "HOSPITAL"] as const).map((r) => (
      <button
        key={r}
        type="button"
        onClick={() => setRole(r)}
        className={`flex-1 py-1 md:py-3 px-2 md:px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
          role === r
            ? "bg-gradient-to-r from-rose-100 to-red-100 shadow-md text-rose-700 font-medium"
            : "text-gray-600 hover:bg-rose-50"
        }`}
      >
        {r === "DONOR" ? (
          <FaHandHoldingHeart className="text-rose-600" />
        ) : (
          <FaHospital className="text-red-600" />
        )}
        {r === "DONOR" ? "I'm a Donor" : "Hospital Staff"}
      </button>
    ))}
  </motion.div>
);

const FormField = ({
  label,
  name,
  type,
  placeholder,
  delay,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  delay: number;
}) => (
  <motion.div
    initial={{ x: -10, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay }}
  >
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      name={name}
      type={type}
      required
      className="w-full px-4 py-3 text-black rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-200"
      placeholder={placeholder}
    />
  </motion.div>
);

const PasswordField = ({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}) => (
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
        className="w-full px-4 py-3 text-black rounded-xl border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all duration-200 pr-12"
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
  </motion.div>
);

const SubmitButton = ({ isLoading }: { isLoading: boolean }) => (
  <motion.button
    type="submit"
    disabled={isLoading}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    className={`w-full h-12 cursor-pointer  rounded-xl bg-gradient-to-r mt-2 from-rose-600 to-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 ${
      isLoading ? "opacity-75" : "hover:from-rose-700 hover:to-red-700"
    }`}
  >
    {isLoading ? (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2"
      >
        <Spinner />
        Signing in...
      </motion.span>
    ) : (
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Sign In
      </motion.span>
    )}
  </motion.button>
);

const Spinner = () => (
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
);

const Divider = () => (
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
);

const GoogleSignInButton = ({
  pending,
  setPending,
  onClick,
}: {
  pending: boolean;
  setPending: (pending: boolean) => void;
  onClick: () => void;
}) => (
  <motion.div
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 1.7 }}
    className=" w-full h-12 rounded-xl cursor-pointer bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:border-red-400 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full h-12 rounded-xl cursor-pointer bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:border-red-400 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >

      <GoogleSubmitBtn pending={pending} setPending={setPending} />
    </Button>
  </motion.div>
);

const SignUpLink = () => (
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
);
