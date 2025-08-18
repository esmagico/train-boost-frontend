import React from "react";
import TranscriptSection from "./TranscriptSection";
import SlideVideoSection from "./SlideVideoSection";

const PPTSection = ({
  videos = [],
  loading = false,
  height = "calc(100vh - 240px)",
  width = "70%",
  currentVideoIndex = 0,
  currentVideoTime = 0,
  isVideoPlaying = false,
  videoDuration = 0,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-120px)] pr-5 border-r border-gray-300 flex-shrink-0" style={{ width }}>
        {/* Video Section Skeleton */}
        <div
          className="bg-white rounded-xl border border-gray-200 min-h-[400px] relative animate-pulse"
          style={{ height }}
        >
          <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
          </div>
        </div>

        {/* Title and Author Skeleton */}
        <div className="mt-3 flex justify-between items-center pr-1 animate-pulse">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>

        {/* Transcript Section Skeleton */}
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
          <div className="flex items-center mb-4">
            <div className="h-5 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-[calc(100vh-120px)] pr-5 border-r border-gray-300 flex-shrink-0"
      style={{ width }}
    >
      {/* Video Section */}
      <div
        className="bg-white rounded-xl border border-gray-200 min-h-[400px] relative"
        style={{ height }}
      >
        <SlideVideoSection
          videos={videos}
          currentVideoIndex={currentVideoIndex}
          currentVideoTime={currentVideoTime + 0.1}
          isVideoPlaying={isVideoPlaying}
          videoDuration={videoDuration}
        />
      </div>
      <div className="mt-3 flex justify-between items-center pr-1">
        <p className="font-bold text-[20px] leading-[100%] tracking-[0.02em] font-lato">
          Corporate Finance
        </p>

        <p className="font-semibold text-[14px] leading-[100%] tracking-[0.02em] font-lato">
          <span className="text-[#00000080]">By:</span> Bhagwan Chowdhry
        </p>
      </div>

      {/* Transcript Section */}
      <TranscriptSection
        videos={videos}
        currentVideoIndex={currentVideoIndex}
        currentVideoTime={currentVideoTime}
        isVideoPlaying={isVideoPlaying}
      />
    </div>
  );
};

export default PPTSection;
