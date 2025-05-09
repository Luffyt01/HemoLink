"use client"

import Link from "next/link"
import { History, Home, Droplet, User, Settings, Bell } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

import {Clock, Hospital, Menu } from "lucide-react"

export function MobileNavbar({ pathname, newRequestsCount }: { pathname: string, newRequestsCount: number }) {
  const routes = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/history", label: "History", icon: Clock },
    { href: "/requests", label: "Requests", icon: Hospital, badge: newRequestsCount },
  ]

  return (
    <div className="fixed bottom-0  left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex pl-3 h-16 items-center justify-around">
        {routes.map((route) => (
          <Button 
            asChild 
            variant="ghost" 
            size="icon" 
            key={route.href}
            className={`relative ${pathname === route.href ? "text-primary" : "text-muted-foreground"}`}
          >
            <Link href={route.href} className="flex flex-col pl-3  items-center gap-1">
              <route.icon className="h-5 w-5" />
              <span className="text-xs">{route.label}</span>
              {route.badge && route.badge > 0 && (
                <span className="absolute top-0 right-2 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                  {route.badge}
                </span>
              )}
            </Link>
          </Button>
        ))}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`flex flex-col items-center gap-1 ${pathname === "/profile" ? "text-primary" : "text-muted-foreground"}`}
          asChild
        >
          <Link href="/profile">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}