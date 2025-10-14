"use client";
import { FaHospital, FaBell, FaAmbulance, FaHeartbeat } from 'react-icons/fa';

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaHospital className="w-12 h-12 text-red-600" />,
      number: "01",
      title: 'Hospital Requests',
      description: 'Hospitals submit blood requests with urgency levels and required blood types.'
    },
    {
      icon: <FaBell className="w-12 h-12 text-red-600" />,
      number: "02",
      title: 'Smart Matching',
      description: 'Our system identifies and notifies the nearest eligible donors based on location and blood type.'
    },
    {
      icon: <FaHeartbeat className="w-12 h-12 text-red-600" />,
      number: "03",
      title: 'Donor Response',
      description: 'Donors receive notifications and can quickly respond to urgent requests.'
    },
    {
      icon: <FaAmbulance className="w-12 h-12 text-red-600" />,
      number: "04",
      title: 'Life-Saving Impact',
      description: 'Hospitals receive timely blood supply, and donors are rewarded for their contributions.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">How HemoLink Works</h2>
          <p className="text-xl text-gray-600">A simple, efficient process to save lives</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="text-center p-8 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl h-full">
                {/* Number Badge */}
                <div className="absolute -top-4 -right-4 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-full shadow-md group-hover:shadow-lg transition-shadow">
                    {step.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              
              {/* Connecting Arrow */}
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="text-red-300 text-3xl font-bold">→</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
