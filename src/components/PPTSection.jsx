import React from 'react';

const PPTSection = ({ onAskQuestion }) => {
  const baseUrl = "https://docs.google.com/presentation/d/1h2O6645kWV0kWihwFF--DKx82RykKc1L";
  const googleSlidesUrl = `${baseUrl}/embed?rm=minimal&autoplay=5&loop=1&delayms=3000`;

  return (
    <div className="flex flex-col w-[70%] h-[calc(100vh-120px)]">
      <div 
      className="p-4 bg-white rounded-xl border border-gray-200 h-[calc(100vh-220px)] min-h-[500px] relative">
        <iframe
          src={googleSlidesUrl}
          className="w-full h-full rounded-xl"
          // allowFullScreen
          allow="autoplay"
        />
      </div>
      <div className="flex justify-center mt-4">
        <button 
          onClick={onAskQuestion}
          className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          Ask a Question
        </button>
      </div>
    </div>
  );
};

export default PPTSection;