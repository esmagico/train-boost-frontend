import {
  setIsQuestionMode,
  setQuestionPanelPptSlide,
  setCurrentSlide,
} from "@/store/features/videoSlice";
import React, { useRef, useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const PPTSection = ({
  loading = false,
  removeAskQuestionButton = false,
  isQuestionMode = false,
  height = "calc(100vh - 220px)",
  width = "70%",
  autoPlayDelay = 3000,
  videos = [], // videos array from API
}) => {
  const currentIframeRef = useRef(null);
  const nextIframeRef = useRef(null);
  const [activeIframe, setActiveIframe] = useState("current");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedSlides, setLoadedSlides] = useState(new Set());

  const { currentSlide, questionPanelPptSlide, currentVideoIndex } =
    useSelector((state) => state.video);
  const dispatch = useDispatch();
  const slideNumber = isQuestionMode ? questionPanelPptSlide : currentSlide;

  // Get current video's PPT URL
  const currentVideo = videos[currentVideoIndex];
  const presentationUrl = currentVideo?.ppt_url;

  const extractPresentationId = (url) => {
    const match = url?.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const presentationId = extractPresentationId(presentationUrl);

  // Debug logging (can be removed in production)
  if (currentVideo && slideNumber) {
    console.log(
      `PPTSection - Video ${currentVideoIndex}, Slide ${slideNumber}, Active: ${activeIframe}, Transitioning: ${isTransitioning}`
    );
  }

  const getSlideUrl = useCallback(
    (slide) => {
      if (!presentationId) return "";
      const url = `https://docs.google.com/presentation/d/${presentationId}/embed?start=false&loop=false&delayms=${autoPlayDelay}&slide=${slide}&rm=minimal`;
      return url;
    },
    [presentationId, autoPlayDelay]
  );

  // Preload next and previous slides for smooth transitions
  const preloadSlides = useCallback(() => {
    if (!presentationId || !currentVideo?.slides) return;

    const totalSlides = currentVideo.slides.length;
    const nextSlide = slideNumber < totalSlides ? slideNumber + 1 : slideNumber;
    const prevSlide = slideNumber > 1 ? slideNumber - 1 : slideNumber;

    // Preload adjacent slides (limit to avoid too many requests)
    [nextSlide, prevSlide].forEach((slide) => {
      if (
        slide !== slideNumber &&
        !loadedSlides.has(slide) &&
        loadedSlides.size < 5
      ) {
        const preloadIframe = document.createElement("iframe");
        preloadIframe.src = getSlideUrl(slide);
        preloadIframe.style.display = "none";
        preloadIframe.style.position = "absolute";
        preloadIframe.style.left = "-9999px";
        document.body.appendChild(preloadIframe);

        const cleanup = () => {
          if (document.body.contains(preloadIframe)) {
            document.body.removeChild(preloadIframe);
          }
        };

        preloadIframe.onload = () => {
          setLoadedSlides((prev) => new Set([...prev, slide]));
          setTimeout(cleanup, 100); // Small delay to ensure loading is complete
        };

        preloadIframe.onerror = cleanup;

        // Cleanup after timeout to prevent memory leaks
        setTimeout(cleanup, 10000);
      }
    });
  }, [presentationId, slideNumber, currentVideo, loadedSlides, getSlideUrl]);

  // Smooth slide transition
  const transitionToSlide = useCallback(
    (newSlide) => {
      if (isTransitioning || newSlide === slideNumber) return;

      setIsTransitioning(true);
      const nextIframe =
        activeIframe === "current"
          ? nextIframeRef.current
          : currentIframeRef.current;
      const currentIframe =
        activeIframe === "current"
          ? currentIframeRef.current
          : nextIframeRef.current;

      if (nextIframe) {
        // Load new slide in hidden iframe
        nextIframe.src = getSlideUrl(newSlide);
        nextIframe.style.opacity = "0";
        nextIframe.style.pointerEvents = "none";

        const completeTransition = () => {
          // Smooth transition
          nextIframe.style.transition = "opacity 0.3s ease-in-out";
          currentIframe.style.transition = "opacity 0.3s ease-in-out";

          nextIframe.style.opacity = "1";
          currentIframe.style.opacity = "0";

          setTimeout(() => {
            setActiveIframe(activeIframe === "current" ? "next" : "current");
            setIsTransitioning(false);

            // Reset transitions
            nextIframe.style.transition = "";
            currentIframe.style.transition = "";
            currentIframe.style.pointerEvents = "none";
            nextIframe.style.pointerEvents = "none";
          }, 300);
        };

        nextIframe.onload = completeTransition;

        // Fallback in case onload doesn't fire
        setTimeout(() => {
          if (isTransitioning) {
            console.log("Transition timeout, completing anyway");
            completeTransition();
          }
        }, 5000);
      }
    },
    [isTransitioning, slideNumber, activeIframe, getSlideUrl]
  );

  // Handle slide changes
  useEffect(() => {
    if (presentationId && slideNumber) {
      transitionToSlide(slideNumber);
      preloadSlides();
    }
  }, [slideNumber, presentationId, transitionToSlide, preloadSlides]);

  // Initialize first slide and reset on video change
  useEffect(() => {
    if (presentationId && currentIframeRef.current) {
      // Reset state for new video/presentation
      setActiveIframe("current");
      setIsTransitioning(false);
      setLoadedSlides(new Set([slideNumber]));

      // Load initial slide
      currentIframeRef.current.src = getSlideUrl(slideNumber);
      currentIframeRef.current.style.opacity = "1";

      // Reset next iframe
      if (nextIframeRef.current) {
        nextIframeRef.current.style.opacity = "0";
        nextIframeRef.current.src = "";
      }
    }
  }, [presentationId, currentVideoIndex, getSlideUrl, slideNumber]);
  // const presentationId = "1yyZtqREBI0fS6zZ2HlKMwGnrUwO6VXab"
  // const getSlideUrl = () => {
  //   if (!presentationId) return "";
  //   return `https://docs.google.com/presentation/d/${presentationId}/embed?start=true&loop=true&delayms=${autoPlayDelay}&slide=${currentSlide}`;
  // };

  if (loading || !videos || videos.length === 0 || !presentationUrl) {
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
          <div className="relative w-full h-full">
            {/* Current iframe */}
            <iframe
              ref={currentIframeRef}
              className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none"
              allowFullScreen
              allow="autoplay"
              title="Presentation Slides - Current"
              style={{
                border: 0,
                opacity: activeIframe === "current" ? 1 : 0,
                zIndex: activeIframe === "current" ? 2 : 1,
              }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
            />

            {/* Next iframe for smooth transitions */}
            <iframe
              ref={nextIframeRef}
              className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none"
              allowFullScreen
              allow="autoplay"
              title="Presentation Slides - Next"
              style={{
                border: 0,
                opacity: activeIframe === "next" ? 1 : 0,
                zIndex: activeIframe === "next" ? 2 : 1,
              }}
              sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
            />

            {/* Subtle loading indicator during transitions */}
            {isTransitioning && (
              <div className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-1">
                <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-red-500 text-center">
            Invalid Google Drive Presentation URL
          </div>
        )}
      </div>
      {!removeAskQuestionButton && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => {
              dispatch(setIsQuestionMode(true));
              dispatch(setQuestionPanelPptSlide(currentSlide));
            }}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Ask a Question
          </button>
          {/* Debug controls */}
          <button
            onClick={() =>
              dispatch(setCurrentSlide(Math.max(1, currentSlide - 1)))
            }
            className="cursor-pointer px-2 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
          >
            ← Prev
          </button>
          <span className="px-2 py-2 bg-gray-100 rounded-md text-sm">
            Slide {slideNumber}
          </span>
          <button
            onClick={() => dispatch(setCurrentSlide(currentSlide + 1))}
            className="cursor-pointer px-2 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
          >
            Next →
          </button>
          <div className="px-2 py-1 bg-yellow-100 rounded-md text-xs max-w-xs truncate">
            Slides:{" "}
            {currentVideo?.slides
              ? JSON.stringify(currentVideo.slides)
              : "None"}
          </div>
        </div>
      )}
    </div>
  );
};

export default PPTSection;
