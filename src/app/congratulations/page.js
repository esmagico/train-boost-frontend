'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CongratulationsPage() {
  const router = useRouter();

  // useEffect(() => {
  //   // Auto redirect to home after 5 seconds
  //   const timer = setTimeout(() => {
  //     router.push('/');
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden mt-[-200px]">
        <div className="p-8 text-center ">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-14 h-14 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Congratulations! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for training with TrainBoost!
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <p className="text-blue-700">
              You've successfully completed the training and passed the assessment with flying colors!
            </p>
          </div>
          
          {/* <div className="text-sm text-gray-500 mt-8">
            <p>Redirecting you to the home page in 5 seconds...</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home Now
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
