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
  Trash,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../../CommanComponents/theme-toggle";
import { ProfileModal } from "./profile/profile-modal";
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
import { useAuthStore } from "@/lib/stores/useAuthStore";
import logout_Action from "@/actions/auth/logout_Action";
import { toast } from "sonner";
import { donorInformationStore } from "@/lib/stores/donor/getInformation";
import { DeleteAccountMenuItem } from "./profile/DeleteAccountMenuItem";

export function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const { session } = useAuthStore.getState();
  const { clearSession } = useAuthStore.getState();
  const { userProfile } = donorInformationStore.getState();

  const newRequestsCount = 3;

  const routes = [
    { href: "/donor/dashboard", label: "Dashboard", icon: Home },
    { href: "/donor/history", label: "History", icon: Clock },
    { href: "/donor/requests", label: "Requests", icon: Hospital },
  ];
  //! when user logout clear the session and the other data
  const clearData = () => {
    clearSession();
  };

  const handleLogout = async () => {
    if (!session?.token) {
      return;
    }

    const response = await logout_Action({ token: session?.token });
    if (response?.status === 200) {
      toast.success(response?.message);
      clearData();
      signOut({ redirect: true, callbackUrl: "/signin" });
      setIsLogoutDialogOpen(false);
    } else {
      toast.error(response?.message);
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
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-7" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                <VisuallyHidden asChild>
                  <h2>Navigation Menu</h2>
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
                      <Droplet className="h-6 w-6 text-red-600" />
                    </motion.div>
                    <span className="font-bold text-lg">HemoLink</span>
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
                          {route.href === "/donor/requests" &&
                            newRequestsCount > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                                className="ml-auto"
                              >
                                <Badge variant="destructive">
                                  {newRequestsCount}
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

            <Link href="/donor/dashboard" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: -15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Droplet className="h-6 w-6 text-red-600" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-bold text-lg hidden md:inline-block"
              >
                HemoLink
              </motion.span>
            </Link>

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
                    {route.href === "/donor/requests" &&
                      newRequestsCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-1"
                        >
                          <Badge
                            variant="destructive"
                            className="h-5 w-5 p-0 flex items-center justify-center"
                          >
                            {newRequestsCount}
                          </Badge>
                        </motion.span>
                      )}
                  </motion.div>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-accent/50"
                asChild
              >
                <Link href="/donor/requests">
                  <Bell className="h-5 w-5" />
                  {newRequestsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center"
                    >
                      {newRequestsCount}
                    </motion.span>
                  )}
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} >
              <ThemeToggle />
            </motion.div>

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
                        {userProfile?.name?.charAt(0) || (
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
                            {userProfile?.name || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {userProfile?.user?.email}
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
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Account</span>
                          </motion.div>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="my-1" />

                      <DropdownMenuItem
                       
                       onClick={() => {
                        setIsDeleteAccountOpen(true);
                        setDropdownOpen(false);
                      }}
                      className="px-2 py-1.5 cursor-pointer rounded-md hover:bg-accent"
                    >
                        
                        <motion.div
                          whileHover={{ x: 2 }}
                          className="flex items-center "
                        >
                          <Trash2 className="mr-2 text-red-600 h-4 w-4" />
                          <span>Delete Account</span>
                        </motion.div>
                      </DropdownMenuItem>
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

      <ProfileModal
        open={isProfileOpen}
        onOpenChange={(open) => {
          setIsProfileOpen(open);
          if (!open) {
            setTimeout(() => dropdownTriggerRef.current?.focus(), 100);
          }
        }}
      />
      <DeleteAccountMenuItem
         open={isDeleteAccountOpen}
         onOpenChange={(open) => {
           setIsDeleteAccountOpen(open);
           if (!open) {
             setTimeout(() => dropdownTriggerRef.current?.focus(), 100);
           }
         }}
      />

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
                Are you sure you want to sign out?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer"
                >
                  <Button variant="outline" className="cursor-pointer">Cancel</Button>
                </motion.div>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <Button variant="destructive" className="cursor-pointer ">Logout</Button>
                </motion.div>
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
