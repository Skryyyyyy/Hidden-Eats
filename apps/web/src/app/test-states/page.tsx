"use client";

import React, { useState } from 'react';
import { SearchX, Lock, Clock, PackageOpen, AlertTriangle } from 'lucide-react';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { NetworkStatus } from '@/components/ui/NetworkStatus';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FormFeedback, FormInputError } from '@/components/ui/FormFeedback';

export default function TestStatesPage() {
  const [networkState, setNetworkState] = useState<'online' | 'offline' | 'slow'>('online');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-32">
      <h1 className="text-3xl font-bold mb-8">UI States Testing Page</h1>
      
      <div className="space-y-12">
        {/* Section 1: Feedback States */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">1. Feedback States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Empty State */}
            <FeedbackState 
              icon={PackageOpen}
              title="No Hidden Eats Found"
              description="You haven't saved any restaurants yet. Start exploring your neighborhood!"
              actionButton={{ label: "Explore Map", onClick: () => alert("Navigating...") }}
            />

            {/* Error State */}
            <FeedbackState 
              variant="error"
              icon={AlertTriangle}
              title="Failed to Load Places"
              description="We couldn't connect to our servers to fetch nearby restaurants."
              actionButton={{ label: "Try Again", onClick: () => alert("Retrying...") }}
            />

            {/* No Search Results */}
            <FeedbackState 
              icon={SearchX}
              title="No Results"
              description="We couldn't find any 'Sushi' places nearby matching your criteria."
            />

            {/* Permission Denied */}
            <FeedbackState 
              variant="warning"
              icon={Lock}
              title="Location Required"
              description="We need your location to show you nearby hidden gems."
              actionButton={{ label: "Enable Location", onClick: () => alert("Prompting...") }}
            />

            {/* Session Expired */}
            <FeedbackState 
              variant="warning"
              icon={Clock}
              title="Session Expired"
              description="For your security, you have been logged out. Please log in again."
              actionButton={{ label: "Log In", onClick: () => alert("To Login...") }}
            />

          </div>
        </section>

        {/* Section 2: Loading State */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">2. Loading State</h2>
          <div className="flex gap-8 items-center bg-white p-8 rounded-lg border shadow-sm">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" text="Finding places..." />
            <LoadingSpinner size="lg" />
            
            <button 
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 2000);
              }}
              className="ml-auto px-4 py-2 bg-gray-900 text-white rounded-md"
            >
              Test Fullscreen Loader
            </button>
            {isLoading && <LoadingSpinner fullScreen text="Loading Map Data..." />}
          </div>
        </section>

        {/* Section 3: Form Validation & Success */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">3. Form Feedback & Success</h2>
          <div className="bg-white p-8 rounded-lg border shadow-sm max-w-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
              <input 
                type="text" 
                defaultValue="The Secret Burger Place"
                className="w-full border-red-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 border p-2"
              />
              <FormInputError message="This restaurant is already registered." />
            </div>
            
            <FormFeedback type="error" message="Please fix the errors above before submitting." />
            <div className="my-4 border-t" />
            <FormFeedback type="success" message="Review submitted successfully! It is now live." />
          </div>
        </section>
        
        {/* Section 4: Network States */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">4. Network States (Fixed Banner)</h2>
          <div className="flex gap-4">
            <button onClick={() => setNetworkState('online')} className="px-4 py-2 bg-gray-200 rounded-md">Set Online</button>
            <button onClick={() => setNetworkState('offline')} className="px-4 py-2 bg-red-100 text-red-700 rounded-md">Test Offline</button>
            <button onClick={() => setNetworkState('slow')} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md">Test Slow Network</button>
          </div>
          <NetworkStatus forceState={networkState} />
        </section>

      </div>
    </div>
  );
}
