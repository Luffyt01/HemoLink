"use client";
import { FaCheckCircle, FaRocket, FaStar, FaUsers } from 'react-icons/fa';

export default function LaunchTimeline() {
  const phases = [
    {
      icon: <FaCheckCircle className="w-8 h-8 text-green-500" />,
      phase: "Phase 1",
      title: "Platform Development",
      description: "Core features and infrastructure built",
      status: "Completed",
      statusColor: "bg-green-100 text-green-700"
    },
    {
      icon: <FaRocket className="w-8 h-8 text-blue-500 animate-bounce" />,
      phase: "Phase 2",
      title: "Registration Open",
      description: "Early access for donors and hospitals",
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-700"
    },
    {
      icon: <FaStar className="w-8 h-8 text-yellow-500" />,
      phase: "Phase 3",
      title: "Beta Testing",
      description: "Testing with select hospitals and donors",
      status: "Coming Soon",
      statusColor: "bg-yellow-100 text-yellow-700"
    },
    {
      icon: <FaUsers className="w-8 h-8 text-red-500" />,
      phase: "Phase 4",
      title: "Official Launch",
      description: "Full platform rollout and scaling",
      status: "Q2 2025",
      statusColor: "bg-red-100 text-red-700"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold mb-4">
            📅 LAUNCH ROADMAP
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Journey to Launch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track our progress as we build the future of emergency blood supply
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {phases.map((item, index) => (
            <div 
              key={index}
              className="relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Phase Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-200 px-4 py-1 rounded-full">
                <span className="text-sm font-bold text-gray-700">{item.phase}</span>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6 mt-4">
                <div className="bg-white p-4 rounded-full shadow-md">
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-center mb-3 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 text-center mb-4 text-sm">
                {item.description}
              </p>

              {/* Status */}
              <div className="flex justify-center">
                <span className={`${item.statusColor} px-4 py-2 rounded-full text-xs font-bold`}>
                  {item.status}
                </span>
              </div>

              {/* Connecting Line (except for last item) */}
              {index < phases.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🎉 Join Us on This Journey
            </h3>
            <p className="text-gray-700 mb-6 text-lg">
              Register now and become a founding member of the HemoLink community. 
              Early members will receive exclusive benefits, priority support, and recognition.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Founding Member Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Priority Access</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Exclusive Rewards</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Beta Testing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
