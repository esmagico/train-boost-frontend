import React, { useEffect, useState } from 'react';

const AnswerSection = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(false);
      
      const closeTimer = setTimeout(() => {
        onClose();
      }, 2000);
      
      return () => clearTimeout(closeTimer);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Answer</h3>
      <div className="flex items-center space-x-3 mb-2">
        {isPlaying && (
          <div className="inline-block w-5 h-5 bg-blue-600 rounded-full animate-[pulse_1.5s_infinite]"></div>
        )}
        <p className="text-gray-700">
          {isPlaying ? "Playing answer..." : "Answer played"}
        </p>
      </div>
      <div className="border-l-4 border-blue-600 bg-blue-50 p-3 mt-2 rounded-r">
        <p>Based on the current slide, the key points are: First, market trends show a 15% growth in Q3. Second, our new product addresses three customer pain points. Third, implementation should begin with pilot testing.</p>
      </div>
    </div>
  );
};

export default AnswerSection;