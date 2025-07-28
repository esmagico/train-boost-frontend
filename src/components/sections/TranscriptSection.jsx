import React, { useState, useEffect } from "react";

const TranscriptSection = ({
  videos,
  currentVideoIndex,
  currentVideoTime,
  isVideoPlaying,
}) => {
  const [currentTranscript, setCurrentTranscript] = useState(null);
  const [previousTranscript, setPreviousTranscript] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!videos?.[currentVideoIndex]?.transcript || !isVideoPlaying) {
      return;
    }

    const transcriptItems = videos[currentVideoIndex].transcript;

    // Find the transcript item that matches the current time
    const activeTranscript = transcriptItems.find(
      (item) => currentVideoTime >= item.start && currentVideoTime <= item.end
    );

    // Only update if the transcript has changed
    if (activeTranscript && activeTranscript.text !== currentTranscript?.text) {
      if (currentTranscript) {
        setPreviousTranscript(currentTranscript);
        setIsTransitioning(true);

        // Reset transition state after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
          setPreviousTranscript(null);
        }, 500); // Match this with the animation duration
      }

      setCurrentTranscript(activeTranscript);
    } else if (!activeTranscript && currentTranscript) {
      // Clear transcript when no active transcript
      setCurrentTranscript(null);
      setPreviousTranscript(null);
      setIsTransitioning(false);
    }
  }, [videos, currentVideoIndex, currentVideoTime, isVideoPlaying, currentTranscript]);

  // Reset transcript when video changes
  useEffect(() => {
    setCurrentTranscript(null);
    setPreviousTranscript(null);
    setIsTransitioning(false);
  }, [currentVideoIndex]);

  return (
    <div className="w-full bg-white rounded-lg p-4 pl-1 mt-2 ">
      <div className="flex items-center">
        <span className="text-base font-semibold text-gray-600">Captions ✨</span>
      </div>
      
      <div className="relative overflow-hidden">
        <style jsx>{`
          @keyframes fadeInFromBottom {
            0% {
              transform: translateY(20px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes fadeUpAndOut {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-20px);
              opacity: 0;
            }
          }

          .transcript-container {
            position: relative;
            overflow: visible;
          }

          .transcript-text {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            padding: 8px 0;
            transition: all 0.3s ease-out;
          }

          .fade-in {
            animation: fadeInFromBottom 0.5s ease-out forwards;
          }

          .fade-up {
            animation: fadeUpAndOut 0.5s ease-out forwards;
          }

          .transcript-static {
            position: relative;
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>

        <div className="transcript-container">
          {!isVideoPlaying ? (
            <div className="transcript-text transcript-static flex items-center">
              <p className="text-gray-500 text-sm leading-relaxed">
                Play the video to see captions
              </p>
            </div>
          ) : !currentTranscript && !previousTranscript ? (
            <div className="transcript-text transcript-static flex items-center">
              <p className="text-gray-500 text-sm leading-relaxed">
                No captions available for this moment
              </p>
            </div>
          ) : (
            <>
              {/* Previous transcript that fades up and out */}
              {isTransitioning && previousTranscript && (
                <p className="font-lato font-bold text-xl leading-[30px] tracking-[0.02em] text-gray-800 transcript-text fade-up">
                  {previousTranscript.text}
                </p>
              )}

              {/* Current transcript that fades in from bottom */}
              {currentTranscript && (
                <p
                  className={`font-lato font-bold text-xl leading-[30px] tracking-[0.02em] text-gray-800 transcript-text ${
                    isTransitioning ? "fade-in" : "transcript-static"
                  }`}
                >
                  {currentTranscript.text}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptSection;