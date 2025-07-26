import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// SlideVideoSection component to display synchronized slide video
const SlideVideoSection = ({ videos, currentVideoIndex }) => {
  const slideVideoRef = useRef(null);
  const { currentVideoTime, isVideoPlaying } = useSelector((state) => state.video);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  // Sync slide video with trainer video time
  useEffect(() => {
    if (slideVideoRef.current && videos?.[currentVideoIndex]?.slide_video) {
      const slideVideo = slideVideoRef.current;
      const timeDifference = Math.abs(slideVideo.currentTime - currentVideoTime);
      
      // Only sync if there's a significant time difference (more than 0.3 seconds)
      // and the video is loaded and ready
      if (timeDifference > 0.3 && slideVideo.readyState >= 2) {
        try {
          slideVideo.currentTime = currentVideoTime;
        } catch (error) {
          console.warn("Failed to sync slide video time:", error);
        }
      }
    }
  }, [currentVideoTime, videos, currentVideoIndex]);

  // Sync play/pause state with trainer video
  useEffect(() => {
    if (slideVideoRef.current) {
      const slideVideo = slideVideoRef.current;
      
      if (isVideoPlaying && slideVideo.paused) {
        slideVideo.play().catch(console.error);
      } else if (!isVideoPlaying && !slideVideo.paused) {
        slideVideo.pause();
      }
    }
  }, [isVideoPlaying]);

  // Load new video when index changes
  useEffect(() => {
    if (slideVideoRef.current && videos?.[currentVideoIndex]?.slide_video) {
      const slideVideo = slideVideoRef.current;
      slideVideo.load();
      
      // Reset time to 0 when loading new video
      slideVideo.currentTime = 0;
    }
  }, [currentVideoIndex, videos]);

  if (!videos?.[currentVideoIndex]?.slide_video) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">No slide video available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black rounded-xl overflow-hidden relative">
      {/* Loading overlay */}
      {isVideoLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-white text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading slide video...</p>
          </div>
        </div>
      )}
      
      <video
        ref={slideVideoRef}
        src={videos[currentVideoIndex].slide_video}
        className="w-full h-full object-contain"
        muted
        playsInline
        onLoadStart={() => setIsVideoLoading(true)}
        onLoadedData={() => {
          // Sync initial time when video loads
          if (slideVideoRef.current) {
            slideVideoRef.current.currentTime = currentVideoTime;
          }
          setIsVideoLoading(false);
        }}
        onError={(e) => {
          console.error("Error loading slide video:", e);
          setIsVideoLoading(false);
        }}
        onCanPlay={() => {
          // Ensure sync when video is ready to play
          if (slideVideoRef.current) {
            slideVideoRef.current.currentTime = currentVideoTime;
          }
        }}
      />
      
      {/* Video title overlay */}
      {videos[currentVideoIndex]?.title && !isVideoLoading && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm">
          {videos[currentVideoIndex].title}
        </div>
      )}
    </div>
  );
};

const PPTSection = ({
  videos = [],
  loading = false,
  height = "calc(100vh - 220px)",
  width = "70%",
}) => {
  const { currentVideoIndex } = useSelector((state) => state.video);

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
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-[${width}] h-[calc(100vh-120px)]`}>
      <div
        className="p-4 bg-white rounded-xl border border-gray-200 min-h-[500px] relative"
        style={{ height }}
      >
        <SlideVideoSection 
          videos={videos} 
          currentVideoIndex={currentVideoIndex} 
        />
      </div>
    </div>
  );
};

export default PPTSection;
