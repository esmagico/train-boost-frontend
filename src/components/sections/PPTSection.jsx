import React from "react";
import TranscriptSection from "./TranscriptSection";
import SlideVideoSection from "./SlideVideoSection";

const PPTSection = ({
  videos = [],
  loading = false,
  height = "calc(100vh - 240px)", // Increased height to match VideoPanel
  width = "70%",
  currentVideoIndex = 0,
  currentVideoTime = 0,
  isVideoPlaying = false,
  videoDuration = 0,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-120px)]" style={{ width }}>
        <div
          className="bg-white rounded-xl border border-gray-200 min-h-[400px] relative animate-pulse"
          style={{ height }}
        >
          <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="h-8 w-48 bg-gray-300 rounded mx-auto"></div>
              <div className="h-4 w-32 bg-gray-300 rounded mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Loading transcript skeleton */}
        <div className="mt-4 p-6 bg-gray-50 rounded-lg animate-pulse">
          <div className="flex items-center mb-4">
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
      <div className="mt-3 flex justify-between items-center">
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
