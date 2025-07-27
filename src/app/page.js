"use client";
import React, { useState } from "react";
import VideoPanel from "@/components/sections/VideoPanel";
import PPTSection from "@/components/sections/PPTSection";
import { useGetAllVideoQuery } from "@/store/api/questionsApi";

const Home = () => {
  const { data, isLoading } = useGetAllVideoQuery();
  const videos = data?.data?.filter(
    (video) => video?.trainer_video && video?.trainer_video?.trim() !== ""
  );

  // Shared video state for synchronization
  const [videoState, setVideoState] = useState({
    currentTime: 0,
    isPlaying: false,
    currentVideoIndex: 0,
    duration: 0,
  });

  // Handle video state changes from VideoPanel
  const handleVideoStateChange = (newState) => {
    setVideoState(newState);
  };

  return (
    <div className="relative flex size-full h-[calc(100vh-80px)] flex-col bg-white overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 p-6 overflow-hidden">
          <div className="flex w-full h-full min-w-0">
            <PPTSection
              videos={videos}
              loading={isLoading}
              currentVideoIndex={videoState.currentVideoIndex}
              currentVideoTime={videoState.currentTime}
              isVideoPlaying={videoState.isPlaying}
              videoDuration={videoState.duration}
              width="70%"
            />
            <VideoPanel
              videos={videos}
              loading={isLoading}
              onVideoStateChange={handleVideoStateChange}
              width="30%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
