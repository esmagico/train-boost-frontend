import {
  setIsQuestionMode,
  setQuestionPanelPptSlide,
} from "@/store/features/videoSlice";
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetAllVideoQuery } from "@/store/api/questionsApi";

// TranscriptSection component to display the current transcript based on video time
const TranscriptSection = () => {
  const { data, isLoading } = useGetAllVideoQuery();
  const { currentVideoIndex, currentVideoTime, isVideoPlaying } = useSelector(
    (state) => state.video
  );
  const [currentTranscript, setCurrentTranscript] = useState(null);
  const [previousTranscript, setPreviousTranscript] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isLoading || !data?.data || !data.data[currentVideoIndex]?.transcript)
      return;

    const transcriptItems = data.data[currentVideoIndex].transcript;

    // Find the transcript item that matches the current time
    const activeTranscript = transcriptItems.find(
      (item) => currentVideoTime >= item.start && currentVideoTime <= item.end
    );

    // Only update if the transcript has changed
    if (activeTranscript?.text !== currentTranscript?.text) {
      if (currentTranscript) {
        setPreviousTranscript(currentTranscript);
        setIsTransitioning(true);

        // Reset transition state after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000); // Match this with the animation duration
      }

      setCurrentTranscript(activeTranscript);
    }
  }, [data, currentVideoIndex, currentVideoTime, isLoading, currentTranscript]);

  return (
    <div className="w-[70%] bg-white rounded-md overflow-hidden">
      <style jsx>{`
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutToRight {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .transcript-container {
          position: relative;
          min-height: 4rem;
          overflow: hidden;
        }

        .transcript-text {
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
        }

        .slide-in {
          animation: slideInFromLeft 1s ease-out forwards;
        }

        .slide-out {
          animation: slideOutToRight 1s ease-out forwards;
        }
      `}</style>

      <div className="p-3 ml-4 transcript-container">
        {!isVideoPlaying ? (
          // Show nothing when video is paused
          <div className="transcript-text"></div>
        ) : isLoading || !currentTranscript ? (
          <p className="text-lg text-gray-700 font-bold leading-relaxed transcript-text">
            No transcript available for this moment
          </p>
        ) : (
          <>
            {/* Previous transcript that slides out */}
            {isTransitioning && previousTranscript && (
              <p className="text-lg text-gray-700 font-bold leading-relaxed transcript-text slide-out">
                {previousTranscript.text}
              </p>
            )}

            {/* Current transcript that slides in */}
            <p
              className={`text-lg text-gray-700 font-bold leading-relaxed transcript-text ${
                isTransitioning ? "slide-in" : ""
              }`}
            >
              {currentTranscript.text}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const PPTSection = ({
  loading = false,
  removeAskQuestionButton = false,
  isQuestionMode = false,
  height = "calc(100vh - 220px)",
  width = "70%",
  autoPlayDelay = 3000,
  presentationUrl = "https://docs.google.com/presentation/d/1h2O6645kWV0kWihwFF--DKx82RykKc1L/edit?usp=drive_link&ouid=112603893642491756794&rtpof=true&sd=true", // new prop
}) => {
  const iframeRef = useRef(null);
  const { currentSlide, questionPanelPptSlide } = useSelector(
    (state) => state.video
  );
  const dispatch = useDispatch();
  const slideNumber = isQuestionMode ? questionPanelPptSlide : currentSlide;

  const extractPresentationId = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const presentationId = extractPresentationId(presentationUrl);
  // const presentationId = "1yyZtqREBI0fS6zZ2HlKMwGnrUwO6VXab"
  // const getSlideUrl = () => {
  //   if (!presentationId) return "";
  //   return `https://docs.google.com/presentation/d/${presentationId}/embed?start=true&loop=true&delayms=${autoPlayDelay}&slide=${currentSlide}`;
  // };

  const getSlideUrl = () => {
    if (!presentationId) return "";
    return `https://docs.google.com/presentation/d/${presentationId}/embed?start=false&loop=false&delayms=${autoPlayDelay}&rm=minimal&slide=${slideNumber}`;
  };

  if (loading) {
    return (
      <div className={`flex flex-col w-[${width}] h-[calc(100vh-120px)]`}>
        <div
          className="p-4 bg-white rounded-xl border border-gray-200 min-h-[500px] relative animate-pulse"
          style={{ height }}
        >
          <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="h-8 w-48 bg-gray-300 rounded mx-auto"></div>
              <div className="h-4 w-32 bg-gray-300 rounded mx-auto"></div>
            </div>
          </div>
        </div>
        {!removeAskQuestionButton && (
          <div className="flex justify-center mt-4">
            <div className="h-10 w-40 bg-gray-200 rounded-full"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-[${width}] h-[calc(100vh-120px)]`}>
      <div
        className="p-4 bg-white rounded-xl border border-gray-200 min-h-[500px] relative"
        style={{ height }}
      >
        {presentationId ? (
          <iframe
            ref={iframeRef}
            src={getSlideUrl()}
            className="w-full h-full rounded-xl pointer-events-none"
            allowFullScreen
            allow="autoplay"
            title="Presentation Slides"
            frameBorder="0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
          />
        ) : (
          <div className="text-red-500 text-center">
            Invalid Google Drive Presentation URL
          </div>
        )}
      </div>
      {!removeAskQuestionButton && (
        <div className="flex mt-4 justify-between items-start">
          <TranscriptSection />
          <button
            onClick={() => {
              dispatch(setIsQuestionMode(true));
              dispatch(setQuestionPanelPptSlide(currentSlide));
            }}
            className="max-h-[40px] min-w-[150px] cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Ask a Question
          </button>
        </div>
      )}
    </div>
  );
};

export default PPTSection;
