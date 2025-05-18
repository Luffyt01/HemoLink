"use client"
import { useState } from 'react';
import { NewRequestDialog } from './NewRequestDialog';
import { RequestTables } from './RequestTables';
import { Request } from './types';
import { Button } from '@/components/ui/button';

export default function DonationRequestPage() {
  const [activeRequests, setActiveRequests] = useState<Request[]>([
    {
      id: "req-001",
      hospitalId: "hosp-123",
      hospitalName: "City General Hospital",
      bloodType: "A_POSITIVE",
      unitsRequired: 5,
      urgency: "HIGH",
      location: {
        coordinates: [-73.935242, 40.730610],
        type: "Point"
      },
      createdAt: "2023-06-15T10:30:00Z",
      expiryTime: "2023-06-20T10:30:00Z",
      status: "PENDING"
    },
    {
      id: "req-002",
      hospitalId: "hosp-123",
      hospitalName: "City General Hospital",
      bloodType: "O_NEGATIVE",
      unitsRequired: 3,
      urgency: "MEDIUM",
      location: {
        coordinates: [-73.935242, 40.730610],
        type: "Point"
      },
      createdAt: "2023-06-16T14:45:00Z",
      expiryTime: "2023-06-21T14:45:00Z",
      status: "PENDING"
    }
  ]);

  const [completedRequests, setCompletedRequests] = useState<Request[]>([
    {
      id: "req-003",
      hospitalId: "hosp-123",
      hospitalName: "City General Hospital",
      bloodType: "B_POSITIVE",
      unitsRequired: 2,
      urgency: "LOW",
      location: {
        coordinates: [-73.935242, 40.730610],
        type: "Point"
      },
      createdAt: "2023-06-10T09:15:00Z",
      expiryTime: "2023-06-15T09:15:00Z",
      status: "FULFILLED"
    }
  ]);

  const handleSubmitNewRequest = (values: any) => {
    const newRequest: Request = {
      id: `req-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      hospitalId: "hosp-123",
      hospitalName: "City General Hospital",
      bloodType: values.bloodType,
      unitsRequired: values.unitsRequired,
      urgency: values.urgency,
      location: values.location,
      createdAt: new Date().toISOString(),
      expiryTime: values.expiryTime,
      status: "PENDING"
    };
    setActiveRequests([...activeRequests, newRequest]);
  };

  return (
    <div className="min-h-screen  md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with connection-focused messaging */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text  ">
            LifeLink Blood Network
          </h1>
          <p className="mt-3 text-gray-700 max-w-2xl mx-auto">
            Connecting hospitals with compassionate donors to save lives through timely blood donations
          </p>
          
          {/* Stats bar showing impact */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className=" p-3 rounded-lg shadow-sm border border-red-100 flex items-center">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Requests</p>
                <p className="font-semibold text-red-700">{activeRequests.length}</p>
              </div>
            </div>
            
            <div className=" p-3 rounded-lg shadow-sm border border-red-200 flex items-center">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="font-semibold text-red-700">{completedRequests.length}</p>
              </div>
            </div>
            
            {/* <div className="bg-white p-3 rounded-lg shadow-sm border border-red-100 flex items-center">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Potential Donors</p>
                <p className="font-semibold text-red-700">42</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Action section with clear CTA */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold text-red-800">Create New Blood Request</h2>
            <p className="text-gray-600">Submit your hospital's blood needs to connect with donors</p>
          </div>
          <NewRequestDialog onSubmit={handleSubmitNewRequest} />
        </div>

        {/* Request Tables with enhanced visual connection cues */}
        <RequestTables 
          activeRequests={activeRequests} 
          completedRequests={completedRequests} 
        />
        
        {/* Donor connection footer */}
        <div className="mt-12 bg-white rounded-xl p-6 border border-red-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-red-800">Need more donor connections?</h3>
              <p className="text-gray-600 mt-1">Broadcast your request to our entire donor network</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Broadcast to Donors
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}