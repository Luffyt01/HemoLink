"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Home, Clock, Hospital, User, Menu, Droplet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { ProfileModal } from "./profile/profile-modal"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const newRequestsCount = 3 // This would come from your data

  const routes = [
    { href: "/donor/dashboard", label: "Dashboard", icon: Home },
    { href: "/donor/history", label: "History", icon: Clock },
    { href: "/donor/requests", label: "Requests", icon: Hospital },
  ]

  return (
    <>
      {/* Desktop/Large Screen Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
       <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-7" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 p-4 border-b">
                    <Droplet className="h-6 w-6 text-red-600" />
                    <span className="font-bold text-lg">HemoLink</span>
                  </div>
                  <nav className="flex-1 flex flex-col gap-1 p-4">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg text-lg font-medium transition-colors",
                          pathname === route.href 
                            ? "bg-primary/10 text-primary" 
                            : "text-muted-foreground hover:bg-accent"
                        )}
                      >
                        <route.icon className="h-5 w-5" />
                        {route.label}
                        {route.href === "/donor/requests" && newRequestsCount > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {newRequestsCount}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/donor/dashboard" className="flex items-center gap-2">
              <Droplet className="h-6 w-6 text-red-600" />
              <span className="font-bold text-lg hidden md:inline-block">HemoLink</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === route.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative rounded-full hover:bg-accent/50"
              asChild
            >
              <Link href="/donor/requests">
                <Bell className="h-5 w-5" />
                {newRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    {newRequestsCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Link>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsProfileOpen(true)} 
              className="rounded-full hover:bg-accent/50"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || "/default-avatar.png"} />
                <AvatarFallback className="bg-accent">
                  {session?.user?.name?.charAt(0) || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>
      </header>

     

      {/* Profile Modal */}
      <ProfileModal open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  )
}