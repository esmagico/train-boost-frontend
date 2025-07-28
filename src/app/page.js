"use client";
import React, { useState, useRef } from "react";
import VideoPanel from "@/components/sections/VideoPanel";
import PPTSection from "@/components/sections/PPTSection";
import { useGetAllVideoQuery } from "@/store/api/questionsApi";
import { useDispatch } from "react-redux";
import { setIsPlaying } from "@/store/features/videoSlice";

const Home = () => {
  const { data, isLoading } = useGetAllVideoQuery();
  const videos = data?.data?.filter(
    (video) => video?.trainer_video && video?.trainer_video?.trim() !== ""
  );
  const videoPanelRef = useRef(null);
  const dispatch = useDispatch();

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

  // Handle video pause from question panel
  const handlePauseVideo = () => {
    if (videoPanelRef.current && videoPanelRef.current.pauseVideo) {
      videoPanelRef.current.pauseVideo();
    }
  };

  // Handle pausing answer audio when video plays
  const handlePauseAnswerAudio = () => {
    // Reset Redux audio state
    dispatch(setIsPlaying({ playing: false, audioId: null }));
    
    // Pause all audio elements in the document
    document.querySelectorAll("audio").forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
      }
    });
  };

  return (
    <div className="relative flex size-full h-[calc(100vh-55px)] flex-col bg-[#F9F9F9] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 px-6 py-5 overflow-hidden">
          <div className="flex w-full h-full min-w-0 bg-white py-3 px-4">
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
              ref={videoPanelRef}
              videos={videos}
              loading={isLoading}
              onVideoStateChange={handleVideoStateChange}
              onPauseVideo={handlePauseVideo}
              onPauseAnswerAudio={handlePauseAnswerAudio}
              width="30%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
