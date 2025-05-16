"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Home,
  Clock,
  Hospital,
  Menu,
  Droplet,
  User,
  LogOut,
  Settings,
  Edit,
  Stethoscope,
  Users,
  ClipboardList,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// import { ProfileModal } from "./profile/profile-modal"
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ThemeToggle } from "@/components/CommanComponents/theme-toggle";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import logout_Action from "@/actions/auth/logout_Action";
import { toast } from "sonner";

import removeGlobalData from "@/components/CommanComponents/RemoveGlobalData";
import { hospitalInformationStore } from "@/lib/stores/hostpital/getInfromationHospital";
import { Hospital_Profile_Modal } from "./profile/Hospital_Profile_Modal";

export function HospitalNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
 
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const {hospitalProfile} = hospitalInformationStore.getState();
  const {session} = useAuthStore.getState();

  // Mock data for notifications
  const urgentRequestsCount = 2;
  const pendingApprovalsCount = 1;

  const routes = [
    { href: "/hospital/dashboard", label: "Dashboard", icon: Home },
    { href: "/hospital/donors", label: "Donors", icon: Users },
    {
      href: "/hospital/requests",
      label: "Blood Requests",
      icon: ClipboardList,
    },
    // { href: "/hospital/inventory", label: "Inventory", icon: Droplet },
    // { href: "/hospital/activities", label: "Activities", icon: Activity },
    { href: "/hospital/history", label: "History", icon: Clock },
  ];
  

  const handleLogout = async() => {
    if(!session?.token){  
      toast.error("You are not logged in");
      await signOut({ redirect: true, callbackUrl: "/signIn" });
      setIsLogoutDialogOpen(false);
      return;
    }
    const response  = await logout_Action({token:session?.token})
    if(response?.status === 200){
      toast.success(response?.message)
        await signOut({redirect:true,callbackUrl:"/signIn"})
      removeGlobalData(); 
      setIsLogoutDialogOpen(false);
    }
    else{
      toast.error(response?.message)
    }
  };

  useEffect(() => {
    if (!isProfileOpen && !isLogoutDialogOpen && dropdownTriggerRef.current) {
      dropdownTriggerRef.current.focus();
      setDropdownOpen(false);
    }
  }, [isProfileOpen, isLogoutDialogOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-7" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                <VisuallyHidden asChild>
                  <h2>Hospital Navigation Menu</h2>
                </VisuallyHidden>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center gap-2 p-6 border-b">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Hospital className="h-6 w-6 text-blue-600" />
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "text-2xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent",
                        "drop-shadow-[0_2px_4px_rgba(239,68,68,0.25)]",
                        "hover:drop-shadow-[0_4px_8px_rgba(239,68,68,0.4)] transition-all duration-300"
                      )}
                    >
                      HemoLink
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="ml-1 text-xs font-normal text-red-600/80 align-super"
                      >
                        ®
                      </motion.span>
                    </motion.span>
                  </div>
                  <nav className="flex-1 flex flex-col gap-1 p-4">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg text-lg font-medium transition-all duration-200",
                          pathname === route.href
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:shadow-xs"
                        )}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-3"
                        >
                          <route.icon className="h-5 w-5" />
                          {route.label}
                          {route.href === "/hospital/requests" &&
                            urgentRequestsCount > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                                className="ml-auto"
                              >
                                <Badge variant="destructive">
                                  {urgentRequestsCount}
                                </Badge>
                              </motion.div>
                            )}
                        </motion.div>
                      </Link>
                    ))}
                  </nav>
                  <div className="p-4 border-t">
                    <ThemeToggle />
                  </div>
                </motion.div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link
              href="/hospital/dashboard"
              className="flex items-center gap-2"
            >
              <motion.div
                whileHover={{ rotate: -15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Hospital className="h-6 w-6 text-blue-600" />
              </motion.div>
             
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  " font-bold text-2xl hidden md:inline-block tracking-tight bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent",
                  "drop-shadow-[0_2px_4px_rgba(239,68,68,0.25)]",
                  "hover:drop-shadow-[0_4px_8px_rgba(239,68,68,0.4)] transition-all duration-300"
                )}
              >
                HemoLink
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="ml-1 text-xs font-normal text-red-600/80 align-super"
                >
                  ®
                </motion.span>
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                    pathname === route.href
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground hover:shadow-xs"
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2"
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                    {route.href === "/hospital/requests" &&
                      urgentRequestsCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-1"
                        >
                          <Badge
                            variant="destructive"
                            className="h-5 w-5 p-0 flex items-center justify-center"
                          >
                            {urgentRequestsCount}
                          </Badge>
                        </motion.span>
                      )}
                  </motion.div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-accent/50"
                asChild
              >
                <Link href="/hospital/notifications">
                  <Bell className="h-5 w-5" />
                  {(urgentRequestsCount > 0 || pendingApprovalsCount > 0) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center"
                    >
                      {urgentRequestsCount + pendingApprovalsCount}
                    </motion.span>
                  )}
                </Link>
              </Button>
            </motion.div>

            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <ThemeToggle />
            </motion.div>

            {/* Profile Dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild ref={dropdownTriggerRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-accent/50 relative"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <motion.div
                    animate={{
                      x: dropdownOpen ? -5 : 0,
                      rotate: dropdownOpen ? -5 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={session?.user?.image} />
                      <AvatarFallback className="bg-accent">
                        {hospitalProfile?.hospitalName?.charAt(0) || (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <AnimatePresence>
                {dropdownOpen && (
                  <DropdownMenuContent
                    asChild
                    align="end"
                    className="w-64 p-2 rounded-lg shadow-lg border bg-background"
                    sideOffset={8}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    forceMount
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DropdownMenuLabel className="px-2 py-1.5 text-sm font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {hospitalProfile?.hospitalName || "Hospital Staff"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {hospitalProfile?.user?.email || "hospital@medicare.com"}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => {
                            setIsProfileOpen(true);
                            setDropdownOpen(false);
                          }}
                          className="px-2 py-1.5 cursor-pointer rounded-md hover:bg-accent"
                        >
                          <motion.div
                            whileHover={{ x: 2 }}
                            className="flex items-center"
                          >
                            <User className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
                          </motion.div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="px-2 py-1.5 cursor-pointer rounded-md hover:bg-accent"
                          asChild
                        >
                          <Link href="/hospital/settings">
                            <motion.div
                              whileHover={{ x: 2 }}
                              className="flex items-center"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Hospital Settings</span>
                            </motion.div>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuItem
                        onClick={() => {
                          setIsLogoutDialogOpen(true);
                          setDropdownOpen(false);
                        }}
                        className="px-2 py-1.5 cursor-pointer rounded-md text-red-600 hover:bg-red-50 hover:text-red-600"
                      >
                        <motion.div
                          whileHover={{ x: 2 }}
                          className="flex items-center"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </motion.div>
                      </DropdownMenuItem>
                    </motion.div>
                  </DropdownMenuContent>
                )}
              </AnimatePresence>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <Hospital_Profile_Modal 
        open={isProfileOpen} 
        onOpenChange={(open) => {
          setIsProfileOpen(open)
          if (!open) {
            setTimeout(() => dropdownTriggerRef.current?.focus(), 100)
          }
        }} 
      />

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={(open) => {
          setIsLogoutDialogOpen(open);
          if (!open) {
            setTimeout(() => dropdownTriggerRef.current?.focus(), 100);
          }
        }}
      >
        <AlertDialogContent className="rounded-lg max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to sign out of the hospital management
                system?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer"
                >
                  <Button variant="outline">Cancel</Button>
                </motion.div>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <Button variant="destructive">Logout</Button>
                </motion.div>
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
