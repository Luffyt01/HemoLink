"use client";
import { FaShieldAlt, FaMapMarkerAlt, FaBell, FaHandHoldingHeart } from 'react-icons/fa';

export default function Features() {
  const features = [
    {
      icon: <FaShieldAlt className="w-10 h-10 text-red-600" />,
      title: 'Secure & Reliable',
      description: 'Your data is protected with bank-level security measures.',
      color: 'from-red-50 to-red-100'
    },
    {
      icon: <FaMapMarkerAlt className="w-10 h-10 text-red-600" />,
      title: 'Location-Based Matching',
      description: 'Quickly connect with the nearest available donors.',
      color: 'from-pink-50 to-pink-100'
    },
    {
      icon: <FaBell className="w-10 h-10 text-red-600" />,
      title: 'Instant Notifications',
      description: 'Get real-time alerts for urgent blood requirements.',
      color: 'from-orange-50 to-orange-100'
    },
    {
      icon: <FaHandHoldingHeart className="w-10 h-10 text-red-600" />,
      title: 'Rewards Program',
      description: 'Earn rewards and recognition for your life-saving contributions.',
      color: 'from-rose-50 to-rose-100'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose HemoLink?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is designed to make blood donation simple, efficient, and rewarding for everyone involved.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
