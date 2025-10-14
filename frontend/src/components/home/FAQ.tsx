"use client";
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-6 flex justify-between items-center text-left hover:text-red-600 transition-colors"
      >
        <span className="text-lg font-semibold text-gray-800">{question}</span>
        {isOpen ? (
          <FaChevronUp className="w-5 h-5 text-red-600 flex-shrink-0 ml-4" />
        ) : (
          <FaChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
        )}
      </button>
      {isOpen && (
        <div className="pb-6 text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "When will HemoLink be available?",
      answer: "HemoLink is launching soon! We're currently in the final stages of development and testing. Register now to be among the first to access the platform and receive exclusive early member benefits."
    },
    {
      question: "How will donors be compensated?",
      answer: "When we launch, hospitals will provide monetary compensation ranging from ₹500 to ₹2000 per donation. Additionally, donors will receive recognition badges, certificates, and exclusive health benefits from our partner organizations."
    },
    {
      question: "What makes HemoLink different from other platforms?",
      answer: "HemoLink combines AI-powered smart matching, instant notifications, donor rewards, and a focus on emergency response. Our target is under 30 minutes response time, making it the fastest and most rewarding blood donation platform."
    },
    {
      question: "How can I register as an early member?",
      answer: "Simply click on 'Join as Early Donor' or 'Register Your Hospital' buttons and complete the registration form. Early members will get priority access and exclusive founding member benefits when we launch."
    },
    {
      question: "Will my data be secure?",
      answer: "Absolutely. We're implementing bank-level security measures to protect all user data. Your personal information, medical history, and donation records will be encrypted and stored with the highest security standards."
    },
    {
      question: "Can hospitals register now?",
      answer: "Yes! Hospitals can register now to be part of our network at launch. Early partner hospitals will receive premium features and priority support to help save more lives faster."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Everything you need to know about joining HemoLink</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
