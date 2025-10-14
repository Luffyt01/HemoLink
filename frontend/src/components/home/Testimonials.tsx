"use client";
import { FaQuoteLeft, FaLightbulb, FaUsers, FaHospital } from 'react-icons/fa';

const visionStatements = [
  {
    quote: "Every minute counts in emergencies. HemoLink's vision to connect donors instantly with hospitals could revolutionize emergency healthcare.",
    author: "Healthcare Innovation",
    role: "Industry Insight",
    icon: <FaLightbulb className="text-yellow-500 text-3xl" />
  },
  {
    quote: "A platform that rewards donors while saving lives - this is the future of blood donation we've been waiting for.",
    author: "Medical Community",
    role: "Expert Opinion",
    icon: <FaUsers className="text-blue-500 text-3xl" />
  },
  {
    quote: "Smart matching algorithms combined with instant notifications could solve the critical challenge of blood shortage during emergencies.",
    author: "Hospital Networks",
    role: "Healthcare Sector",
    icon: <FaHospital className="text-red-500 text-3xl" />
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why HemoLink Matters</h2>
          <p className="text-xl text-gray-600">The vision driving our mission to save lives</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {visionStatements.map((statement, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-red-500"
            >
              <div className="flex items-center justify-between mb-4">
                <FaQuoteLeft className="text-red-300 text-4xl" />
                <div>
                  {statement.icon}
                </div>
              </div>
              <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">
                "{statement.quote}"
              </p>
              <div className="border-t pt-4">
                <p className="font-bold text-gray-800">{statement.author}</p>
                <p className="text-sm text-red-600">{statement.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
