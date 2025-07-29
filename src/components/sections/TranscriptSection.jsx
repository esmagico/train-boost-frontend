import React, { useState, useEffect } from "react";
import star from "@/assets/svg/star.svg";
import speaker from "@/assets/svg/speaker.svg";

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
  }, [
    videos,
    currentVideoIndex,
    currentVideoTime,
    isVideoPlaying,
    currentTranscript,
  ]);

  // Reset transcript when video changes
  useEffect(() => {
    setCurrentTranscript(null);
    setPreviousTranscript(null);
    setIsTransitioning(false);
  }, [currentVideoIndex]);

  return (
    <div className="w-full bg-[#F5F5F6] rounded-lg px-3 py-4 mt-6 h-[88px]">
      <div className="flex items-center">
        <span className="font-lato font-bold text-base leading-none tracking-[0.02em] bg-clip-text text-transparent bg-gradient-to-b from-[#685EDD] to-[#DA8BFF]">
          Captions
        </span>
        <img src={star.src} alt="star" className="w-5 h-5 ml-1" />
      </div>

      <div className="relative overflow-hidden h-[44px] mt-2">
        <style jsx>{`
          @keyframes slideUpAndFadeOut {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-40px);
            }
          }

          @keyframes slideInFromBottom {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-out {
            animation: slideUpAndFadeOut 1s ease forwards;
          }

          .animate-in {
            animation: slideInFromBottom 0.5s ease forwards;
          }

          .caption-text {
            position: absolute;
            width: 100%;
            text-align: left;
          }
        `}</style>

        <div className="relative h-[44px] w-full">
          {isTransitioning && previousTranscript && (
            <div className="flex items-center absolute w-[calc(100%-28px)]">
              <img
                src={speaker.src}
                alt="speaker"
                className="w-5 h-5 flex-shrink-0"
              />
              <p className="caption-text animate-out font-lato font-normal text-[16px] leading-[24px] tracking-[0.02em] text-[#000000] ml-7 whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                {previousTranscript.text}
              </p>
            </div>
          )}
          {currentTranscript && (
            <div className="flex items-center absolute w-[calc(100%-28px)]">
              <img
                src={speaker.src}
                alt="speaker"
                className="w-5 h-5 flex-shrink-0"
              />
              <p
                className={`caption-text ${
                  isTransitioning ? "animate-in" : ""
                } font-lato font-normal text-[16px] leading-[24px] tracking-[0.02em] text-[#000000] ml-7 whitespace-nowrap overflow-hidden text-ellipsis flex-1`}
              >
                {currentTranscript.text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptSection;
