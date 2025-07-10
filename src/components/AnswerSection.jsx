import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setIsQuestionMode } from "@/store/features/videoSlice";

const AnswerSection = ({ answer, loading, audioLink ="" }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  console.log(audioLink,"audioLink")
  // const audioLink =
  //   "http://cdn.epic.dev.esmagico.in/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3NkZi8xNzE2MmU5OC0yYTg5LTQyMjAtODdhZi03MzIxZmFmNWQwZjIubXAzP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9NjJPNDIxNU9DQ01WRUlKVTBWTlclMkYyMDI1MDcxMCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA3MTBUMTEzMTU1WiZYLUFtei1FeHBpcmVzPTQzMTk4JlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lJMk1rODBNakUxVDBORFRWWkZTVXBWTUZaT1Z5SXNJbVY0Y0NJNk1UYzFNakU1TURJNU15d2ljR0Z5Wlc1MElqb2liVGR2UjA5RllucFhZVEY1VkU1QkluMC5PS3pSOUZsOXdPSXFFakZ0dFhqRDVFaFJzaDM4RmdxeHlHUFFWMlYtZjg2M1AwVDdlNXRGUVNieEc4bHFsODROR0Nfd0YydlEtSmJOeHFvVXF3VzNmQSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPTUzNGFlYTRiN2JiYWRhNzJhYWUxZTFkZGUxNjAyZDQ1MDM1MWY5MzllNGQyNGEwYjRlMGFjNmVmYmIwMTZlMzE";

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
      dispatch(setIsQuestionMode(false));
    }, 1000); // Short delay after audio ends before closing
  };

  if (loading) {
    return (
      <div className="mt-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

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
        src={audioLink}
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
