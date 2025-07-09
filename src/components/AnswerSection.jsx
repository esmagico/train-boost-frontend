import React, { useEffect, useRef, useState } from "react";

const AnswerSection = ({ onClose, answer }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    // Auto-play the audio when component mounts
    if (audioRef.current) {
      const playAudio = async () => {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Error playing audio:", error);
          // If autoplay fails, show controls so user can manually play
          if (audioRef.current) {
            audioRef.current.controls = true;
          }
        }
      };

      playAudio();

      // Clean up audio on unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []); // Removed onClose from dependencies

  const handleAudioEnd = () => {
    setIsPlaying(false);
    // Only close after audio has finished playing
    setTimeout(() => {
      onClose();
    }, 1000); // Short delay after audio ends before closing
  };

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Answer</h3>
      <div className="flex items-center space-x-3 mb-2">
        {isPlaying ? (
          <>
            <div className="inline-block w-5 h-5 bg-blue-600 rounded-full animate-[pulse_1.5s_infinite]"></div>
            <p className="text-gray-700">Playing answer...</p>
          </>
        ) : (
          <p className="text-gray-700">Answer played</p>
        )}
      </div>
      <audio
        ref={audioRef}
        autoPlay
        src="http://webaudioapi.com/samples/audio-tag/chrono.mp3"
        onEnded={handleAudioEnd}
        className="w-full"
      />
      <div className="border-l-4 border-blue-600 bg-blue-50 p-3 mt-2 rounded-r">
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default AnswerSection;
