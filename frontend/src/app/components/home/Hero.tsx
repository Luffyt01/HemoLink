"use client";
import Link from 'next/link';
import { FaHeartbeat, FaHandHoldingHeart } from 'react-icons/fa';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-red-600 via-red-500 to-pink-600 py-24 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-white bg-opacity-20 p-4 rounded-full">
            <FaHeartbeat className="w-16 h-16 text-white animate-pulse" />
          </div>
        </div>
        
        <div className="inline-block bg-white bg-opacity-20 px-6 py-2 rounded-full mb-6">
          <span className="text-pink-100 font-semibold text-sm tracking-wide">🚀 LAUNCHING SOON • BE THE FIRST</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          The Future of
          <span className="block text-pink-100">Emergency Blood Supply</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-pink-50 mb-4 max-w-3xl mx-auto">
          Revolutionary platform connecting blood donors with hospitals instantly during critical emergencies.
        </p>
        <p className="text-lg text-pink-100 mb-10 max-w-2xl mx-auto">
          AI-powered matching • Instant notifications • Rewarded donations
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/register/donor" 
            className="group bg-white hover:bg-pink-50 text-red-600 font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <FaHandHoldingHeart className="w-5 h-5" />
            Join as Early Donor
          </Link>
          <Link 
            href="/register/hospital" 
            className="bg-transparent hover:bg-white hover:bg-opacity-10 text-white border-2 border-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Register Your Hospital
          </Link>
        </div>
        
        <div className="mt-12 text-pink-100 text-sm">
          🎯 Target: Under 30 minutes emergency response • 💰 Earn ₹500-₹2000 per donation
        </div>
      </div>
    </section>
  );
}
