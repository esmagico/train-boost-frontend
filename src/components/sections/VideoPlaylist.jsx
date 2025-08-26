import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentVideoIndex } from "@/store/features/videoSlice";

const VideoPlaylist = ({ videos = [], loading = false, onVideoSelect }) => {
  const dispatch = useDispatch();
  const { currentVideoIndex } = useSelector((state) => state.video);
  const scrollContainerRef = useRef(null);
  const videoItemRefs = useRef([]);

  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Auto-scroll to current video when currentVideoIndex changes
  useEffect(() => {
    if (videoItemRefs.current[currentVideoIndex] && scrollContainerRef.current) {
      const currentVideoElement = videoItemRefs.current[currentVideoIndex];
      const container = scrollContainerRef.current;
      
      // Get the position of the current video item relative to the container
      const containerRect = container.getBoundingClientRect();
      const itemRect = currentVideoElement.getBoundingClientRect();
      
      // Check if the item is outside the visible area
      const isAboveView = itemRect.top < containerRect.top;
      const isBelowView = itemRect.bottom > containerRect.bottom;
      
      if (isAboveView || isBelowView) {
        // Scroll the current video into view
        currentVideoElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [currentVideoIndex]);

  const handleVideoSelect = (index) => {
    if (onVideoSelect) {
      // Use the callback from VideoPanel if provided
      onVideoSelect(index);
    } else {
      // Fallback to direct dispatch if no callback provided
      if (index !== currentVideoIndex) {
        dispatch(setCurrentVideoIndex(index));
      }
    }
  };

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center p-3 animate-pulse">
              <div className="w-16 h-12 bg-gray-100 rounded mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-50 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Training Videos</h3>
        <span className="text-sm text-gray-500">
          {videos.length} video{videos.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div 
        ref={scrollContainerRef}
        className="space-y-2 max-h-[calc(100vh-465px)] overflow-y-auto"
      >
        {videos.map((video, index) => (
          <div
            key={index}
            ref={(el) => (videoItemRefs.current[index] = el)}
            onClick={() => handleVideoSelect(index)}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              currentVideoIndex === index
                ? "bg-blue-50 border-2 border-blue-200"
                : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
            }`}
          >
            {/* Video Thumbnail */}
            <div className="relative w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
              <img
                src="https://cdn-api.epic.dev.esmagico.in/trainboost/slides/thumb.png"
                alt={`Video ${index + 1} thumbnail`}
                className="w-full h-full object-cover"
              />
              {/* Play indicator for current video */}
              {/* {currentVideoIndex === index && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5"></div>
                  </div>
                </div>
              )} */}
              {/* Video number overlay */}
              <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                {index + 1}
              </div>
            </div>

            {/* Video Info */}
            <div className="ml-3 flex-1 min-w-0">
              <h4 className="font-medium text-gray-800 truncate">
                {video.title || `Training Video ${index + 1}`}
              </h4>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500 truncate">
                  {video.ti || `Part ${index + 1} of the training series`}
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="ml-2 flex-shrink-0">
              {currentVideoIndex === index ? (
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              ) : currentVideoIndex > index ? (
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlaylist;
