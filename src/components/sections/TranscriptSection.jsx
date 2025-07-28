import React, { useState, useEffect } from "react";
import star from "@/assets/svg/star.svg";

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
    <div className="w-full bg-white rounded-lg p-4 pl-1 mt-2 ">
      <div className="flex items-center">
        <span className="font-lato font-bold text-base leading-none tracking-[0.02em] bg-clip-text text-transparent bg-gradient-to-b from-[#685EDD] to-[#DA8BFF]">
          Captions
        </span>
        <img src={star.src} alt="star" className="w-5 h-5 ml-1" />
      </div>

      {/* <div className="relative overflow-hidden min-h-[60px] mt-3">
  <style jsx>{`
    @keyframes slideUpAndFadeOut {
      0% {
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateY(-20px);
      }
    }

    @keyframes slideInFromBottom {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-out {
      animation: slideUpAndFadeOut 0.5s ease forwards;
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

  <div className="relative h-[60px] w-full">
    {!isVideoPlaying ? (
      <p className="text-gray-500 text-sm">Play the video to see captions</p>
    ) : !currentTranscript && !previousTranscript ? (
      <p className="text-gray-500 text-sm">No captions available for this moment</p>
    ) : (
      <>
        {isTransitioning && previousTranscript && (
          <p className="caption-text animate-out font-lato font-bold text-xl leading-[30px] tracking-[0.02em] text-gray-800">
            {previousTranscript.text}
          </p>
        )}
        {currentTranscript && (
          <p
            className={`caption-text ${
              isTransitioning ? "animate-in" : ""
            } font-lato font-bold text-xl leading-[30px] tracking-[0.02em] text-gray-800`}
          >
            {currentTranscript.text}
          </p>
        )}
      </>
    )}
  </div>
</div> */}

      <div className="relative overflow-hidden min-h-[100px] mt-3">
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
            animation: slideUpAndFadeOut 0.5s ease forwards;
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

        <div className="relative h-[100px] w-full">
          {!isVideoPlaying ? (
            <p className="text-gray-500 text-sm">
              Play the video to see captions
            </p>
          ) : !currentTranscript && !previousTranscript ? (
            <p className="text-gray-500 text-sm">
              No captions available for this moment
            </p>
          ) : (
            <>
              {isTransitioning && previousTranscript && (
                <p className="caption-text animate-out font-lato font-bold text-xl leading-[30px] tracking-[0.02em] text-gray-800">
                  {previousTranscript.text}
                </p>
              )}
              {currentTranscript && (
                <p
                  className={`caption-text ${
                    isTransitioning ? "animate-in" : ""
                  } font-lato font-bold text-xl leading-[30px] tracking-[0.02em] text-gray-800`}
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
