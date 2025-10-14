"use client";
import { useSession } from "next-auth/react";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import HowItWorks from "../components/home/HowItWorks";
import EmergencyProcess from "../components/home/EmergencyProcess";
import Features from "../components/home/Features";
import LaunchTimeline from "../components/home/LaunchTimeline";
import RewardsSection from "../components/home/RewardsSection";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import CallToAction from "../components/home/CallToAction";

export default function Home() {
  const { data: session } = useSession();
  console.log("session", session);
  
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Stats />
      <HowItWorks />
      <EmergencyProcess />
      <LaunchTimeline />
      <Features />
      <RewardsSection />
      <Testimonials />
      <FAQ />
      <CallToAction />
    </main>
  );
}
