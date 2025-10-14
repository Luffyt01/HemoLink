"use client";
import { FaExclamationTriangle, FaSearch, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

export default function EmergencyProcess() {
  const processes = [
    {
      icon: <FaExclamationTriangle className="w-8 h-8 text-red-600" />,
      step: "Step 1",
      title: "Emergency Request",
      description: "Hospital submits an urgent blood request with specific blood type and urgency level"
    },
    {
      icon: <FaSearch className="w-8 h-8 text-red-600" />,
      step: "Step 2",
      title: "Smart Matching Algorithm",
      description: "System analyzes donor history, location, and availability to find the best matches"
    },
    {
      icon: <FaEnvelope className="w-8 h-8 text-red-600" />,
      step: "Step 3",
      title: "Instant Notifications",
      description: "Nearest eligible donors receive email and push notifications immediately"
    },
    {
      icon: <FaCheckCircle className="w-8 h-8 text-red-600" />,
      step: "Step 4",
      title: "Donation & Reward",
      description: "Donor responds, saves a life, and receives monetary compensation from hospital"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Emergency Response System</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our intelligent system ensures rapid response during critical situations
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processes.map((process, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  {process.icon}
                </div>
                <div className="text-sm font-semibold text-red-600 mb-2">{process.step}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="text-red-400 text-2xl">→</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
