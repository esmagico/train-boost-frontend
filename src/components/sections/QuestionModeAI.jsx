import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { toast } from 'react-toastify';

const QuestionModeAI = forwardRef(({ answer, audioLink, isAudioPlaying, onAudioStateChange, isLoading }, ref) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioLink && audioRef.current) {
      audioRef.current.src = audioLink;
      audioRef.current.play().catch((error) => {
        console.log('Audio playback failed:', error);
        toast.error('Audio playback failed. Please try again.');
      });
    }
  }, [audioLink]);



  const handleAudioPlay = () => {
    if (onAudioStateChange) {
      onAudioStateChange(true);
    }
  };

  const handleAudioPause = () => {
    if (onAudioStateChange) {
      onAudioStateChange(false);
    }
  };

  const handleAudioEnded = () => {
    if (onAudioStateChange) {
      onAudioStateChange(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (onAudioStateChange) {
        onAudioStateChange(false);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    stopAudio
  }));

  return (
    <div className="p-3 pb-2 bg-white rounded-xl border border-[#E5E7EB]">
      <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center" style={{
          background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.17), rgba(0, 0, 0, 0.17)), linear-gradient(180deg, #685EDD 0%, #DA8BFF 100%)'
        }}>
          {/* Main Content Container */}
          <div className="flex flex-col items-center gap-[19px] w-[243px] h-[137px]">
            
            {/* Avatar Container */}
            <div className="relative flex items-center justify-center">
              {/* Animated Wave Rings */}
              {isAudioPlaying && (
                <>
                  {[1, 2, 3].map((ring) => (
                    <div
                      key={ring}
                      className="absolute rounded-full border-2 border-white/30 animate-wave"
                      style={{
                        animationDelay: `${ring * 0.4}s`
                      }}
                    />
                  ))}
                </>
              )}
              
              {/* Main Avatar */}
              <div className="w-16 h-16 rounded-full border-[0.8px] border-white/50 bg-gray-300 flex items-center justify-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-white/20"></div>
              </div>
            </div>

            {/* Text Content */}
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            ) : (
              <p className="w-full text-center font-lato font-normal text-sm leading-[18px] text-white">
                {answer || "Ask me anything about the presentation, and I'll help with the answers."}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden Audio Element */}
      {audioLink && (
        <audio
          ref={audioRef}
          onPlay={handleAudioPlay}
          onPause={handleAudioPause}
          onEnded={handleAudioEnded}
          onError={() => toast.error('Audio failed to load. Please try again.')}
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
});

QuestionModeAI.displayName = 'QuestionModeAI';

export default QuestionModeAI;