import React from 'react';

const QuestionModeAI = () => {
  return (
    <div className="p-3 pb-2 bg-white rounded-xl border border-[#E5E7EB]">
      <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center" style={{
          background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.17), rgba(0, 0, 0, 0.17)), linear-gradient(180deg, #685EDD 0%, #DA8BFF 100%)'
        }}>
          {/* Main Content Container */}
          <div className="flex flex-col items-center gap-[19px] w-[243px] h-[137px]">
            
            {/* Avatar Container */}
            <div className="w-16 h-16 rounded-full border-[0.8px] border-white/50 bg-gray-300 flex items-center justify-center">
              {/* Placeholder for avatar image */}
              <div className="w-12 h-12 rounded-full bg-white/20"></div>
            </div>

            {/* Text Content */}
            <p className="w-full text-center font-lato font-normal text-sm leading-[18px] text-white">
              Ask me anything about the presentation, and I'll help with the answers.
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default QuestionModeAI;