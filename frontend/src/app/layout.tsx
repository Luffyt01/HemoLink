import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientSessionProvider from "./Provider/ClientSessionProvider";
import { Toaster } from "sonner";
import HydrationWrapper from "@/components/CommanComponents/HydrationWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HemoLink",
    template: "%s | HemoLink",
  },
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || 
    process.env.VERCEL_URL || 
    "http://localhost:3000"
  ),
  description: "A platform connecting blood donors with hospitals through real-time matching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientSessionProvider>
          <HydrationWrapper>

          <main className="flex-1 overflow-x-hidden md:mt-0">
            {children}
          </main>
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              classNames: {
                toast: "font-sans",
              },
            }}
            />
            </HydrationWrapper>
        </ClientSessionProvider>
      </body>
    </html>
  );
}