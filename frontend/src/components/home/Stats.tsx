"use client";
import { FaRocket, FaBullseye, FaBolt, FaHeart } from 'react-icons/fa';

export default function Stats() {
  const stats = [
    {
      icon: <FaRocket className="w-10 h-10 text-white" />,
      text: "Launching Soon",
      label: "Be Among the First"
    },
    {
      icon: <FaBolt className="w-10 h-10 text-white" />,
      text: "< 30 min",
      label: "Target Response Time"
    },
    {
      icon: <FaBullseye className="w-10 h-10 text-white" />,
      text: "24/7",
      label: "Always Available"
    },
    {
      icon: <FaHeart className="w-10 h-10 text-white" />,
      text: "100%",
      label: "Commitment to Save Lives"
    }
  ];

  return (
    <section className="bg-gradient-to-r from-red-600 to-pink-600 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Join the Revolution in Blood Donation</h2>
          <p className="text-pink-100 text-lg">The future of emergency blood supply starts here</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="flex justify-center mb-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-full animate-pulse">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">{stat.text}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
