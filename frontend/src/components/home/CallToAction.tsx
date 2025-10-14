"use client";
import Link from 'next/link';
import { FaHandHoldingHeart, FaHospital } from 'react-icons/fa';

export default function CallToAction() {
  return (
    <section className="relative bg-gradient-to-r from-red-700 via-red-600 to-pink-600 text-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
               backgroundSize: '50px 50px'
             }}>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        <div className="inline-block bg-yellow-400 text-red-700 px-6 py-2 rounded-full font-bold mb-6 animate-pulse">
          🚀 EARLY ACCESS REGISTRATION OPEN
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Be Part of the Revolution
        </h2>
        <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto text-pink-50">
          Join us in building the future of emergency blood supply. Register now and be among the first.
        </p>
        <p className="text-lg mb-10 max-w-2xl mx-auto text-pink-100">
          Early members get exclusive rewards and recognition.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            href="/signup" 
            className="group bg-white hover:bg-pink-50 text-red-700 font-bold py-4 px-10 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <FaHandHoldingHeart className="w-6 h-6 group-hover:animate-bounce" />
            Register as Donor
          </Link>
          <Link 
            href="/signup" 
            className="bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-20 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <FaHospital className="w-6 h-6" />
            Register Hospital
          </Link>
        </div>
        
        <div className="mt-12 text-pink-100">
          <p className="text-sm">🎯 Coming Soon • 💰 Earn While Saving Lives • 🏆 Exclusive Early Member Benefits</p>
        </div>
      </div>
    </section>
  );
}
