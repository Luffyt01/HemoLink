"use client";
import { FaDollarSign, FaTrophy, FaGift, FaStar } from 'react-icons/fa';

export default function RewardsSection() {
  const rewards = [
    {
      icon: <FaDollarSign className="w-10 h-10 text-yellow-600" />,
      title: "Monetary Compensation",
      description: "Hospitals provide financial compensation to donors for their time and contribution",
      highlight: "₹500 - ₹2000"
    },
    {
      icon: <FaTrophy className="w-10 h-10 text-yellow-600" />,
      title: "Recognition Program",
      description: "Earn badges and certificates for your life-saving contributions",
      highlight: "5+ Levels"
    },
    {
      icon: <FaGift className="w-10 h-10 text-yellow-600" />,
      title: "Exclusive Benefits",
      description: "Access to health checkups, priority medical services, and partner discounts",
      highlight: "20+ Partners"
    },
    {
      icon: <FaStar className="w-10 h-10 text-yellow-600" />,
      title: "Donor Ranking",
      description: "Climb the leaderboard and get featured as a community hero",
      highlight: "Top 100"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-amber-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-yellow-400 text-gray-800 px-6 py-2 rounded-full font-bold mb-4">
            ✨ COMING SOON
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Donor Rewards Program</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every donation will be rewarded and recognized. Here's what you can earn as a HemoLink donor.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rewards.map((reward, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                {reward.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-center text-gray-800">{reward.title}</h3>
              <p className="text-gray-600 text-center mb-4">{reward.description}</p>
              <div className="text-center">
                <span className="inline-block bg-yellow-100 text-yellow-800 font-semibold px-4 py-2 rounded-full text-sm">
                  {reward.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
